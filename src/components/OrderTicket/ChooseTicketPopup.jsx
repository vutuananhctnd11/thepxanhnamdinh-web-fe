/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Form, Modal } from "antd";
import React from "react";
import { Collapse, InputNumber } from "antd";
import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import ModalNotification from "@/parts/ModalNotification";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";

const ChooseTicketPopup = ({ isModalOpen, onOk, handleCancel, matchId }) => {
  const [listStands, setListStands] = useState([]);
  const [isModalNotiOpen, setIsModalNotiOpen] = useState(false);
  const [modalProps, setModalProps] = useState({});

  useEffect(() => {
    const fetchTicketType = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const res = await fetchWithAuth(
          `${import.meta.env.VITE_API_URL}/tickets/ticket-of-match?matchId=` + matchId,
          {
            method: "GET",
          }
        );
        const response = await res.json();
        if (response.status === "success") {
          const data = response.data;
          const formattedData = Object.keys(data).map((standKey) => {
            return {
              name: `Vé khán đài ${standKey.substring(5).toUpperCase()}`,
              type: data[standKey],
            };
          });
          setListStands(formattedData);
        }
      } catch (error) {
        console.log("Có lỗi khi gọi api:", error);
      }
    };

    fetchTicketType();
  }, []);

  // order ticket
  const [form] = Form.useForm();

  const handelConfirmPayment = async () => {
    setModalProps({
      modalTitle: "Xác nhận thanh toán",
      modalMessage:
        "Bạn chắc chắn muốn thanh toán? Bạn sẽ được chuyển hướng thanh toán qua VNPay!",
      buttonText: "Xác nhận",
      cancelButtonText: "Hủy",
      onConfirm: handleOk,
    });
    setIsModalNotiOpen(true);
  };

  const handleOk = async () => {
    const accessToken = localStorage.getItem("accessToken");

    //collect form data and transfer
    const values = form.getFieldValue();

    const listOrderTickets = Object.entries(values)
      .filter(([_, quantity]) => quantity > 0)
      .map(([ticketId, quantity]) => ({
        ticketId: Number(ticketId),
        quantity,
      }));

    if (listOrderTickets.length === 0) {
      setModalProps({
        modalTitle: "Lỗi thanh toán",
        modalMessage:
          "Bạn chưa chọn một vé nào cả, vui lòng chọn ít nhất 1 vé!",
        type: "error",
        buttonText: "Chọn lại",
      });
      setIsModalNotiOpen(true);
      return;
    }

    const requestData = { listOrderTickets };

    try {
      let res = await fetch(`${import.meta.env.VITE_API_URL}/order-ticket`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      //refresh token here

      const response = await res.json();
      if (response.status === "success") {
        const returnURL = response.data;
        console.log("URL: ", returnURL);
        window.location.href = returnURL;
      } else {
        console.log("Thất bại: " + response.message);
      }
    } catch (error) {
      console.log("Có lỗi khi gọi api get match info: ", error);
    }
  };

  const renderItemsStand = listStands.map((stand, index) => {
    return {
      key: index,
      label: stand.name,
      children: stand.type.map((positionTicket, indexC) => (
        <div key={indexC} className="rounded-2xl hover:bg-gray-100">
          <div className="flex w-full px-3 py-2">
            <div className="w-[70%]">
              <div>Khán đài {positionTicket.position}</div>
              <div>Giá tiền: {positionTicket.price.toLocaleString()} VNĐ</div>
            </div>
            <Form.Item name={positionTicket.ticketId} style={{ margin: "0" }}>
              <InputNumber
                min={0}
                max={10}
                defaultValue={0}
                size="large"
                style={{ width: "70px" }}
              />
            </Form.Item>
          </div>
          {positionTicket.note && (
            <div className="text-red-600 italic px-3">
              {positionTicket.note}
            </div>
          )}
        </div>
      )),
    };
  });

  return (
    <>
      <Modal
        title="Chọn loại vé theo khán đài"
        open={isModalOpen}
        onOk={handelConfirmPayment}
        onCancel={handleCancel}
        width={1000}
        centered
        okText="Thanh Toán"
        cancelText="Hủy bỏ"
      >
        <div className="flex h-[550px]">
          <img src="/sodosvd.png" className="mb-5 w-[65%]" />
          <div className="w-full h-[500px]">
            <div className="h-full w-full ">
              <ScrollArea className="ml-3 h-[480px]">
                <Form form={form}>
                  <Collapse
                    items={renderItemsStand}
                    style={{ backgroundColor: "#f0f2f5" }}
                  />
                </Form>
              </ScrollArea>
              <div className="mt-10 text-lg font-bold flex justify-center">
                Tổng số tiền: 1.000.000 VNĐ
              </div>
            </div>
          </div>
        </div>
        <ModalNotification
          isModalOpen={isModalNotiOpen}
          setIsModalOpen={setIsModalNotiOpen}
          {...modalProps}
        />
      </Modal>
    </>
  );
};

export default ChooseTicketPopup;
