import { Collapse, InputNumber } from "antd";
import React from "react";
import { ScrollArea } from "../ui/scroll-area";

const listStands = [
  {
    name: "Vé khán đài A",
    type: [
      {
        name: "Khán đài A1",
        price: 80000,
        note: "",
      },
      {
        name: "Khán đài A2",
        price: 60000,
        note: "",
      },
    ],
  },
  {
    name: "Vé khán đài B",
    type: [
      {
        name: "Khán đài B1",
        price: 60000,
        note: "Dành cho CĐV đội khách",
      },
      {
        name: "Khán đài B2",
        price: 60000,
        note: "Hết vé",
      },
    ],
  },
  {
    name: "Vé khán đài C",
    type: [
      {
        name: "Khán đài C",
        price: 20000,
        note: "a",
      },
    ],
  },
  {
    name: "Vé khán đài D",
    type: [
      {
        name: "Khán đài D",
        price: 20000,
        note: "a",
      },
    ],
  },
];

const renderItemsStand = listStands.map((item, index) => {
  return {
    key: index,
    label: item.name,
    children: item.type.map((itemC, indexC) => (
      <div key={indexC} className="rounded-2xl hover:bg-gray-100">
        <div className="flex w-full px-3 py-2">
          <div className="w-[70%]">
            <div>{itemC.name}</div>
            <div>Giá tiền: {itemC.price} VNĐ</div>
          </div>
          <InputNumber
            min={0}
            max={10}
            defaultValue={0}
            size="large"
            style={{ width: "70px" }}
          />
        </div>
        <div className="text-red-600 italic px-3">{itemC.note}</div>
      </div>
    )),
  };
});

const TicketType = () => {
  return (
    <div className="h-full w-full ">
      <ScrollArea className="ml-3 h-[650px]">
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
