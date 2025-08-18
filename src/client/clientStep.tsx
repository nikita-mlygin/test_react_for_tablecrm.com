import React, { useState, useEffect, useRef } from "react";
import { Form, AutoComplete, Input, type FormInstance } from "antd";
import type { OrderDraft } from "../order/orderDraft";
import type { Contragent } from "../common/tmptypes";
import axios from "axios";
import type { FormValues } from "../OrderMobileForm";

interface ClientStepProps {
  draft: OrderDraft;
  updateDraft: (fn: (draft: OrderDraft) => void) => void;
  form: FormInstance<FormValues>; // пробрасываем форму
}

export const ClientStep: React.FC<ClientStepProps> = ({
  draft,
  updateDraft,
  form,
}) => {
  const [inputName, setInputName] = useState("");
  const [inputPhone, setInputPhone] = useState("");
  const [options, setOptions] = useState<Contragent[]>([]);
  const [loading, setLoading] = useState(false);
  const lastRequestId = useRef(0);
  const debounceTimer = useRef<number | undefined>(undefined);

  const fetchClients = async (name?: string, phone?: string) => {
    const requestId = ++lastRequestId.current;
    setLoading(true);
    try {
      const res = await axios.get(
        "https://app.tablecrm.com/api/v1/contragents/",
        {
          params: {
            token:
              "af1874616430e04cfd4bce30035789907e899fc7c3a1a4bb27254828ff304a77",
            name: name || undefined,
            phone: phone || undefined,
            limit: 35,
            offset: 0,
          },
        }
      );
      if (requestId === lastRequestId.current) {
        setOptions(res.data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (requestId === lastRequestId.current) setLoading(false);
    }
  };

  // debounce для поиска
  useEffect(() => {
    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = window.setTimeout(
      () => fetchClients(inputName, inputPhone),
      300
    );
    return () => {
      if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
    };
  }, [inputName, inputPhone]);

  const handleSelect = (client: Contragent) => {
    updateDraft((d) => {
      d.client_id = client.id;
      d.client_name = client.name;
      d.client_phone = client.phone ?? undefined;
    });
    setInputName(client.name);
    console.log(client.phone);
    setInputPhone(client.phone ?? "");
    form.setFieldsValue({ client_phone: client.phone ?? undefined });
  };

  return (
    <>
      <Form.Item
        label="по названию"
        name="client_name"
        rules={[{ required: true, message: "название клиента обязательно" }]}
      >
        <AutoComplete
          options={options.map((c) => ({
            value: c.name,
            label: `${c.name}${c.phone ? ` — ${c.phone}` : ""}`,
            key: c.id,
          }))}
          onSearch={setInputName}
          onSelect={(_, option) => {
            console.log(option.key);
            const found = options.find((c) => c.id === Number(option.key));
            if (found) handleSelect(found);
          }}
          value={inputName}
          placeholder="поиск по названию"
        >
          <Input />
        </AutoComplete>
      </Form.Item>

      <Form.Item
        label="телефон клиента"
        name="client_phone"
        rules={[{ required: true, message: "телефон клиента обязателен" }]}
      >
        <AutoComplete
          options={options.map((c) => ({
            value: c.phone ?? "",
            label: `${c.name}${c.phone ? ` — ${c.phone}` : ""}`,
            key: c.id,
          }))}
          value={inputPhone} // вот это главный источник истины
          onSearch={setInputPhone}
          onChange={setInputPhone} // при ручном вводе
          onSelect={(_, option) => {
            const found = options.find((c) => c.id === Number(option.key));
            if (found) handleSelect(found);
          }}
          placeholder="поиск по телефону"
        >
          <Input />
        </AutoComplete>
      </Form.Item>
    </>
  );
};
