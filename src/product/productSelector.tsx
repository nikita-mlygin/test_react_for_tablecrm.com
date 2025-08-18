import React, { useEffect, useState } from "react";
import { Modal, Input, Button, Table, InputNumber, Row, Col, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { Product, SelectedProduct } from "./product";

interface ProductSelectorProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (items: SelectedProduct[]) => void;
}

// хук поиска товаров
function useProductSearch() {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      if (!query) {
        setProducts(
          Array.from({ length: 8 }, (_, i) => ({
            id: `p_${i + 1}`,
            name: `Товар ${i + 1}`,
            sku: `SKU${100 + i}`,
            price: 100 + i * 10,
          }))
        );
      } else {
        setProducts(
          Array.from({ length: 6 }, (_, i) => ({
            id: `p_${query}_${i + 1}`,
            name: `${query} товар ${i + 1}`,
            sku: `SKU${500 + i}`,
            price: 150 + i * 15,
          }))
        );
      }
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, [query]);

  return { products, setQuery, loading };
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const { products, setQuery, loading } = useProductSearch();
  const [selectedRows, setSelectedRows] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!visible) {
      setSelectedRows([]);
      setQuantities({});
    }
  }, [visible]);

  const columns = [
    { title: "наименование", dataIndex: "name", key: "name" },
    { title: "sku", dataIndex: "sku", key: "sku" },
    { title: "цена", dataIndex: "price", key: "price" },
    {
      title: "кол-во",
      key: "qty",
      render: (_: any, record: Product) => (
        <InputNumber
          min={1}
          value={quantities[record.id] || 1}
          onChange={(val) =>
            setQuantities((s) => ({ ...s, [record.id]: Number(val) || 1 }))
          }
        />
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedRows.map((r) => r.id),
    onChange: (_keys: React.Key[], rows: Product[]) => setSelectedRows(rows),
  };

  return (
    <Modal
      title="Выбрать товары"
      open={visible}
      onCancel={onClose}
      onOk={() => {
        const prepared: SelectedProduct[] = selectedRows.map((r) => ({
          ...r,
          qty: quantities[r.id] || 1,
        }));
        onAdd(prepared);
        onClose();
      }}
      width={760}
      okText="Добавить"
    >
      <Row gutter={[8, 8]} style={{ marginBottom: 8 }}>
        <Col span={18}>
          <Input
            placeholder="Поиск товара..."
            prefix={<SearchOutlined />}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Col>
        <Col span={6}>
          <Button onClick={() => setQuery("")}>сброс</Button>
        </Col>
      </Row>

      <Spin spinning={loading}>
        <Table
          rowKey={(r: Product) => r.id}
          dataSource={products}
          columns={columns}
          rowSelection={rowSelection}
          pagination={{ pageSize: 6 }}
        />
      </Spin>
    </Modal>
  );
};
