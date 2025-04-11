/* eslint-disable no-unused-vars */
import { Form, Modal } from "antd";
import React from "react";
import TicketType from "./TicketType";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ScrollArea } from "@radix-ui/react-scroll-area";

const ChooseTicketPopup = ({ isModalOpen, onOk, handleCancel }) => {
  const handleOk = async () => {};

  return (
    <>
      <Modal
        title="Chọn loại vé theo khán đài"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
        height={"100%"}
        centered
        okText="Thanh Toán"
        cancelText="Hủy bỏ"
      >
        <ScrollArea className="h-[600px] overflow-y-auto">
          <div className="flex">
            <img src="/sodosvd.png" className="mb-5 w-[65%]" />
            <div className="w-full h-[500px]">
              <TicketType />
            </div>
          </div>
          <div className="space-y-2 ml-10">
            <div className="text-lg">Thông tin thanh toán</div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                type="text"
                id="fullName"
                placeholder="Họ và tên người mua vé"
                className={"ml-6"}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="fullName">Địa chỉ email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Địa chỉ email nhận thông tin vé"
                className={"ml-6"}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="fullName">Số điện thoại</Label>
              <Input
                type="number"
                id="phoneNumber"
                placeholder="Số điện thoại người mua vé"
                className={"ml-6"}
              />
            </div>
          </div>
        </ScrollArea>
      </Modal>
    </>
  );
};

export default ChooseTicketPopup;
