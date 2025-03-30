import { MoveRight } from "lucide-react";
import React from "react";
import "react-multi-carousel/lib/styles.css";

const matchInfo = {
  title: "Vòng 14 Giải VĐQG V-League",
  homeImg: "logo.png",
  homeName: "Thép Xanh Nam Định",
  homePlayer: "sonavt.png",
  homeResult: "3",
  awayImg: "viettel.png",
  awayName: "Thể Công Viettel",
  awayPlayer: "vanviavt.png",
  awayResult: "2",
  time: "19:30",
  location: "SVĐ Thiên Trường",
  date: "06/04/2025",
};

const Match = ({ title, played }) => {
  return (
    <div className="h-[300px] relative">
      <div className="z-10 absolute px-20 h-full w-full">
        <div className="mt-5 items-center uppercase text-[26px] font-bold flex ">
          <div>{title}</div>
          <MoveRight className="scale-150 ml-5" />
        </div>
        <div className="h-full flex bg-white/50 rounded-2xl hover:bg-[#008bd0]/15 transition">
          {/* Sân nhà */}
          <div className="w-[40%] flex ">
            <img
              src={matchInfo.homePlayer}
              className="h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
            />
            <div className="flex flex-col items-center justify-center w-full">
              <img
                src={matchInfo.homeImg}
                className="h-[150px] drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
              />
              <div className="text-xl">{matchInfo.homeName}</div>
            </div>
          </div>
          {/* Thông tin */}
          <div className="w-[20%] flex flex-col items-center ">
            <div className="text-lg mb-8 mt-2">{matchInfo.title}</div>
            <div className="text-lg">{matchInfo.location}</div>
            {played ? (
              <div className="text-6xl font-bold my-4">
                {matchInfo.homeResult} - {matchInfo.awayResult}
              </div>
            ) : (
              <div className="text-4xl font-bold my-4">VS</div>
            )}
            <div className="text-xl font-bold">{matchInfo.time}</div>
            <div className="text-xl font-bold">{matchInfo.date}</div>
          </div>
          {/* Sân khách */}
          <div className="flex w-[40%] justify-end">
            <div className="flex flex-col items-center justify-center w-full">
              <img
                src={matchInfo.awayImg}
                className="h-[150px] drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
              />
              <div className="text-xl">{matchInfo.awayName}</div>
            </div>
            <img
              src={matchInfo.awayPlayer}
              className="h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Match;
