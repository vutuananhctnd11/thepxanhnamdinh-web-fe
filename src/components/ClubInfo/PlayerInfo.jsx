/* eslint-disable no-unused-vars */
import ModalNotification from "@/parts/ModalNotification";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const PlayerInfo = ({ playerId }) => {
  const [playerInfo, setPlayerInfo] = useState(null);

  useEffect(() => {
    const fetchPlayerInfo = async () => {
      try {
        const res = await fetch("http://localhost:8080/players/" + playerId, {
          method: "GET",
        });
        const response = await res.json();
        if (response.status === "success") {
          setPlayerInfo(response.data);
        } else {
          alert("Thất bại: ", response.message);
        }
      } catch (error) {
        // alert("Có lỗi khi gọi api player info ", error);
        console.log("Có lỗi khi gọi api player info ", error);
      }
    };

    fetchPlayerInfo();
  }, [playerId]);

  return (
    <motion.div
      key={playerInfo?.playerId}
      initial={{ opacity: 0, x: -80, y: 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.7 }}
      className="w-[35%] h-full my-5 z-10 flex items-center"
    >
      <div
        className="w-full h-[85%] text-[18px] space-y-2 my-5 
             bg-[#008bd0]/12 rounded-3xl shadow-2xl shadow-black/30 
            
             transition-all duration-300 hover:shadow-black/50 hover:scale-105"
      >
        <div className="w-full h-full relative pl-8 py-3 overflow-hidden">
          <p className=" font-bold uppercase text-[24px] mb-3 ">
            {playerInfo?.position}
          </p>
          <div
            className="w-full text-[145px] absolute flex justify-end top-15 right-10 opacity-40"
            style={{ fontFamily: "Teko", fontWeight: 500 }}
          >
            {playerInfo?.shirtNumber}
          </div>
          <div className="w-full">
            <p className=" font-bold uppercase text-[30px] mb-3">
              {playerInfo?.firstName + " " + playerInfo?.lastName}
            </p>
            <div className="w-[60%] text-[15px]">
              <div className="space-y-1.5">
                <p>Tuổi: {playerInfo?.age}</p>
                <p>Ngày sinh: {playerInfo?.dateOfBirth}</p>
                <p>Quốc tịch: {playerInfo?.nationality}</p>
                <p>Quê quán: {playerInfo?.address}</p>
                <p>Chiều cao: {playerInfo?.height} m</p>
                <p>Cân nặng: {playerInfo?.weight} kg</p>
                <p>Tổng số bàn thắng: {playerInfo?.goal}</p>
                <p>Tổng số kiến tạo: {playerInfo?.assist}</p>
                <p>Sự nghiệp cầu thủ:</p>
                <div className="flex text-justify ml-1 mr-4">
                  {playerInfo?.description}
                </div>
              </div>
            </div>
          </div>
          <div className="w-[65%] h-[80%] absolute bottom-0 right-[-8%]">
            <img
              src={playerInfo?.fullBodyImage}
              className=" h-full object-cover opacity-90 drop-shadow-[0px_00px_10px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerInfo;
