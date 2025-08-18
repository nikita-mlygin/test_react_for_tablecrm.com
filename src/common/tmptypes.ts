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
