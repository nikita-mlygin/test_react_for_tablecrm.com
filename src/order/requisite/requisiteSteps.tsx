import React, { useState } from "react";
import { Form, Select, Row, Col, AutoComplete } from "antd";
import type { OrderDraft } from "../orderDraft";
import {
  useOrganizations,
  usePriceTypes,
  useWarehouses,
  usePayboxes,
} from "../../common/tempqueries";

interface RequisitesStepProps {
  draft: OrderDraft;
  updateDraft: (fn: (draft: OrderDraft) => void) => void;
}

export const RequisitesStep: React.FC<RequisitesStepProps> = ({
  draft,
  updateDraft,
}) => {
  const [payboxSearch, setPayboxSearch] = useState("");

  const { data: warehouses = [], isLoading: warehousesLoading } =
    useWarehouses();
  const { data: organizations = [], isLoading: organizationsLoading } =
    useOrganizations();
  const { data: priceTypes = [], isLoading: priceTypesLoading } =
    usePriceTypes();

  const { data: payboxes = [], isLoading: payboxesLoading } =
    usePayboxes(payboxSearch);

  return (
    <>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            label="организация"
            required
            validateStatus={!draft.organization_id ? "error" : undefined}
            help={!draft.organization_id ? "выберите организацию" : undefined}
          >
            <Select
              showSearch
              placeholder="организация"
              loading={organizationsLoading}
              value={draft.organization_id}
              onSelect={(val, o) =>
                updateDraft((d) => {
                  d.organization_id = val;
                  d.organization_name = o.label;
                })
              }
              options={organizations.map((it) => ({
                value: it.id,
                label: it.short_name,
              }))}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="склад"
            required
            validateStatus={!draft.warehouse_id ? "error" : undefined}
            help={!draft.warehouse_id ? "выберите склад" : undefined}
          >
            <Select
              showSearch
              placeholder="склад"
              loading={warehousesLoading}
              value={draft.warehouse_id}
              onSelect={(val, o) =>
                updateDraft((d) => {
                  d.warehouse_id = val;
                  d.warehouse_name = o.label;
                })
              }
              options={warehouses.map((it) => ({
                value: it.id,
                label: it.name,
              }))}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="тип цены"
        required
        validateStatus={!draft.price_type ? "error" : undefined}
        help={!draft.price_type ? "выберите тип цены" : undefined}
      >
        <Select
          showSearch
          placeholder="тип цены"
          loading={priceTypesLoading}
          value={draft.price_type}
          onChange={(val) =>
            updateDraft((d) => {
              d.price_type = val;
            })
          }
          options={priceTypes.map((it) => ({
            value: it.id,
            label: it.name,
          }))}
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
        />
      </Form.Item>

      <Form.Item
        label="счёт / paybox"
        required
        validateStatus={!draft.paybox_id ? "error" : undefined}
        help={!draft.paybox_id ? "выберите счёт" : undefined}
      >
        <Select
          showSearch
          placeholder="выберите счёт"
          loading={payboxesLoading}
          value={draft.paybox_id}
          onSelect={(_, v) =>
            updateDraft((d) => {
              d.paybox_id = v.key;
              d.paybox_name = v.pb.name;
            })
          }
          options={payboxes.map((pb) => ({
            value: pb.id,
            label: `${pb.name} — баланс: ${pb.balance}`,
            key: pb.id,
            pb,
          }))}
          notFoundContent={payboxesLoading ? "загрузка..." : "не найдено"}
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
        />
      </Form.Item>
    </>
  );
};
