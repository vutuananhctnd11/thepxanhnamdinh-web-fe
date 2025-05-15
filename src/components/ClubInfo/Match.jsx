import { formatDateTime } from "@/parts/FormatDateTime";
import { MoveRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import "react-multi-carousel/lib/styles.css";

const Match = ({ title, played }) => {
  const [matchInfo, setMatchInfo] = useState(null);
  const [date, setDate] = useState();
  const [time, setTime] = useState();

  useEffect(() => {
    const fetchLatestResult = async () => {
      try {
        let res;
        if (played) {
          res = await fetch(`${import.meta.env.VITE_API_URL}/matches/latest-result`, {
            method: "GET",
          });
        } else {
          res = await fetch(`${import.meta.env.VITE_API_URL}/matches/next-match`, {
            method: "GET",
          });
        }
        const response = await res.json();
        if (response.status === "success") {
          setMatchInfo(response.data);
          const { date, time } = formatDateTime(response.data.matchDate);
          setDate(date);
          setTime(time);
        } else {
          console.log("Thất bại: " + response.message);
        }
      } catch (error) {
        console.log("Có lỗi khi gọi api get match info: ", error);
        // alert("Có lỗi khi gọi api head coach info ", error);
      }
    };

    fetchLatestResult();
  }, [played]);

  if (!matchInfo) return null;

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
              src={matchInfo?.homePlayerImage}
              className="h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
            />
            <div className="flex flex-col items-center justify-center w-full">
              <img
                src={matchInfo?.homeLogo}
                className="h-[150px] drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
              />
              <div className="text-xl">{matchInfo?.homeName}</div>
            </div>
          </div>
          {/* Thông tin */}
          <div className="w-[20%] flex flex-col items-center ">
            <div className="text-lg mb-8 mt-2">
              Vòng {matchInfo?.round} {matchInfo?.tournament}
            </div>
            <div className="text-lg">{matchInfo?.stadium}</div>
            {played ? (
              <div className="text-6xl font-bold my-4">
                {matchInfo?.homeScore} - {matchInfo?.awayScore}
              </div>
            ) : (
              <div className="text-4xl font-bold my-4">VS</div>
            )}
            <div className="text-xl font-bold">{time}</div>
            <div className="text-xl font-bold">{date}</div>
          </div>
          {/* Sân khách */}
          <div className="flex w-[40%] justify-end">
            <div className="flex flex-col items-center justify-center w-full">
              <img
                src={matchInfo?.awayLogo}
                className="h-[150px] drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
              />
              <div className="text-xl">{matchInfo?.awayName}</div>
            </div>
            <img
              src={matchInfo?.awayPlayerImage}
              className="h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Match;
