import React, { useState } from "react";
import { Form, Input, Select } from "antd";

const ContragentStep: React.FC = () => {
  const [searchType, setSearchType] = useState<"phone" | "name">("phone");

  return (
    <Form layout="vertical">
      <Form.Item label="Тип поиска" name="searchType">
        <Select
          value={searchType}
          onChange={(v) => setSearchType(v)}
          options={[
            { label: "По телефону", value: "phone" },
            { label: "По названию", value: "name" },
          ]}
        />
      </Form.Item>
      {searchType === "phone" ? (
        <Form.Item label="Телефон" name="phone">
          <Input placeholder="Введите телефон" />
        </Form.Item>
      ) : (
        <Form.Item label="Название" name="name">
          <Input placeholder="Введите название" />
        </Form.Item>
      )}
    </Form>
  );
};

export default ContragentStep;
