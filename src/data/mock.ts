/** Dados fictícios só para o protótipo de interface (sem API / banco). */

export type StockAlert = {
  id: string;
  sku: string;
  productName: string;
  warehouseCode: string;
  quantity: number;
  minStock: number;
};

export const mockStats = {
  productsActive: 128,
  warehousesActive: 4,
} as const;

export const mockAlerts: StockAlert[] = [
  {
    id: "1",
    sku: "SW-48P-001",
    productName: "Switch gerenciável 48 portas",
    warehouseCode: "SP-MAT",
    quantity: 8,
    minStock: 20,
  },
  {
    id: "2",
    sku: "PATCH-CAT6-305",
    productName: "Cabo patch CAT6 3m",
    warehouseCode: "RJ-FIL",
    quantity: 42,
    minStock: 100,
  },
  {
    id: "3",
    sku: "PAP-A4-500",
    productName: "Papel A4 500 fls",
    warehouseCode: "MG-FIL",
    quantity: 55,
    minStock: 80,
  },
];

export type ProductRow = {
  sku: string;
  name: string;
  category: string;
  status: "Ativo" | "Inativo";
};

export const mockProducts: ProductRow[] = [
  { sku: "SW-48P-001", name: "Switch 48p Gigabit", category: "Rede", status: "Ativo" },
  { sku: "PATCH-CAT6-305", name: "Patch cord CAT6 3m", category: "Rede", status: "Ativo" },
  { sku: "PAP-A4-500", name: "Papel A4 75g", category: "Escritório", status: "Ativo" },
  { sku: "MON-27-4K", name: "Monitor 27\" 4K", category: "Periféricos", status: "Inativo" },
];

export type WarehouseRow = { code: string; name: string; city: string };

export const mockWarehouses: WarehouseRow[] = [
  { code: "SP-MAT", name: "CD Matriz", city: "São Paulo" },
  { code: "RJ-FIL", name: "Filial RJ", city: "Rio de Janeiro" },
  { code: "MG-FIL", name: "Filial BH", city: "Belo Horizonte" },
  { code: "PR-CDC", name: "Hub Sul", city: "Curitiba" },
];

export type StockPosition = {
  sku: string;
  productName: string;
  warehouseCode: string;
  quantity: number;
};

export const mockStockPositions: StockPosition[] = [
  { sku: "SW-48P-001", productName: "Switch 48p", warehouseCode: "SP-MAT", quantity: 120 },
  { sku: "SW-48P-001", productName: "Switch 48p", warehouseCode: "RJ-FIL", quantity: 15 },
  { sku: "PATCH-CAT6-305", productName: "Patch CAT6", warehouseCode: "SP-MAT", quantity: 800 },
  { sku: "PAP-A4-500", productName: "Papel A4", warehouseCode: "SP-MAT", quantity: 400 },
];

export type SupplierRow = { name: string; doc: string; city: string };

export const mockSuppliers: SupplierRow[] = [
  { name: "TechSupply Brasil", doc: "12.345.678/0001-90", city: "São Paulo" },
  { name: "Papelaria Central", doc: "98.765.432/0001-10", city: "Curitiba" },
];
