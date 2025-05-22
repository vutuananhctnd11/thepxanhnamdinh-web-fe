import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { Modal } from "antd";
import React, { useEffect, useState } from "react";

const PlayerInfoModal = ({ openInfoModal, setOpenInfoModal, playerId }) => {
  const [player, setPlayer] = useState(null);

  const fetchPlayerInfor = async () => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/players/${playerId}`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        setPlayer(response.data);
      }
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  useEffect(() => {
    console.log("Playerid: ", playerId);
    fetchPlayerInfor();
  }, [playerId]);

  return (
    <div>
      <Modal
        open={openInfoModal}
        onCancel={() => setOpenInfoModal(false)}
        width={"50%"}
        centered={true}
        footer={null}
      >
        <div className="w-full h-full relative pl-8 py-3 overflow-hidden">
          <p className=" font-bold uppercase text-[24px] mb-3 ">
            {player?.position}
          </p>
          <div
            className="w-full text-[145px] absolute flex justify-end top-15 right-10 opacity-50"
            style={{ fontFamily: "Teko", fontWeight: 500 }}
          >
            {player?.shirtNumber}
          </div>
          <div className="w-full">
            <p className=" font-bold uppercase text-[30px] mb-3">
              {player?.firstName + " " + player?.lastName}
            </p>
            <div className="w-[60%] text-[15px]">
              <div className="space-y-1.5">
                <p>Tuổi: {player?.age}</p>
                <p>Ngày sinh: {player?.dateOfBirth}</p>
                <p>Quốc tịch: {player?.nationality}</p>
                <p>Chiều cao: {player?.height} m</p>
                <p>Cân nặng: {player?.weight} kg</p>
                <p>Tổng số bàn thắng: {player?.goal}</p>
                <p>Tổng số kiến tạo: {player?.assist}</p>
                <p>Giới thiệu cầu thủ:</p>
                <div className="flex text-justify ml-1 mr-4">
                  {player?.description}
                </div>
              </div>
            </div>
          </div>
          <div className="w-[40%] h-[60%] absolute bottom-0 right-0">
            <img
              src={player?.avatarImage}
              className=" h-full object-cover opacity-90 drop-shadow-[0px_00px_10px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PlayerInfoModal;
