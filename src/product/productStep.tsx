import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  AutoComplete,
  Button,
  List,
  Modal,
  InputNumber,
  Typography,
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import type { OrderDraft } from "../order/orderDraft";
import type { Product, SelectedProduct } from "./product";
import { ProductSelector } from "./productSelector";
import { fetchProductById, useNomenclatureSearch } from "../common/tempqueries";
import { ProductEditCard } from "./card/productEditCard";
import { useQueryClient } from "@tanstack/react-query";

interface ProductsStepProps {
  draft: OrderDraft;
  updateDraft: (fn: (draft: OrderDraft) => void) => void;
}

export const ProductsStep: React.FC<ProductsStepProps> = ({
  draft,
  updateDraft,
}) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<SelectedProduct | null>(null);
  const [editingPriceId, setEditingPriceId] = useState<number | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const queryClient = useQueryClient();

  const debounceTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [search]);

  const { data: searchResults = [], isLoading } =
    useNomenclatureSearch(debouncedSearch);

  const handleAddProduct = (product: Product) => {
    const selected: SelectedProduct = {
      ...product,
      qty: 1,
      price: product.prices?.[0]?.price ?? 0,
      priceTypeId: 0,
      priceTypeName: 0,
      discount: 0,
    };

    updateDraft((d) => {
      const map = new Map(d.products?.map((p) => [p.id, { ...p }]) || []);
      if (map.has(product.id)) {
        const current = map.get(product.id)!;
        map.set(product.id, {
          ...current,
          qty: (current.qty || 0) + 1,
        });
      } else {
        map.set(product.id, selected);
      }
      d.products = Array.from(map.values());
    });
  };

  const removeProduct = (id: number) => {
    updateDraft((d) => {
      d.products = d.products?.filter((p) => p.id !== id) || [];
    });
  };

  const openProductModal = (product: SelectedProduct) => {
    setSelectedProduct(product);
    setProductModalVisible(true);
  };

  const updateProductInDraft = (updated: SelectedProduct) => {
    updateDraft((d) => {
      const map = new Map(d.products?.map((p) => [p.id, { ...p }]) || []);
      map.set(updated.id, updated);
      d.products = Array.from(map.values());
    });
  };

  return (
    <Form.Item>
      <AutoComplete
        options={searchResults.map((p) => ({
          value: p.name,
          label: `${p.name} — ${p.prices?.[0]?.price ?? 0}₽`,
          key: p.id,
        }))}
        value={search}
        onSearch={setSearch}
        onSelect={(_, option) => {
          const found = searchResults.find((p) => p.id === Number(option.key));
          if (found) handleAddProduct(found);
          setSearch("");
        }}
        placeholder="поиск товара по имени"
      />

      <List
        dataSource={draft.products || []}
        renderItem={(p) => {
          const basePrice = p.price - p.discount || 0;
          const oldPrice = p.price;
          const totalPrice = basePrice * (p.qty || 1);
          const totalOldPrice = oldPrice * (p.qty || 1);

          return (
            <List.Item>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                {/* левая колонка: название */}
                <div style={{ flex: 1, whiteSpace: "pre-wrap" }}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      openProductModal(p);
                    }}
                  >
                    {p.name}
                  </a>
                </div>

                {/* правая колонка: цена и контролы */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 4,
                  }}
                >
                  <div>
                    {editingPriceId === p.id ? (
                      <InputNumber
                        value={tempPrice}
                        min={0}
                        onChange={(v) => setTempPrice(v || 0)}
                        onBlur={() => {
                          const newProduct = {
                            ...p,
                            price: tempPrice,
                          };

                          updateProductInDraft(newProduct);

                          setEditingPriceId(null);
                        }}
                        autoFocus
                        size="small"
                      />
                    ) : (
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setEditingPriceId(p.id);
                          setTempPrice(p.price);
                        }}
                      >
                        {p.discount ? <s>{totalOldPrice}₽</s> : null}{" "}
                        <b>{totalPrice}₽</b>
                      </span>
                    )}
                  </div>

                  <div
                    style={{ display: "flex", gap: 4, alignItems: "center" }}
                  >
                    <Button
                      size="small"
                      onClick={() => {
                        const currentQty = p.qty || 0;
                        if (currentQty > 1)
                          updateProductInDraft({ ...p, qty: currentQty - 1 });
                        else removeProduct(p.id);
                      }}
                    >
                      −
                    </Button>
                    <span>
                      {p.qty}{" "}
                      <Typography.Text
                        type="secondary"
                        style={{ fontSize: 10 }}
                      >
                        {p.unit_name}
                      </Typography.Text>
                    </span>
                    <Button
                      size="small"
                      onClick={() =>
                        updateProductInDraft({ ...p, qty: (p.qty || 0) + 1 })
                      }
                    >
                      +
                    </Button>
                    <Button
                      size="small"
                      danger
                      onClick={() => removeProduct(p.id)}
                    >
                      🗑
                    </Button>
                  </div>
                </div>
              </div>
            </List.Item>
          );
        }}
      />

      <Button
        style={{ marginTop: 12 }}
        icon={<ShoppingCartOutlined />}
        onClick={() => setSelectorVisible(true)}
      >
        Выбрать товар ({draft.products?.length || 0})
      </Button>

      <Modal
        title={selectedProduct?.name}
        open={productModalVisible}
        footer={null}
        onCancel={() => setProductModalVisible(false)}
      >
        {selectedProduct && (
          <ProductEditCard
            product={selectedProduct}
            onChange={(updated) => {
              updateProductInDraft(updated);
              setProductModalVisible(false);
              setSelectedProduct(null);
            }}
          />
        )}
      </Modal>

      <ProductSelector
        visible={selectorVisible}
        onClose={() => setSelectorVisible(false)}
        onAdd={handleAddProduct}
      />
    </Form.Item>
  );
};
