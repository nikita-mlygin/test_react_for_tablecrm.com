import { produce } from "immer";
import { useState, useCallback } from "react";
import type { SelectedProduct } from "../product/product";
// остальной импорт оставляем

// определяем общий draft
export interface OrderDraft {
  token: string;

  // контрагент
  client_id?: number;
  client_phone?: string;
  client_name?: string;

  // счета / реквизиты
  invoice_id?: string | number;

  organization_id?: number;
  organization_name?: string;

  warehouse_id?: number;
  warehouse_name?: string;

  price_type?: number;
  price_name?: string;

  // доп. поля
  paybox_id?: number;
  paybox_name?: string;

  loyality_card_id?: number;

  // товары
  products: SelectedProduct[];

  // статус и сумма
  status?: boolean;
  sum?: number;
}

export function useOrderDraft(initial?: Partial<OrderDraft>) {
  const [draft, setDraft] = useState<OrderDraft>({
    token: "",
    client_phone: undefined,
    client_id: undefined,
    client_name: undefined,
    invoice_id: undefined,
    organization_id: undefined,
    warehouse_id: undefined,
    price_type: undefined,
    products: [],
    ...initial,
  });

  const updateDraft = useCallback((fn: (draft: OrderDraft) => void) => {
    setDraft((cur) => produce(cur, fn));
  }, []);

  const resetDraft = useCallback(() => {
    setDraft({
      token: "",
      client_phone: undefined,
      client_id: undefined,
      client_name: undefined,
      invoice_id: undefined,
      organization_id: undefined,
      warehouse_id: undefined,
      price_type: undefined,
      products: [],
      ...initial,
    });
  }, [initial]);

  return { draft, updateDraft, resetDraft };
}
