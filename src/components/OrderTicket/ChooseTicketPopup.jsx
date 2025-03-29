import { Form, InputNumber, Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import React from "react";

const ChooseTicketPopup = ({ isModalOpen, onOk, handleCancel }) => {
  const [form] = useForm();

  const handleOk = async () => {
    await form.validateFields();
    console.log(form.getFieldsValue());
    onOk && onOk();
  };

  return (
    <>
      <Modal
        title="Chọn loại vé theo khán đài"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <img src="/sodosvd.png" className="mb-5" />
        <Form form={form}>
          <div className="flex items-center space-x-5">
            <p>Vé khán đài A1:</p>
            <Form.Item name="numberTiketA1">
              <InputNumber min={0} max={10} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default ChooseTicketPopup;
