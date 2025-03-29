import { Modal } from "antd";
import React, { useState } from "react";
import ChooseTicketPopup from "./ChooseTicketPopup";

const TicketOfMatch = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const {
    title,
    homeImg,
    homeName,
    awayImg,
    awayName,
    time,
    location,
    status,
    date,
  } = data;

  let button;
  if (status == "done") {
    button = (
      <button className="px-6 my-3 h-10 w-[80%] bg-gray-400 text-white font-semibold text-lg rounded-2xl">
        Dừng bán vé
      </button>
    );
  } else if (status == "selling") {
    button = (
      <button
        className="px-6 my-3 h-10 w-[80%] bg-gradient-to-r from-cyan-500 to-cyan-300 text-white font-semibold 
  text-lg rounded-xl shadow-lg transition-all duration-300 hover:bg-right bg-[length:200%_auto] cursor-pointer"
        onClick={showModal}
      >
        Đặt vé ngay
      </button>
    );
  } else {
    button = (
      <button className="px-6 my-3 h-10 w-[80%] bg-gray-400 text-white font-semibold text-lg rounded-2xl">
        Sắp mở bán
      </button>
    );
  }
  return (
    <div
      className="h-[330px] w-[400px] bg-[url(/bgmatch.png)] text-white p-3 rounded-2xl hover:scale-102 t
    ransition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
    >
      <div className="mb-3 text-lg">{title}</div>
      <div>
        <p className="text-lg font-bold flex justify-center drop-shadow-[0_0_10px_rgba(0,255,255,0.9)] ">
          {location}
        </p>
      </div>
      <div className="flex h-[130px]">
        <div className="w-[44%] flex flex-col items-center">
          <img
            src={homeImg}
            className="h-[100px] drop-shadow-[0_10px_20px_rgba(255,255,255,0.5)]"
          />
          <p className="font-medium my-1">{homeName}</p>
        </div>
        <div className="w-[12%] h-[100px] flex justify-center items-center">
          <img src="/vs.png" className="h-[60px]" />
        </div>
        <div className="w-[44%] flex flex-col items-center">
          <img
            src={awayImg}
            className="h-[100px] drop-shadow-[0_10px_20px_rgba(255,255,255,0.5)]"
          />
          <p className="font-medium my-1">{awayName}</p>
        </div>
      </div>
      <div>
        <p className="text-lg font-bold flex justify-center">{time}</p>
        <p className="text-lg font-bold flex justify-center">{date}</p>
      </div>
      <div className="w-full flex justify-center">{button}</div>
      <ChooseTicketPopup
        isModalOpen={isModalOpen}
        onOk={handleOk}
        handleCancel={handleCancel}
      />
    </div>
  );
};

export default TicketOfMatch;
