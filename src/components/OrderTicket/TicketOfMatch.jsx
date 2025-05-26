/* eslint-disable no-unused-vars */
import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import ChooseTicketPopup from "./ChooseTicketPopup";
import { formatDateTime } from "@/parts/FormatDateTime";
import ModalNotification from "@/parts/ModalNotification";

const TicketOfMatch = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [modalProps, setModalProps] = useState({});
  const [isModalNotiOpen, setIsModalNotiOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const openModalNoti = () => {
    setModalProps({
      modalTitle: "Bạn chưa đăng nhập",
      modalMessage: "Vui lòng đăng nhập để được đặt vé",
      type: "error",
      buttonText: "Đăng nhập",
      redirectPath: "/login",
    });
    setIsModalNotiOpen(true);
  };

  const {
    matchId,
    homeName,
    homeLogo,
    awayName,
    awayLogo,
    matchDate,
    tournament,
    round,
    stadium,
    status,
    sellTicket,
  } = data;

  useEffect(() => {
    if (matchDate) {
      const { dateFormat, timeFormat } = formatDateTime(matchDate);
      setDate(dateFormat);
      setTime(timeFormat);
    }
  }, [matchDate]);

  let button;
  if (status.toLowerCase() === "played") {
    button = (
      <button className="px-6 my-3 h-10 w-[80%] bg-gray-400 text-white font-semibold text-lg rounded-2xl">
        Dừng bán vé
      </button>
    );
  } else if (status.toLowerCase() === "created" && sellTicket == true) {
    button = (
      <button
        className="px-6 my-3 h-10 w-[80%] bg-gradient-to-r from-cyan-500 to-cyan-300 text-white font-semibold 
  text-lg rounded-xl shadow-lg transition-all duration-300 hover:bg-right bg-[length:200%_auto] cursor-pointer"
        onClick={() => {
          const accessToken = localStorage.getItem("accessToken");
          if (accessToken) {
            showModal();
          } else {
            openModalNoti();
          }
        }}
      >
        Đặt vé ngay
      </button>
    );
  } else if (status.toLowerCase() === "created" && sellTicket == false) {
    button = (
      <button className="px-6 my-3 h-10 w-[80%] bg-gray-400 text-white font-semibold text-lg rounded-2xl">
        Sắp mở bán
      </button>
    );
  }
  return (
    <div
      className="h-[300px] w-[420px] bg-[url(/bgmatch.png)] text-white p-4 rounded-2xl hover:scale-102 t
    ransition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
    >
      <div className="mb-3 text-lg">
        Vòng {round} {tournament}
      </div>
      <div>
        <p className="text-lg font-bold flex justify-center drop-shadow-[0_0_10px_rgba(0,255,255,0.9)] ">
          {stadium}
        </p>
      </div>
      <div className="flex h-[130px]">
        <div className="w-[44%] flex flex-col items-center">
          <img
            src={homeLogo}
            className="h-[100px] drop-shadow-[0_10px_20px_rgba(255,255,255,0.5)]"
          />
          <p className="font-medium my-1">{homeName}</p>
        </div>
        <div className="w-[12%] h-[100px] flex justify-center items-center">
          <img src="/vs.png" className="h-[60px]" />
        </div>
        <div className="w-[44%] flex flex-col items-center">
          <img
            src={awayLogo}
            className="h-[100px] drop-shadow-[0_10px_20px_rgba(255,255,255,0.5)]"
          />
          <p className="font-medium my-1">{awayName}</p>
        </div>
      </div>
      <div>
        <p className="text-lg font-bold flex justify-center">{time}</p>
        <p className="text-lg font-bold flex justify-center">{date}</p>
      </div>
      <div className="w-full mt-5 flex justify-center">{button}</div>
      <ChooseTicketPopup
        isModalOpen={isModalOpen}
        onOk={handleOk}
        handleCancel={handleCancel}
        matchId={data.matchId}
      />
      <ModalNotification
        isModalOpen={isModalNotiOpen}
        setIsModalOpen={setIsModalNotiOpen}
        {...modalProps}
      />
    </div>
  );
};

export default TicketOfMatch;
