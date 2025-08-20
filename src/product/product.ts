export interface Product {
  id: number;
  name: string;
  code?: string;
  unit?: number;
  unit_name?: string;
  prices?: { price_type: string; price: number }[];
  balances?: { warehouse_name: string; current_amount: number }[];
  category?: number;
  description_short?: string;
}

export interface SelectedProduct extends Product {
  qty: number;
  price: number;
  priceTypeId: number;
  priceTypeName: number;
  discount: number;
}
