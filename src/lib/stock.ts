import type { MovementType, Prisma } from "@prisma/client";
import { prisma } from "./prisma";

function assert(cond: boolean, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

async function ensureStockLevel(productId: string, warehouseId: string, tx: Prisma.TransactionClient) {
  let row = await tx.stockLevel.findUnique({
    where: { productId_warehouseId: { productId, warehouseId } },
  });
  if (!row) {
    row = await tx.stockLevel.create({
      data: { productId, warehouseId, quantity: 0, reserved: 0, minStock: 0 },
    });
  }
  return row;
}

export async function applyMovement(params: {
  type: MovementType;
  warehouseFromId?: string | null;
  warehouseToId?: string | null;
  reference?: string | null;
  notes?: string | null;
  lines: { productId: string; quantity: number }[];
}) {
  const { type, warehouseFromId, warehouseToId, reference, notes, lines } = params;
  assert(lines.length > 0, "Informe ao menos uma linha de produto.");

  for (const l of lines) {
    assert(l.quantity > 0, "Quantidades devem ser positivas.");
  }

  const isIn = type.startsWith("IN_");
  const isOut = type.startsWith("OUT_");
  const isTransfer = type === "TRANSFER";

  if (isTransfer) {
    assert(!!warehouseFromId && !!warehouseToId, "Transferência exige armazém origem e destino.");
    assert(warehouseFromId !== warehouseToId, "Origem e destino devem ser diferentes.");
  } else if (isIn) {
    assert(!!warehouseToId, "Entrada exige armazém de destino.");
  } else if (isOut) {
    assert(!!warehouseFromId, "Saída exige armazém de origem.");
  }

  return prisma.$transaction(async (tx) => {
    const movement = await tx.movement.create({
      data: {
        type,
        reference: reference ?? undefined,
        notes: notes ?? undefined,
        warehouseFromId: warehouseFromId ?? undefined,
        warehouseToId: warehouseToId ?? undefined,
        lines: {
          create: lines.map((l) => ({
            productId: l.productId,
            quantity: l.quantity,
          })),
        },
      },
    });

    for (const l of lines) {
      if (isTransfer && warehouseFromId && warehouseToId) {
        const from = await ensureStockLevel(l.productId, warehouseFromId, tx);
        assert(from.quantity >= l.quantity, `Estoque insuficiente no armazém de origem para o produto.`);
        await tx.stockLevel.update({
          where: { id: from.id },
          data: { quantity: { decrement: l.quantity } },
        });
        const to = await ensureStockLevel(l.productId, warehouseToId, tx);
        await tx.stockLevel.update({
          where: { id: to.id },
          data: { quantity: { increment: l.quantity } },
        });
      } else if (isIn && warehouseToId) {
        const to = await ensureStockLevel(l.productId, warehouseToId, tx);
        await tx.stockLevel.update({
          where: { id: to.id },
          data: { quantity: { increment: l.quantity } },
        });
      } else if (isOut && warehouseFromId) {
        const from = await ensureStockLevel(l.productId, warehouseFromId, tx);
        assert(from.quantity >= l.quantity, `Estoque insuficiente para baixa.`);
        await tx.stockLevel.update({
          where: { id: from.id },
          data: { quantity: { decrement: l.quantity } },
        });
      }
    }

    return movement;
  });
}
