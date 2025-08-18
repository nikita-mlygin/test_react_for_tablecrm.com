import React, { useState } from "react";
import {
  Modal,
  Input,
  Button,
  Table,
  Row,
  Col,
  Spin,
  Tree,
  Drawer,
} from "antd";
import { SearchOutlined, MenuOutlined } from "@ant-design/icons";
import type { Product } from "./product";
import {
  useCategoriesTree,
  useNomenclatureByCategory,
} from "../common/tempqueries";
import type { DataNode } from "antd/es/tree";
import type { CategoryNode } from "../common/tmptypes";

interface ProductSelectorProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (item: Product) => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    number | undefined
  >();
  const [search, setSearch] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);

  const { data: categories, isLoading: loadingCategories } =
    useCategoriesTree();
  const {
    data: products,
    isLoading: loadingProducts,
    isFetching: fetchingProducts,
  } = useNomenclatureByCategory(selectedCategory);

  const filteredProducts =
    products?.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

  const renderTreeNodes = (nodes: CategoryNode[]): DataNode[] =>
    nodes.map((node) => ({
      title: node.name,
      key: node.key,
      children: node.children ? renderTreeNodes(node.children) : [],
    }));

  return (
    <Modal
      title="Выбор товара"
      open={visible}
      onCancel={onClose}
      footer={null}
      width="90vw"
      style={{ top: 20 }}
      styles={{ body: { maxHeight: "80vh", overflowY: "auto" } }}
    >
      <Row gutter={16}>
        {/* кнопка открыть drawer */}
        <Col style={{ marginBottom: 8 }}>
          <Button
            type="link"
            icon={<MenuOutlined />}
            onClick={() => setDrawerVisible(true)}
          >
            категории
          </Button>
        </Col>

        {/* таблица товаров занимает всю ширину */}
        <Col span={24}>
          <Input
            placeholder="Поиск по названию"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: 12 }}
          />
          {loadingProducts || fetchingProducts ? (
            <Spin />
          ) : (
            <Table
              virtual
              scroll={{ y: 400 }}
              pagination={false}
              dataSource={filteredProducts.map((p) => ({
                ...p,
                price: p.prices?.[0]?.price ?? 0,
              }))}
              rowKey="id"
              columns={[
                { title: "Название", dataIndex: "name", key: "name" },
                {
                  title: "Цена",
                  dataIndex: "price",
                  key: "price",
                  render: (v) => `${v} ₽`,
                },
                {
                  title: "",
                  key: "action",
                  render: (_, record: Product) => (
                    <Button type="primary" onClick={() => onAdd(record)}>
                      Добавить
                    </Button>
                  ),
                },
              ]}
            />
          )}
        </Col>
      </Row>

      {/* Drawer с категориями */}
      <Drawer
        title="Категории"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        bodyStyle={{ padding: 0 }}
      >
        {loadingCategories ? (
          <Spin />
        ) : (
          <Tree
            virtual
            height={window.innerHeight * 0.6}
            treeData={renderTreeNodes(categories || [])}
            onSelect={(keys) =>
              setSelectedCategory(keys.length ? Number(keys[0]) : undefined)
            }
          />
        )}
      </Drawer>
    </Modal>
  );
};
