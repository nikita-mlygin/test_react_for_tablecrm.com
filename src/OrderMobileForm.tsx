import React, { useEffect, useState, useRef } from "react";
import { Form, Button, Row, Col, Card, Steps, message } from "antd";
import { useOrderDraft, type OrderDraft } from "./order/orderDraft";
import { TokenStep } from "./authorization/token/tokenStep";
import type { Client } from "./client/client";
import { ClientStep } from "./client/clientStep";
import type { DictItem } from "./common/dictItem";
import { RequisitesStep } from "./order/requisite/requisiteSteps";
import { ProductsStep } from "./product/productStep";
import { ReviewStep } from "./order/reviewStep";

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
}

interface SelectedProduct extends Product {
  qty: number;
}

export interface FormValues {
  client_phone?: string;
  client_id?: number | null;
  client_name?: string;
  invoice_id?: string | number;
  organization_id?: string | number;
  warehouse_id?: string | number;
  price_type?: string | number;
}

interface SalePayload {
  token: string;
  client_phone?: string;
  client_id?: number | null;
  invoice_id?: string | number;
  organization_id?: string | number;
  warehouse_id?: string | number;
  price_type?: string | number;
  products: { id: string; qty: number; price: number }[];
  meta?: Record<string, unknown>;
}

function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function useClientSearch() {
  const [queryPhone, setQueryPhone] = useState<string>("");
  const [queryName, setQueryName] = useState<string>("");
  const debouncedPhone = useDebouncedValue(queryPhone, 500);
  const debouncedName = useDebouncedValue(queryName, 500);
  const [loading, setLoading] = useState<boolean>(false);
  const [clients, setClients] = useState<Client[]>([]);

  const setQuery = (value: string, field: "phone" | "name" = "phone") => {
    if (field === "phone") setQueryPhone(value);
    else setQueryName(value);
  };

  useEffect(() => {
    const q = debouncedName || debouncedPhone;
    if (!q) {
      setClients([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(() => {
      if (debouncedName) {
        setClients([
          { id: 297724, name: `${debouncedName} Test`, phone: "71231231232" },
          { id: 297725, name: `${debouncedName} Inc`, phone: "70000000000" },
        ]);
      } else {
        setClients([
          {
            id: 297724,
            name: `Test from ${debouncedPhone}`,
            phone: debouncedPhone,
          },
          {
            id: 297725,
            name: `Another ${debouncedPhone}`,
            phone: `${debouncedPhone}9`,
          },
        ]);
      }
      setLoading(false);
    }, 700);
    return () => clearTimeout(t);
  }, [debouncedPhone, debouncedName]);

  return { clients, setQuery, loading } as const;
}

function useDictionary(name: string) {
  const [items, setItems] = useState<DictItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      const fake: DictItem[] = Array.from({ length: 5 }, (_, i) => ({
        id: `${name}_${i + 1}`,
        title: `${name} ${i + 1}`,
      }));
      setItems(fake);
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, [name]);

  return { items, loading } as const;
}

function useCreateSale() {
  const create = async ({
    token,
    payload,
    conduct = false,
  }: {
    token: string;
    payload: SalePayload;
    conduct?: boolean;
  }) => {
    return new Promise<{ ok: boolean; id: string }>((resolve, reject) => {
      setTimeout(() => {
        if (!token) return reject(new Error("no token provided"));
        console.log("POST payload (simulate):", { payload, conduct, token });
        resolve({ ok: true, id: `sale_${Date.now()}` });
      }, 900);
    });
  };
  return { create } as const;
}

export const OrderMobileForm: React.FC = () => {
  const { clients, setQuery: setClientQuery } = useClientSearch();

  const invoices = useDictionary("счёт");
  const organizations = useDictionary("организация");
  const warehouses = useDictionary("склад");
  const priceTypes = useDictionary("тип_цены");

  const [form] = Form.useForm<FormValues>();

  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    []
  );
  const { create } = useCreateSale();
  const [loadingCreate, setLoadingCreate] = useState(false);

  const [currentStep, setCurrentStep] = useState<number>(0);

  const stepsRef = useRef<HTMLDivElement | null>(null);

  const steps = [
    { title: "токен" },
    { title: "клиент" },
    { title: "реквизиты" },
    { title: "товары" },
    { title: "обзор" },
  ];

  const { draft, updateDraft, resetDraft } = useOrderDraft();

  const next = async () => {
    try {
      await form.validateFields();
      if (currentStep === 3 && draft.products.length === 0)
        return message.error("добавьте хотя бы один товар");
      setCurrentStep((s) => s + 1);
    } catch {}
  };

  const prev = () => setCurrentStep((s) => Math.max(0, s - 1));

  const buildPayload = (draft: OrderDraft) => ({
    operation: "Заказ",
    dated: Math.floor(Date.now() / 1000),
    tax_included: true,
    tax_active: true,
    goods: draft.products.map((p) => ({
      nomenclature: p.id,
      quantity: p.qty,
      price: p.price,
      unit: p.unit ?? 1,
      discount: 0,
      sum_discounted: 0,
    })),
    settings: {},
    loyality_card_id: draft.loyality_card_id ?? null,
    warehouse: draft.warehouse_id,
    contragent: draft.client_id ?? null,
    paybox: draft.invoice_id,
    organization: draft.organization_id,
    status: true,
    paid_rubles: draft.paid_rubles ?? 0,
    paid_lt: draft.paid_lt ?? 0,
    sum: draft.products.reduce((acc, p) => acc + p.price * p.qty, 0),
  });

  const onSubmit = async (conduct = false) => {
    try {
      if (!draft.token) return message.error("введите токен");
      if (draft.products.length === 0)
        return message.error("добавьте хотя бы один товар");

      const payload = buildPayload(draft);
      setLoadingCreate(true);
      const res = await create({ token: draft.token, payload, conduct });
      message.success(`Успех: ${res.id}`);
      resetDraft();
      setCurrentStep(0);
    } catch (e: any) {
      message.error(e?.message || "Ошибка при создании");
    } finally {
      setLoadingCreate(false);
    }
  };

  return (
    <div style={{ padding: 12, maxWidth: 720, margin: "0 auto" }}>
      <Card size="small">
        <div style={{ width: "100%" }}>
          <div ref={stepsRef} style={{ width: "100%" }}>
            <Steps
              current={currentStep}
              size="small"
              style={{ marginBottom: 16 }}
              type="inline"
            >
              {steps.map((s, idx) => (
                <Steps.Step key={s.title} title={s.title} />
              ))}
            </Steps>
          </div>
        </div>

        <Form form={form} layout="vertical">
          {currentStep === 0 && (
            <TokenStep draft={draft} updateDraft={updateDraft} />
          )}

          {currentStep === 1 && (
            <ClientStep draft={draft} updateDraft={updateDraft} form={form} />
          )}

          {currentStep === 2 && (
            <RequisitesStep draft={draft} updateDraft={updateDraft} />
          )}

          {currentStep === 3 && (
            <ProductsStep draft={draft} updateDraft={updateDraft} />
          )}

          {currentStep === 4 && <ReviewStep draft={draft} />}

          <Row gutter={8} style={{ marginTop: 12 }}>
            <Col>
              {currentStep > 0 && <Button onClick={prev}>назад</Button>}
            </Col>
            <Col>
              {currentStep < steps.length - 1 && (
                <Button type="primary" onClick={next}>
                  далее
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <>
                  <Button
                    onClick={() => onSubmit(false)}
                    loading={loadingCreate}
                    style={{ marginRight: 8 }}
                  >
                    создать
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => onSubmit(true)}
                    loading={loadingCreate}
                  >
                    создать и провести
                  </Button>
                </>
              )}
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default OrderMobileForm;
