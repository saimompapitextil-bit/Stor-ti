import { ControleEstoque } from "@/components/controle-estoque/ControleEstoque";
import { EstoqueConfigMissing } from "@/components/estoque/EstoqueConfigMissing";
import { fetchEstoquePageData } from "@/lib/queries/estoque";
import { isDatabaseConfigured } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EstoquePage() {
  if (!isDatabaseConfigured()) {
    return <EstoqueConfigMissing />;
  }

  try {
    const data = await fetchEstoquePageData();
    return <ControleEstoque {...data} />;
  } catch {
    return <EstoqueConfigMissing falhaConexao />;
  }
}
