/* eslint-disable no-unused-vars */
import React from "react";
import Layout from "../components/Layout";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import NewsList from "../components/News/NewsList";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import useNagivateLoading from "@/hooks/useNagivateLoading";
import Match from "@/components/ClubInfo/Match";

const HomePage = () => {
  const navigateLoading = useNagivateLoading();

  return (
    <>
      <Layout>
        <div>
          <div className="relative w-[100%] h-[calc(100vh-52px)] flex justify-center">
            <div className="bg-black/40 h-full w-full bg-no-repeat absolute z-5" />
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={true}
              modules={[Navigation, Pagination, Autoplay]}
              className="w-full absolute"
            >
              <SwiperSlide>
                <img src="/banner4.jpg" className="w-full h-full object-fill" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/banner2.jpg" className="w-full h-full object-fill" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/banner3.jpg" className="w-full h-full object-fill" />
              </SwiperSlide>
            </Swiper>
            <motion.img
              src="/son.png"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute z-10 h-140 bottom-0 left-[-5%]"
            />

            <motion.img
              src="/vantoan.png"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
              className="absolute z-10 h-140 bottom-0 left-[12%]"
            />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute z-10 text-right right-[5%] top-[26%]"
            >
              <div className="text-white">
                <h2
                  className="uppercase text-[85px] font-semibold "
                  style={{ fontFamily: "MyCustomFont" }}
                >
                  Thép xanh nam định
                </h2>
                <h2
                  className="text-4xl tracking-wider"
                  style={{ fontFamily: "Smooch Sans" }}
                >
                  Đội bóng thành Nam - Hào khí Đông A
                </h2>
                <h2
                  className="text-4xl tracking-wider"
                  style={{ fontFamily: "Smooch Sans" }}
                >
                  Chiến thắng ngọt ngào, khẳng định vị thế!
                </h2>
              </div>
            </motion.div>
          </div>

          <div className="bg-[url('/grass.png')] h-160 w-full relative flex flex-col">
            <div className="bg-white opacity-95 h-full w-full z-5 absolute" />
            <div className="bg-[#208ff7] opacity-15 h-full w-full z-5 absolute" />
            <div className="h-[90%] ml-30 z-10 relative flex items-center">
              <img
                src="/aboutus.png"
                alt="Parallelogram"
                className="w-[30%] h-[60%] object-cover flex"
                style={{
                  clipPath: "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)",
                }}
              />
              <div className="w-[70%] h-full flex items-center">
                <div className="h-[60%] w-full ml-15 space-y-2">
                  <div
                    className="w-40 text-[20px] p-2 flex justify-center
                  bg-[#008bd0]/20 text-[#008bd0] font-bold"
                  >
                    GIỚI THIỆU
                  </div>
                  <div className="text-[34px] ">
                    Câu lạc bộ bóng đá Thép Xanh Nam Định
                  </div>
                  <div className="w-[80%] text-justify">
                    Câu lạc bộ bóng đá Thép Xanh Nam Định là một câu lạc bộ bóng
                    đá chuyên nghiệp ở Việt Nam có trụ sở tại thành phố Nam
                    Định, tỉnh Nam Định. Câu lạc bộ hiện đang là đương kim vô
                    địch V.League 1 với chức vô địch mùa giải 2023-24.
                    <br />
                    <br />
                    Được xem là một trong những câu lạc bộ bóng đá có lịch sử
                    lâu đời tại Việt Nam, trong quá khứ đội bóng từng 1 lần
                    giành ngôi vô địch Giải vô địch bóng đá Việt Nam năm 1985
                    với thành tích bất bại toàn mùa giải với danh xưng Công
                    nghiệp Hà Nam Ninh.
                  </div>
                  <div
                    className="w-40 text-[18px] p-2 mt-6 flex justify-center border-2 border-[#46acdf] 
                  text-[#008bd0] font-bold hover:bg-[#008bd0] hover:text-white 
                  hover:shadow-lg hover:shadow-[#008bd0] transition-all duration-300 cursor-pointer"
                    onClick={() => navigateLoading("/about-club")}
                  >
                    XEM THÊM &gt;&gt;
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[15%] w-full flex space-x-10 bottom-2 items-center justify-center">
              <img
                src="/xuanthien.png"
                className="z-20 h-22 filter hover:scale-110 transition-transform duration-400 cursor-pointer"
              />
              <img
                src="/xuanthanh.png"
                className="z-20 h-20 filter hover:scale-110 transition-transform duration-400 cursor-pointer"
              />
              <img
                src="/dongluc.png"
                className="z-20 h-20 filter hover:scale-110 transition-transform duration-400 cursor-pointer"
              />
              <img
                src="/venesto.png"
                className="z-20 h-27 filter hover:scale-110 transition-transform duration-400 cursor-pointer"
              />
              <img
                src="/mitre.png"
                className="z-20 h-30 filter hover:scale-110 transition-transform duration-400 cursor-pointer"
              />
              <img
                src="/ocany.png"
                className="z-20 h-9 filter hover:scale-110 transition-transform duration-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="h-[800px] relative space-y-20">
            <div className="bg-white/85 z-10 h-full w-full absolute"></div>
            <div className="bg-[#008bd0]/10 z-10 h-full w-full absolute"></div>
            <img
              src="bg2.jpg"
              className="h-full w-full object-cover opacity-30 absolute"
            />
            <Match title={"Trận đấu tiếp theo"} played={false} />
            <Match title={"Kết quả trận đấu gần nhất"} played={true} />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default HomePage;
