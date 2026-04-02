"use server";

import { revalidatePath } from "next/cache";
import { getPrisma } from "@/lib/prisma";
import { aplicarMovimentacao } from "@/lib/stock";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function cadastrarProduto(formData: FormData): Promise<ActionResult> {
  const sku = String(formData.get("sku") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const unitId = String(formData.get("unitId") ?? "").trim();
  const warehouseId = String(formData.get("warehouseId") ?? "").trim();
  const quantity = Number(String(formData.get("quantity") ?? "0").replace(",", "."));
  const minStock = Number(String(formData.get("minStock") ?? "0").replace(",", "."));
  const maxStockRaw = String(formData.get("maxStock") ?? "").trim();
  const maxStock = maxStockRaw === "" ? null : Number(maxStockRaw.replace(",", "."));
  const locationLabel = String(formData.get("locationLabel") ?? "").trim() || null;

  if (!sku) return { ok: false, error: "SKU é obrigatório." };
  if (!name) return { ok: false, error: "Nome é obrigatório." };
  if (!categoryId) return { ok: false, error: "Selecione uma categoria." };
  if (!unitId) return { ok: false, error: "Selecione uma unidade." };
  if (!warehouseId) return { ok: false, error: "Selecione um armazém." };
  if (Number.isNaN(quantity) || quantity < 0) return { ok: false, error: "Quantidade inválida." };
  if (Number.isNaN(minStock) || minStock < 0) return { ok: false, error: "Estoque mínimo inválido." };
  if (maxStock !== null && (Number.isNaN(maxStock) || maxStock < 0)) {
    return { ok: false, error: "Estoque máximo inválido." };
  }

  try {
    const prisma = getPrisma();
    await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          sku,
          name,
          categoryId,
          unitId,
          stockLevels: {
            create: {
              warehouseId,
              quantity,
              minStock,
              maxStock,
              locationLabel,
            },
          },
        },
      });
      if (quantity > 0) {
        await tx.stockMovement.create({
          data: {
            type: "ENTRADA",
            reference: "Cadastro inicial",
            notes: `Produto ${product.sku} cadastrado`,
            lines: {
              create: {
                productId: product.id,
                warehouseId,
                quantity,
              },
            },
          },
        });
      }
    });
    revalidatePath("/estoque");
    return { ok: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro ao salvar.";
    if (msg.includes("Unique constraint") && msg.includes("sku")) {
      return { ok: false, error: "Já existe produto com este SKU." };
    }
    return { ok: false, error: msg };
  }
}

export async function registrarEntradaRapida(formData: FormData): Promise<ActionResult> {
  const productId = String(formData.get("productId") ?? "").trim();
  const warehouseId = String(formData.get("warehouseId") ?? "").trim();
  const quantity = Number(String(formData.get("quantity") ?? "0").replace(",", "."));
  const reference = String(formData.get("reference") ?? "").trim() || null;

  if (!productId || !warehouseId) return { ok: false, error: "Dados incompletos." };
  if (Number.isNaN(quantity) || quantity <= 0) return { ok: false, error: "Quantidade deve ser maior que zero." };

  try {
    await aplicarMovimentacao({
      type: "ENTRADA",
      reference,
      lines: [{ productId, warehouseId, quantity }],
    });
    revalidatePath("/estoque");
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : "Erro na entrada." };
  }
}

export async function registrarSaidaRapida(formData: FormData): Promise<ActionResult> {
  const productId = String(formData.get("productId") ?? "").trim();
  const warehouseId = String(formData.get("warehouseId") ?? "").trim();
  const quantity = Number(String(formData.get("quantity") ?? "0").replace(",", "."));
  const reference = String(formData.get("reference") ?? "").trim() || null;

  if (!productId || !warehouseId) return { ok: false, error: "Dados incompletos." };
  if (Number.isNaN(quantity) || quantity <= 0) return { ok: false, error: "Quantidade inválida." };

  try {
    await aplicarMovimentacao({
      type: "SAIDA",
      reference,
      lines: [{ productId, warehouseId, quantity }],
    });
    revalidatePath("/estoque");
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : "Erro na saída." };
  }
}
