import React, { useState, useRef } from "react";
import { Form, Button, Row, Col, Card, Steps, Modal } from "antd";
import { useOrderDraft } from "./order/orderDraft";
import { TokenStep } from "./authorization/token/tokenStep";
import { ClientStep } from "./client/clientStep";
import { RequisitesStep } from "./order/requisite/requisiteSteps";
import { ProductsStep } from "./product/productStep";
import { ReviewStep } from "./order/reviewStep";
import { useCreateDocSaleFromDraft } from "./common/tempqueries";

export interface FormValues {
  client_phone?: string;
  client_id?: number | null;
  client_name?: string;
  invoice_id?: string | number;
  organization_id?: string | number;
  warehouse_id?: string | number;
  price_type?: string | number;
}

export const OrderMobileForm: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const { draft, updateDraft, resetDraft } = useOrderDraft();

  const [modal, contextHolder] = Modal.useModal();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const stepsRef = useRef<HTMLDivElement | null>(null);

  const steps = [
    { title: "токен" },
    { title: "клиент" },
    { title: "реквизиты" },
    { title: "товары" },
    { title: "обзор" },
  ];

  const { mutate: createDocSale, isPending } = useCreateDocSaleFromDraft();

  const next = async () => {
    try {
      await form.validateFields();
      if (currentStep === 3 && draft.products.length === 0) {
        return modal.warning({
          title: "Ошибка",
          content: "добавьте хотя бы один товар",
        });
      }
      setCurrentStep((s) => s + 1);
    } catch {}
  };

  const prev = () => setCurrentStep((s) => Math.max(0, s - 1));

  const onSubmit = (conduct = false) => {
    if (!draft.token) {
      return modal.warning({ title: "Ошибка", content: "введите токен" });
    }
    if (draft.products.length === 0) {
      return modal.warning({
        title: "Ошибка",
        content: "добавьте хотя бы один товар",
      });
    }

    createDocSale(
      { ...draft, status: conduct },
      {
        onSuccess: (res: any) => {
          modal.success({
            title: "Успешно",
            content: `Документ создан: ${res[0].number}`,
            okText: "Ок",
          });
          resetDraft();
          setCurrentStep(0);
        },
        onError: (err: any) => {
          modal.error({
            title: "Ошибка",
            content: err?.message || "Ошибка при создании документа",
            okText: "Закрыть",
          });
        },
      }
    );
  };

  return (
    <div style={{ padding: 12, maxWidth: 720, margin: "0 auto" }}>
      <Card size="small">
        <div ref={stepsRef} style={{ width: "100%" }}>
          <Steps
            current={currentStep}
            size="small"
            style={{ marginBottom: 16 }}
            type="inline"
          >
            {steps.map((s) => (
              <Steps.Step key={s.title} title={s.title} />
            ))}
          </Steps>
        </div>

        <Form form={form} layout="vertical">
          {currentStep === 0 && (
            <TokenStep draft={draft} updateDraft={updateDraft} />
          )}
          {currentStep === 1 && (
            <ClientStep draft={draft} updateDraft={updateDraft} form={form} />
          )}
          {currentStep === 2 && (
            <RequisitesStep draft={draft} updateDraft={updateDraft} />
          )}
          {currentStep === 3 && (
            <ProductsStep draft={draft} updateDraft={updateDraft} />
          )}
          {currentStep === 4 && <ReviewStep draft={draft} />}

          <Row gutter={8} style={{ marginTop: 12 }}>
            <Col>
              {currentStep > 0 && <Button onClick={prev}>назад</Button>}
            </Col>
            <Col>
              {currentStep < steps.length - 1 && (
                <Button type="primary" onClick={next}>
                  далее
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <>
                  <Button
                    onClick={() => onSubmit(false)}
                    loading={isPending}
                    style={{ marginRight: 8 }}
                  >
                    создать
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => onSubmit(true)}
                    loading={isPending}
                  >
                    создать и провести
                  </Button>
                </>
              )}
            </Col>
          </Row>
        </Form>
      </Card>
      {contextHolder}
    </div>
  );
};

export default OrderMobileForm;
