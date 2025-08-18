import React from "react";
import { Card, Divider, Typography, Space } from "antd";
import type { OrderDraft } from "./orderDraft";

interface ReviewStepProps {
  draft: OrderDraft;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ draft }) => {
  const total = draft.products.reduce(
    (sum, p) => sum + (p.price - (p.discount ?? 0)) * p.qty,
    0
  );

  return (
    <Card size="small" style={{ maxWidth: 400, margin: "0 auto" }}>
      <Typography.Title level={4} style={{ marginBottom: 8 }}>
        обзор заказа
      </Typography.Title>

      <Space direction="vertical" size={4} style={{ width: "100%" }}>
        <div>
          <strong>токен:</strong> {draft.token ? "введён" : "не введён"}
        </div>
        <div>
          <strong>клиент:</strong>{" "}
          {draft.client_name ?? draft.client_phone ?? draft.client_id ?? "—"}
        </div>
        <div>
          <strong>счёт:</strong> {draft.paybox_name ?? "—"}
        </div>
        <div>
          <strong>организация:</strong> {draft.organization_name ?? "—"}
        </div>
        <div>
          <strong>склад:</strong> {draft.warehouse_name ?? "—"}
        </div>

        <Divider style={{ margin: "8px 0" }} />

        <Typography.Text strong>
          товары ({draft.products.length})
        </Typography.Text>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {draft.products.map((p) => {
            const lineTotal = (p.price - (p.discount ?? 0)) * p.qty;
            return (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                }}
              >
                <div style={{ flex: 1 }}>
                  {p.name} × {p.qty} {p.unit_name ?? ""}
                  {p.discount ? (
                    <span style={{ color: "red", marginLeft: 4 }}>
                      (-{p.discount} ₽)
                    </span>
                  ) : null}
                </div>
                <div>
                  {p.discount ? (
                    <span
                      style={{ textDecoration: "line-through", marginRight: 4 }}
                    >
                      {p.price * p.qty} ₽
                    </span>
                  ) : null}
                  <strong>{lineTotal} ₽</strong>
                </div>
              </div>
            );
          })}
        </div>

        <Divider style={{ margin: "8px 0" }} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 16,
          }}
        >
          <strong>итого:</strong>
          <strong>{total} ₽</strong>
        </div>
      </Space>
    </Card>
  );
};
