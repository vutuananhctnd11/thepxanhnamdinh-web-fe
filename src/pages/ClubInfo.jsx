import React from "react";
import Layout from "../components/Layout";
import { motion } from "framer-motion";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 8,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 6,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 4,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
  },
};

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
          <div className="flex w-full">
            <div className="w-[35%] pr-10 z-10">
              <div className="w-full h-[250px] text-[18px] space-y-2">
                <p className=" font-bold uppercase text-[30px]">
                  Huấn luyện viên trưởng
                </p>
                <img
                  src="/hlv.png"
                  className="w-full h-full object-cover rounded-2xl"
                />
                <p className=" font-bold uppercase text-[30px]">Vũ Hồng Việt</p>
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
            <div className="w-[65%] h-[700px]  text-[14px] relative">
              <div className="h-[86%] w-full">
                <img
                  src="/sanco.png"
                  className="h-[80%] w-full z-5 mt-20 pb-5 opacity-90 absolute drop-shadow-[0px_0px_30px_rgba(0,0,0,0.8)]"
                />

                {/* Thủ môn */}
                <div
                  className="h-25 w-30 z-10 absolute bottom-0 left-1/2 top-2/3 -translate-x-1/2 
                                hover:scale-110 transition-transform duration-400 cursor-pointer"
                >
                  <img src="/nguyenmanhavt.png" className="h-full mx-auto" />
                  <p className="w-full flex justify-center bg-[#008bd0] text-white rounded-md">
                    T. Nguyên Mạnh
                  </p>
                </div>

                {/* Hậu vệ cánh phải */}
                <div
                  className="h-25 w-30 z-10 absolute left-1/6 top-7/13 -translate-x-1/2 -translate-y-1/2
                                hover:scale-110 transition-transform duration-400 cursor-pointer"
                >
                  <img src="/hongduyavt.png" className="h-full mx-auto" />
                  <p className="w-full flex justify-center bg-[#008bd0] text-white rounded-md">
                    N. P. Hồng Duy
                  </p>
                </div>

                {/* Hậu vệ cánh trái */}
                <div
                  className="h-25 w-30 z-10 absolute left-5/6 top-7/13 -translate-x-1/2 -translate-y-1/2
                                hover:scale-110 transition-transform duration-400 cursor-pointer"
                >
                  <img src="/vanviavt.png" className="h-full mx-auto" />
                  <p className="w-full flex justify-center bg-[#008bd0] text-white rounded-md">
                    N. Văn Vĩ
                  </p>
                </div>

                {/* Hậu vệ lệch trái */}
                <div
                  className="h-25 w-30 z-10 absolute left-4/11 top-8/13 -translate-x-1/2 -translate-y-1/2
                                hover:scale-110 transition-transform duration-400 cursor-pointer"
                >
                  <img src="/lucasalvesavt.png" className="h-full mx-auto" />
                  <p className="w-full flex justify-center bg-[#008bd0] text-white rounded-md">
                    Lucas Alves
                  </p>
                </div>

                {/* Hậu vệ lệch phải */}
                <div
                  className="h-25 w-30 z-10 absolute left-7/11 top-8/13 -translate-x-1/2 -translate-y-1/2
                                hover:scale-110 transition-transform duration-400 cursor-pointer"
                >
                  <img src="/hoanganhavt.png" className="h-full mx-auto" />
                  <p className="w-full flex justify-center bg-[#008bd0] text-white rounded-md">
                    L. C. Hoàng Anh
                  </p>
                </div>

                {/* Tiền vệ trung tâm lệch phải */}
                <div
                  className="h-25 w-30 z-10 absolute left-7/11 top-5/13 -translate-x-1/2 -translate-y-1/2
                                hover:scale-110 transition-transform duration-400 cursor-pointer"
                >
                  <img src="/tuananhavt.png" className="h-full mx-auto" />
                  <p className="w-full flex justify-center bg-[#008bd0] text-white rounded-md">
                    N. Tuấn Anh
                  </p>
                </div>

                {/* Tiền vệ trung tâm lệch trái */}
                <div
                  className="h-25 w-30 z-10 absolute left-4/11 top-5/13 -translate-x-1/2 -translate-y-1/2
                                hover:scale-110 transition-transform duration-400 cursor-pointer"
                >
                  <img src="/vankienavt.png" className="h-full mx-auto" />
                  <p className="w-full flex justify-center bg-[#008bd0] text-white rounded-md">
                    T. Văn Kiên
                  </p>
                </div>

                {/* Tiền vệ tấn công */}
                <div
                  className="h-25 w-30 z-10 absolute left-1/2 top-4/13 -translate-x-1/2 -translate-y-1/2
                                hover:scale-110 transition-transform duration-400 cursor-pointer"
                >
                  <img src="/cesaravt.png" className="h-full mx-auto" />
                  <p className="w-full flex justify-center bg-[#008bd0] text-white rounded-md">
                    Caio Cesar
                  </p>
                </div>

                {/* Tiền đạo cánh trái */}
                <div
                  className="h-25 w-30 z-10 absolute left-1/4 top-3/13 -translate-x-1/2 -translate-y-1/2
                                hover:scale-110 transition-transform duration-400 cursor-pointer"
                >
                  <img src="/hendrioavt.png" className="h-full mx-auto" />
                  <p className="w-full flex justify-center bg-[#008bd0] text-white rounded-md">
                    Hendrio
                  </p>
                </div>

                {/* Tiền đạo cánh phải */}
                <div
                  className="h-25 w-30 z-10 absolute left-3/4 top-3/13 -translate-x-1/2 -translate-y-1/2
                                hover:scale-110 transition-transform duration-400 cursor-pointer"
                >
                  <img src="/vantoanavt.png" className="h-full mx-auto" />
                  <p className="w-full flex justify-center bg-[#008bd0] text-white rounded-md">
                    N. Văn Toàn
                  </p>
                </div>

                {/* Tiền đạu chủ lực */}
                <div
                  className="h-25 w-30 z-10 absolute inset-0 mx-auto mt-6
                                hover:scale-110 transition-transform duration-400 cursor-pointer"
                >
                  <img src="/sonavt.png" className="h-full mx-auto" />
                  <p className="w-full flex justify-center bg-[#008bd0] text-white rounded-md">
                    N. Xuân Son
                  </p>
                </div>
              </div>
              <Carousel
                className="h-[20%] w-full space-x-5 flex relative pb-10"
                responsive={responsive}
                renderButtonGroupOutside={true}
              >
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-25 w-30 items-center hover:scale-110 transition-transform duration-400 cursor-pointer"
                  >
                    <img src="/sonavt.png" className="h-full mx-auto" />
                    <p className="w-full flex justify-center bg-[#008bd0] text-white rounded-md">
                      N. Xuân Son
                    </p>
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
          <div className="relative h-[600px] mt-30 px-20">
            <div className="w-full h-full justify-center">
              <div className="w-full mb-15 flex justify-center uppercase font-bold text-[70px] ">
                Danh hiệu
              </div>
              <div className="flex items-center w-full h-[60%]">
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
                  <div className=" text-center text-[30px] font-semibold">
                    Giải hạng Nhất Quốc gia
                  </div>
                </div>
                <div className="w-[40%] h-full flex flex-col items-center justify-center">
                  <img
                    src="/cup3.png"
                    className="h-[80%] drop-shadow-[5px_10px_20px_rgba(0,0,0,0.8)] hover:scale-110 transition-transform duration-300"
                  />
                  <div
                    className="mt-4 text-center text-[60px] font-bold"
                    style={{ fontFamily: "MyCustomFont" }}
                  >
                    1
                  </div>
                  <div className=" text-center text-[30px] font-semibold">
                    Giải Vô định Quốc gia
                  </div>
                </div>
                <div className="w-[30%] h-full flex flex-col items-center justify-center">
                  <img
                    src="/cup2.png"
                    className="h-[60%] drop-shadow-[5px_10px_20px_rgba(0,0,0,0.8)] hover:scale-110 transition-transform duration-300"
                  />
                  <div
                    className="mt-4 text-center text-[60px] font-semibold"
                    style={{ fontFamily: "MyCustomFont" }}
                  >
                    1
                  </div>
                  <div className="mt-4 text-center text-[30px] font-semibold">
                    Cúp Quốc gia
                  </div>
                </div>
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
