import React from "react";
import { Form, Input } from "antd";
import type { OrderDraft } from "../../order/orderDraft";

interface TokenStepProps {
  draft: OrderDraft;
  updateDraft: (fn: (draft: OrderDraft) => void) => void;
}

export const TokenStep: React.FC<TokenStepProps> = ({ draft, updateDraft }) => {
  return (
    <Form.Item
      label="токен"
      name="token"
      initialValue={draft.token}
      rules={[{ required: true, message: "токен обязателен" }]}
      validateTrigger={["onBlur", "onChange"]}
    >
      <Input
        value={draft.token}
        onChange={(e) =>
          updateDraft((d) => {
            d.token = e.target.value;
          })
        }
        placeholder="введите токен кассы"
      />
    </Form.Item>
  );
};
