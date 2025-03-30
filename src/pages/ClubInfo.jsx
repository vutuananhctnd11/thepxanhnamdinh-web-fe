/* eslint-disable no-unused-vars */
import React from "react";
import Layout from "../components/Layout";
import Coach from "../components/ClubInfo/coach";
import { motion } from "framer-motion";
import Player from "../components/ClubInfo/Player";
import Squad from "../components/ClubInfo/Squad";

const ClubInfo = () => {
  return (
    <Layout>
      <div className="">
        <div className="relative w-full h-[300px] overflow-hidden">
          <div className="h-full absolute inset-0 bg-black/50 z-10" />
          <div className="h-[300px] w-full bg-[#008bd0] flex items-center justify-center">
            <img src="/bg.jpg" className="object-cover absolute z-5" />
          </div>
          <motion.div
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0 flex items-center text-white font-bold  text-[90px] uppercase z-10 ml-20"
          >
            <div>Thông tin về CLB</div>
          </motion.div>
        </div>
        <div className="w-full h-full py-10 px-20 bg-[#008bd0]/20 relative overflow-hidden">
          <img
            src="/logo.png"
            className="object-contain opacity-25 scale-250 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
          {/* Thông tin cầu thủ */}
          <div className="flex w-full h-[700px]">
            <Player />
            <Squad />
          </div>
          {/* Danh sách HLV */}
          <Coach />

          {/* Danh hiệu */}
          <div className="relative h-[600px] mt-20">
            <div className="w-full h-full justify-center drop-shadow-[5px_10px_20px_rgba(0,0,0,0.8)]">
              <div className="w-full mb-15 flex justify-center uppercase font-bold text-[50px] ">
                <div
                  className="bg-white/60 text-[#008bd0] text-[30px] uppercase font-bold flex justify-center w-[25%] rounded-xl
              border-3 border-[#008bd0]"
                >
                  Danh hiệu
                </div>
              </div>

              <div className="flex items-center w-full h-[60%]">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div className="w-[30%] h-full flex flex-col items-center justify-center">
                    <img
                      src="/cup1.png"
                      className="h-[70%] drop-shadow-[5px_10px_20px_rgba(0,0,0,0.8)] hover:scale-110 transition-transform duration-300"
                    />
                    <div
                      className="mt-4 text-center text-[60px] font-bold"
                      style={{ fontFamily: "MyCustomFont" }}
                    >
                      3
                    </div>
                    <div className=" text-center text-[24px] font-semibold">
                      Giải hạng Nhất Quốc gia
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="h-[750px] relative">
          <div className="bg-white/85 z-10 h-full w-full absolute"></div>
          <div className="bg-[#008bd0]/20 z-10 h-full w-full absolute"></div>
          <img
            src="bg2.jpg"
            className="h-full w-full object-cover opacity-35"
          />
        </div>
      </div>
    </Layout>
  );
};

export default ClubInfo;
