/* eslint-disable no-unused-vars */
import { Form, Modal } from "antd";
import React from "react";
import TicketType from "./TicketType";

const ChooseTicketPopup = ({ isModalOpen, onOk, handleCancel, matchId }) => {
  const handleOk = async () => {};

  return (
    <>
      <Modal
        title="Chọn loại vé theo khán đài"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
        centered
        okText="Thanh Toán"
        cancelText="Hủy bỏ"
      >
        <div className="flex h-[550px]">
          <img src="/sodosvd.png" className="mb-5 w-[65%]" />
          <div className="w-full h-[500px]">
            <TicketType matchId={matchId} />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ChooseTicketPopup;
