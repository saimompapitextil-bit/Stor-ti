import { getPrisma } from "@/lib/prisma";
import type { EstoqueStats, MovementTableRow, SelectOption, StockTableRow } from "@/types/estoque";

export async function fetchEstoquePageData(): Promise<{
  categories: SelectOption[];
  units: SelectOption[];
  warehouses: SelectOption[];
  rows: StockTableRow[];
  movements: MovementTableRow[];
  stats: EstoqueStats;
}> {
  const prisma = getPrisma();

  const [categories, units, warehouses, stockLevels, productCount, sumQty, movementList] =
    await Promise.all([
      prisma.category.findMany({ orderBy: { name: "asc" } }),
      prisma.unitOfMeasure.findMany({ orderBy: { code: "asc" } }),
      prisma.warehouse.findMany({ orderBy: { code: "asc" } }),
      prisma.stockLevel.findMany({
        include: {
          product: { include: { category: true, unit: true } },
          warehouse: true,
        },
        orderBy: [{ product: { name: "asc" } }, { warehouse: { code: "asc" } }],
      }),
      prisma.product.count({ where: { active: true } }),
      prisma.stockLevel.aggregate({ _sum: { quantity: true } }),
      prisma.stockMovement.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        include: {
          lines: { include: { product: true, warehouse: true } },
        },
      }),
    ]);

  const rows: StockTableRow[] = stockLevels.map((s) => {
    const critico = s.minStock > 0 && s.quantity <= s.minStock;
    const loc = [s.warehouse.code, s.locationLabel].filter(Boolean).join(" · ");
    return {
      id: s.id,
      productId: s.productId,
      warehouseId: s.warehouseId,
      sku: s.product.sku,
      productName: s.product.name,
      categoryId: s.product.category.id,
      categoryName: s.product.category.name,
      quantity: s.quantity,
      minStock: s.minStock,
      maxStock: s.maxStock,
      unitCode: s.product.unit.code,
      location: loc || s.warehouse.code,
      status: critico ? "critico" : "ok",
    };
  });

  const movements: MovementTableRow[] = [];
  for (const m of movementList) {
    for (const line of m.lines) {
      movements.push({
        id: `${m.id}-${line.id}`,
        createdAt: m.createdAt.toISOString(),
        type: m.type,
        productName: line.product.name,
        quantity: line.quantity,
        warehouseCode: line.warehouse.code,
        reference: m.reference,
      });
    }
  }

  const stats: EstoqueStats = {
    totalItens: Math.round(sumQty._sum.quantity ?? 0),
    produtosCadastrados: productCount,
    estoqueCritico: rows.filter((r) => r.status === "critico").length,
  };

  return {
    categories: categories.map((c) => ({ id: c.id, name: c.name })),
    units: units.map((u) => ({ id: u.id, name: u.name, code: u.code })),
    warehouses: warehouses.map((w) => ({ id: w.id, name: w.name, code: w.code })),
    rows,
    movements,
    stats,
  };
}
