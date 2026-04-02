import type { MovementType, Prisma } from "@prisma/client";
import { getPrisma } from "./prisma";

function assert(cond: boolean, message: string): asserts cond {
  if (!cond) throw new Error(message);
}

async function ensureStockLevel(
  productId: string,
  warehouseId: string,
  tx: Prisma.TransactionClient,
) {
  let row = await tx.stockLevel.findUnique({
    where: { productId_warehouseId: { productId, warehouseId } },
  });
  if (!row) {
    row = await tx.stockLevel.create({
      data: { productId, warehouseId, quantity: 0, minStock: 0 },
    });
  }
  return row;
}

/** Registra movimentação e atualiza níveis de estoque. Quantidades nas linhas são sempre positivas. */
export async function aplicarMovimentacao(params: {
  type: MovementType;
  reference?: string | null;
  notes?: string | null;
  lines: { productId: string; warehouseId: string; quantity: number }[];
}) {
  const { type, reference, notes, lines } = params;
  assert(lines.length > 0, "Informe ao menos uma linha.");
  for (const l of lines) assert(l.quantity > 0, "Quantidade deve ser positiva.");

  return getPrisma().$transaction(async (tx) => {
    const movement = await tx.stockMovement.create({
      data: {
        type,
        reference: reference ?? undefined,
        notes: notes ?? undefined,
        lines: {
          create: lines.map((l) => ({
            productId: l.productId,
            warehouseId: l.warehouseId,
            quantity: l.quantity,
          })),
        },
      },
    });

    for (const l of lines) {
      const row = await ensureStockLevel(l.productId, l.warehouseId, tx);
      if (type === "ENTRADA") {
        await tx.stockLevel.update({
          where: { id: row.id },
          data: { quantity: { increment: l.quantity } },
        });
      } else if (type === "SAIDA") {
        assert(row.quantity >= l.quantity, "Estoque insuficiente para esta saída.");
        await tx.stockLevel.update({
          where: { id: row.id },
          data: { quantity: { decrement: l.quantity } },
        });
      } else if (type === "AJUSTE") {
        await tx.stockLevel.update({
          where: { id: row.id },
          data: { quantity: l.quantity },
        });
      }
    }

    return movement;
  });
}
