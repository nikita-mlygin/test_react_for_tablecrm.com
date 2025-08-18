import React from "react";
import { Form, InputNumber } from "antd";

const OrderStep: React.FC = () => {
  return (
    <Form layout="vertical">
      <Form.Item
        label="Сумма заказа"
        name="orderAmount"
        rules={[{ required: true }]}
      >
        <InputNumber className="w-full" placeholder="Введите сумму" />
      </Form.Item>
    </Form>
  );
};

export default OrderStep;
