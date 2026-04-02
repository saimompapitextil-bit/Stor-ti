import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.stockMovementLine.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.stockLevel.deleteMany();
  await prisma.product.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.category.deleteMany();
  await prisma.unitOfMeasure.deleteMany();

  const un = await prisma.unitOfMeasure.create({ data: { code: "UN", name: "Unidade" } });
  const cx = await prisma.unitOfMeasure.create({ data: { code: "CX", name: "Caixa" } });
  await prisma.unitOfMeasure.create({ data: { code: "PC", name: "Pacote" } });

  const catRede = await prisma.category.create({ data: { name: "Rede", slug: "rede" } });
  const catEsc = await prisma.category.create({ data: { name: "Escritório", slug: "escritorio" } });
  await prisma.category.create({ data: { name: "TI", slug: "ti" } });

  const whSp = await prisma.warehouse.create({
    data: { code: "SP-MAT", name: "CD Matriz — São Paulo" },
  });
  const whRj = await prisma.warehouse.create({
    data: { code: "RJ-FIL", name: "Filial Rio de Janeiro" },
  });

  const p1 = await prisma.product.create({
    data: {
      sku: "SW-48P-001",
      name: "Switch gerenciável 48 portas",
      categoryId: catRede.id,
      unitId: un.id,
    },
  });
  const p2 = await prisma.product.create({
    data: {
      sku: "PATCH-CAT6-305",
      name: "Cabo patch CAT6 3m",
      categoryId: catRede.id,
      unitId: un.id,
    },
  });
  const p3 = await prisma.product.create({
    data: {
      sku: "PAP-A4-500",
      name: "Papel A4 500 folhas",
      categoryId: catEsc.id,
      unitId: cx.id,
    },
  });

  await prisma.stockLevel.create({
    data: {
      productId: p1.id,
      warehouseId: whSp.id,
      quantity: 24,
      minStock: 10,
      maxStock: 100,
      locationLabel: "A-12",
    },
  });
  await prisma.stockLevel.create({
    data: {
      productId: p1.id,
      warehouseId: whRj.id,
      quantity: 4,
      minStock: 5,
      maxStock: 30,
      locationLabel: "B-01",
    },
  });
  await prisma.stockLevel.create({
    data: {
      productId: p2.id,
      warehouseId: whSp.id,
      quantity: 500,
      minStock: 80,
      maxStock: 2000,
      locationLabel: "C-08",
    },
  });

  await prisma.stockLevel.create({
    data: {
      productId: p3.id,
      warehouseId: whSp.id,
      quantity: 120,
      minStock: 40,
      maxStock: 800,
      locationLabel: "D-02",
    },
  });

  console.log("Seed concluído.", {
    produtos: 3,
    niveis: 4,
    p1RjCritico: "quantidade 4 abaixo do mínimo 5",
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
