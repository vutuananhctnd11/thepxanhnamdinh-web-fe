import { Collapse, InputNumber } from "antd";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

const TicketType = ({ matchId }) => {
  const [listStands, setListStands] = useState([]);

  useEffect(() => {
    const fetchTicketType = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/tickets/ticket-of-match?matchId=" + matchId,
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

  const renderItemsStand = listStands.map((item, index) => {
    return {
      key: index,
      label: item.name,
      children: item.type.map((itemC, indexC) => (
        <div key={indexC} className="rounded-2xl hover:bg-gray-100 my-2">
          <div className="flex w-full px-3 py-2">
            <div className="w-[70%]">
              <div>Khán đài {itemC.position}</div>
              <div>Giá tiền: {itemC.price.toLocaleString()} VNĐ</div>
            </div>
            <InputNumber
              min={0}
              max={10}
              defaultValue={0}
              size="large"
              style={{ width: "70px" }}
              parser={(value) => value.replace(/\D/g, "")}
              formatter={(value) => `${value}`}
            />
          </div>
          {itemC.note && (
            <div className="text-red-600 italic px-3">{itemC.note}</div>
          )}
        </div>
      )),
    };
  });

  return (
    <div className="h-full w-full ">
      <ScrollArea className="ml-3 h-[480px]">
        <Collapse
          items={renderItemsStand}
          style={{ backgroundColor: "#f0f2f5" }}
        />
      </ScrollArea>
      <div className="mt-10 text-lg font-bold flex justify-center">
        Tổng số tiền: 1.000.000 VNĐ
      </div>
    </div>
  );
};

export default TicketType;
