import ModalNotification from "@/parts/ModalNotification";
import React, { useEffect, useState } from "react";

const HeadCoachInfo = () => {
  const [coachInfo, setCoachInfo] = useState(null);

  useEffect(() => {
    const fetchPlayerInfo = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/coaches/head-coach`, {
          method: "GET",
        });
        const response = await res.json();
        if (response.status === "success") {
          setCoachInfo(response.data);
        } else {
          alert("Thất bại: ", response.message);
        }
      } catch (error) {
        console.log("Có lỗi khi gọi api head coach info ", error);
        // alert("Có lỗi khi gọi api head coach info ", error);
      }
    };

    fetchPlayerInfo();
  }, []);

  return (
    <div className="w-[35%] h-full my-5 z-10">
      <div
        className="w-full h-[85%] text-[18px] space-y-2 my-5 
             bg-[#008bd0]/12 rounded-3xl shadow-2xl shadow-black/30 
            
             transition-all duration-300 hover:shadow-black/50"
      >
        <div className="w-full h-full relative pl-8 py-3 overflow-hidden">
          <p className=" font-bold uppercase text-[24px] mb-3 ">
            Huấn luyện viên trưởng
          </p>
          <div
            className="w-full text-[120px] absolute flex justify-end top-25 right-16 opacity-40"
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
          <div className="w-[60%] h-[70%] absolute bottom-0 right-[-10%]">
            <img
              src={coachInfo?.image}
              className=" h-full object-cover opacity-80 drop-shadow-[0px_00px_10px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadCoachInfo;
