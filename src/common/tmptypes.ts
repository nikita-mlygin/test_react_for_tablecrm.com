export interface Contragent {
  id: number;
  name: string;
  external_id?: string | null;
  phone?: string | null;
  email?: string | null;
  cashbox: number;
  is_deleted: boolean;
  created_at: number;
  updated_at: number;
}

export interface Warehouse {
  id: number;
  name: string;
  start_balance: number;
  balance: number;
  balance_date: number;
  created_at: number;
  updated_at: number;
}

export interface Organization {
  id: number;
  short_name: string;
  full_name?: string | null;
  org_type?: string | null;
  created_at: number;
  updated_at: number;
}

export interface PriceType {
  id: number;
  name: string;
  created_at: number;
  updated_at: number;
}

export interface SalePayload {
  priority?: number; // обычно 0
  dated?: number; // timestamp, если нужен
  operation: "Заказ" | "Возврат" | string;
  tax_included?: boolean;
  tax_active?: boolean;
  goods: {
    price: number;
    quantity: number;
    unit: number; // id единицы измерения
    discount?: number;
    sum_discounted?: number;
    nomenclature: number; // id товара
  }[];
  settings?: Record<string, unknown>;
  loyality_card_id?: number;
  warehouse: number; // id склада
  contragent: number; // id контрагента
  paybox?: number; // id кассы
  organization: number; // id организации
  status?: boolean; // true если создано
  paid_rubles?: number;
  paid_lt?: number;
  sum: number; // итоговая сумма
}

export interface LoyaltyCard {
  id: number;
  client_id: number;
  card_number: string;
  balance: number;
}

export interface CategoryNode {
  key: number;
  name: string;
  nom_count: number;
  description?: string;
  parent?: number | null;
  children: CategoryNode[];
  expanded_flag?: boolean;
}

export interface Paybox {
  id: number;
  external_id: string | null;
  name: string;
  start_balance: number;
  balance: number;
  balance_date: number;
  created_at: number;
  update_start_balance: number;
  update_start_balance_date: number;
  organization_id: number | null;
  updated_at: number;
}

export type DocSaleSettings = {
  repeatability_period?: string; // например, "minutes"
  repeatability_value?: number;
  date_next_created?: number;
  transfer_from_weekends?: boolean;
  skip_current_month?: boolean;
  repeatability_count?: number;
  default_payment_status?: boolean;
  repeatability_tags?: boolean;
  repeatability_status?: boolean;
};

export type DocSaleItem = {
  price_type?: number;
  price: number;
  quantity: number;
  unit?: number;
  unit_name?: string;
  tax?: number;
  discount?: number;
  sum_discounted?: number;
  status?: string;
  nomenclature: string | number;
  nomenclature_name?: string;
};

export type DocSaleCreateItem = {
  number?: string;
  dated?: number;
  operation?: string;
  tags?: string;
  parent_docs_sales?: number;
  comment?: string;
  client?: number;
  contragent?: number;
  contract?: number;
  organization: number;
  loyality_card_id?: number;
  warehouse?: number;
  paybox?: number;
  tax_included?: boolean;
  tax_active?: boolean;
  settings?: DocSaleSettings;
  sales_manager?: number;
  paid_rubles?: number;
  paid_lt?: number;
  status?: boolean;
  goods?: DocSaleItem[];
  priority?: number;
};

export type DocSaleCreateMass = DocSaleCreateItem[];
