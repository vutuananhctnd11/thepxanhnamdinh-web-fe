import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { Modal } from "antd";
import React, { useEffect, useState } from "react";

const CoachInfoModal = ({ openInfoModal, setOpenInfoModal, coachId }) => {
  const [coachInfo, setCoachInfo] = useState(null);

  const fetchCoachInfor = async () => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/coaches/${coachId}`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        setCoachInfo(response.data);
      }
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  useEffect(() => {
    //   console.log("Playerid: ", playerId);
    fetchCoachInfor();
  }, [coachId]);

  return (
    <Modal
      open={openInfoModal}
      onCancel={() => setOpenInfoModal(false)}
      width={"50%"}
      centered={true}
      footer={null}
    >
      <div className="w-full h-full relative pl-8 py-3 overflow-hidden">
        <p className=" font-bold uppercase text-[24px] mb-3 ">
          {coachInfo?.position}
        </p>
        <div
          className="w-full text-[100px] absolute flex justify-end top-15 right-10 opacity-40"
          style={{ fontFamily: "Teko", fontWeight: 500 }}
        >
          <i class="fa-solid fa-user-tie"></i>
        </div>
        <div className="w-[55%]">
          <p className=" font-bold uppercase text-[34px] mb-3">
            {coachInfo?.firstName + " " + coachInfo?.lastName}
          </p>
          <div className="text-[15px] w-full">
            <div className="space-y-2">
              <p>Ngày sinh: {coachInfo?.dateOfBirth}</p>
              <p>Quốc tịch: {coachInfo?.nationality}</p>
              <p>Quê quán: {coachInfo?.address}</p>
              <p>Sự nghiệp huấn luyện viên:</p>
              <div className="flex text-justify ml-1 mr-4">
                {coachInfo?.description}
              </div>
            </div>
          </div>
        </div>
        <div className="w-[50%] h-[80%] absolute bottom-0 right-[-10%]">
          <img
            src={coachInfo?.image}
            className=" h-full object-cover opacity-80 drop-shadow-[0px_00px_10px_rgba(0,0,0,0.5)]"
          />
        </div>
      </div>
    </Modal>
  );
};

export default CoachInfoModal;
