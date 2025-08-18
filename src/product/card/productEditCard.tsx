import { Card, InputNumber, Tag, Button } from "antd";
import { useState } from "react";
import type { SelectedProduct } from "../product";

type ProductEditCardProps = {
  product: SelectedProduct;
  onChange: (p: SelectedProduct) => void;
};

const BATCH_SIZE = 15;

export const ProductEditCard: React.FC<ProductEditCardProps> = ({
  product,
  onChange,
}) => {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  const handleQtyChange = (value: number | null) => {
    onChange({ ...product, qty: value ?? 1 });
  };

  const handlePriceChange = (value: number | null) => {
    onChange({ ...product, price: value ?? 0 });
  };

  const handleDiscountChange = (value: number | null) => {
    onChange({ ...product, discount: value ?? 0 });
  };

  const totalPrice = (product.price - (product.discount ?? 0)) * product.qty;

  const balancesToShow = product.balances?.slice(0, visibleCount) || [];

  const hasMore = product.balances && visibleCount < product.balances.length;

  return (
    <Card size="small" title={product.name} style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <span>кол-во:</span>
        <InputNumber min={1} value={product.qty} onChange={handleQtyChange} />
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <span>цена:</span>
        <InputNumber
          min={0}
          value={product.price}
          onChange={handlePriceChange}
        />
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <span>скидка:</span>
        <InputNumber
          min={0}
          value={product.discount ?? 0}
          onChange={handleDiscountChange}
        />
      </div>

      <div style={{ marginBottom: 8 }}>
        <span>склады:</span>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}
        >
          {balancesToShow.length > 0 ? (
            balancesToShow.map((s) => (
              <Tag
                color={s.current_amount > 0 ? "green" : "red"}
                key={s.warehouse_name}
              >
                {s.warehouse_name}: {s.current_amount}
              </Tag>
            ))
          ) : (
            <span>нет данных</span>
          )}
        </div>

        {hasMore && (
          <Button
            type="link"
            size="small"
            onClick={() => setVisibleCount((prev) => prev + BATCH_SIZE)}
            style={{ padding: 0 }}
          >
            ещё ({Math.min(BATCH_SIZE, product.balances!.length - visibleCount)}
            )
          </Button>
        )}
      </div>

      <div style={{ marginTop: 8 }}>
        <strong>итого: {totalPrice}</strong>
      </div>
    </Card>
  );
};
