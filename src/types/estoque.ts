export type StockTableRow = {
  id: string;
  productId: string;
  warehouseId: string;
  sku: string;
  productName: string;
  categoryId: string;
  categoryName: string;
  quantity: number;
  minStock: number;
  maxStock: number | null;
  unitCode: string;
  location: string;
  status: "ok" | "critico";
};

export type MovementTableRow = {
  id: string;
  createdAt: string;
  type: string;
  productName: string;
  quantity: number;
  warehouseCode: string;
  reference: string | null;
};

export type EstoqueStats = {
  totalItens: number;
  produtosCadastrados: number;
  estoqueCritico: number;
};

export type SelectOption = { id: string; name: string; code?: string };
