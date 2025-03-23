import React from "react";

const Player = () => {
  return (
    <div className="w-[35%] h-full my-5 z-10">
      <div
        className="w-full h-[90%] text-[18px] space-y-2 my-5 
             bg-[#008bd0]/12 rounded-3xl shadow-2xl shadow-black/30 
            
             transition-all duration-300 hover:shadow-black/50"
      >
        <div className="w-full h-full relative pl-8 py-3 overflow-hidden">
          <p className=" font-bold uppercase text-[26px] mb-3 ">
            Huấn luyện viên trưởng
          </p>
          <div className="w-[60%]">
            <p className=" font-bold uppercase text-[30px] mb-3">
              Vũ Hồng Việt
            </p>
            <div className="text-[15px]">
              <p>Ngày sinh: 16/09/1979</p>
              <p>Quốc tịch: Việt Nam</p>
              <p>Quê quán: Thái Bình</p>
              <p>Sự nghiệp huấn luyện viên:</p>
              <div>
                <div className="flex w-full">
                  <div className="w-[40%]">2019 - 2020</div>
                  <div>Quảng Nam</div>
                </div>
                <div className="flex w-full">
                  <div className="w-[40%]">2020 - 2022</div>
                  <div>ĐT Việt Nam(Trợ lý)</div>
                </div>
                <div className="flex w-full">
                  <div className="w-[40%]">2022 - nay</div>
                  <div>Thép Xanh Nam Định</div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[65%] h-[70%] absolute bottom-0 right-[-5%]">
            <img
              src="/vuhongviet.png"
              className=" h-full object-cover opacity-80 drop-shadow-[0px_00px_10px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
