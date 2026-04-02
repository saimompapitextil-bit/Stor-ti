import { PrismaClient, ProductType, PurchaseOrderStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.movementLine.deleteMany();
  await prisma.movement.deleteMany();
  await prisma.purchaseOrderLine.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.stockLevel.deleteMany();
  await prisma.product.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.category.deleteMany();
  await prisma.unitOfMeasure.deleteMany();

  const un = await prisma.unitOfMeasure.create({ data: { code: "UN", name: "Unidade" } });
  const cx = await prisma.unitOfMeasure.create({ data: { code: "CX", name: "Caixa" } });
  const pc = await prisma.unitOfMeasure.create({ data: { code: "PC", name: "Pacote" } });

  const catTi = await prisma.category.create({ data: { name: "Infraestrutura de TI" } });
  const catRede = await prisma.category.create({
    data: { name: "Rede e conectividade", parentId: catTi.id },
  });
  const catEsc = await prisma.category.create({ data: { name: "Escritório" } });

  const whSp = await prisma.warehouse.create({
    data: {
      code: "SP-MAT",
      name: "CD Matriz — São Paulo",
      address: "Av. Paulista, 1000",
      manager: "Maria Silva",
    },
  });
  const whRj = await prisma.warehouse.create({
    data: {
      code: "RJ-FIL",
      name: "Filial Rio de Janeiro",
      address: "Rua ABC, 200",
      manager: "João Santos",
    },
  });
  const whMg = await prisma.warehouse.create({
    data: {
      code: "MG-FIL",
      name: "Filial Belo Horizonte",
      address: "Av. Afonso Pena, 300",
      manager: "Ana Costa",
    },
  });

  const sup1 = await prisma.supplier.create({
    data: {
      name: "TechSupply Brasil Ltda",
      doc: "12.345.678/0001-90",
      email: "vendas@techsupply.example",
      phone: "(11) 3000-0000",
    },
  });

  const p1 = await prisma.product.create({
    data: {
      sku: "SW-48P-001",
      name: "Switch gerenciável 48 portas Gigabit",
      description: "Camada 2/3, empilhável",
      type: ProductType.ASSET,
      categoryId: catRede.id,
      unitId: un.id,
    },
  });
  const p2 = await prisma.product.create({
    data: {
      sku: "PATCH-CAT6-305",
      name: "Cabo patch CAT6 3m azul",
      type: ProductType.CONSUMABLE,
      categoryId: catRede.id,
      unitId: un.id,
    },
  });
  const p3 = await prisma.product.create({
    data: {
      sku: "PAP-A4-500",
      name: "Papel A4 500 folhas 75g",
      type: ProductType.CONSUMABLE,
      categoryId: catEsc.id,
      unitId: pc.id,
    },
  });

  await prisma.stockLevel.createMany({
    data: [
      { productId: p1.id, warehouseId: whSp.id, quantity: 120, minStock: 20, maxStock: 200 },
      { productId: p1.id, warehouseId: whRj.id, quantity: 15, minStock: 5, maxStock: 40 },
      { productId: p2.id, warehouseId: whSp.id, quantity: 800, minStock: 100, maxStock: 2000 },
      { productId: p2.id, warehouseId: whMg.id, quantity: 200, minStock: 50, maxStock: 500 },
      { productId: p3.id, warehouseId: whSp.id, quantity: 400, minStock: 80, maxStock: 1000 },
    ],
  });

  const po = await prisma.purchaseOrder.create({
    data: {
      number: "PO-2026-0001",
      supplierId: sup1.id,
      status: PurchaseOrderStatus.SENT,
      expectedAt: new Date("2026-04-15"),
      notes: "Entrega parcial autorizada",
      lines: {
        create: [
          { productId: p1.id, quantityOrdered: 30, quantityReceived: 0, unitPrice: 4200 },
          { productId: p2.id, quantityOrdered: 500, quantityReceived: 0, unitPrice: 12.5 },
        ],
      },
    },
  });

  console.log("Seed OK:", { warehouses: 3, products: 3, purchaseOrder: po.number });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
