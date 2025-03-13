import React from "react";
import { ArrowRight } from "lucide-react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const NewsList = ({ title }) => {
  return (
    <div className="mt-4">
      <p className="text-4xl font-bold flex">
        {title} <ArrowRight className="size-8 mt-2 ml-3" />{" "}
      </p>
      <Carousel
        className="flex items-center space-x-10 pt-6 pl-2"
        responsive={responsive}
      >
        <div className="w-[300px] h-[350px] relative">
          <div
            className="w-full h-[95%] hover:scale-105 transition-transform duration-500 
          ease-in-out cursor-pointer overflow-hidden rounded-xl"
          >
            <img
              src="/banner1.jpg"
              alt="ảnh"
              className="w-full h-[230px] object-cover"
            ></img>
            <div className=" border-1 border-t-0 border-[#d0d0d0] rounded-b-xl">
              <p className="text-md m-2">
                Câu lạc bộ bóng đá Thép Xanh Nam Định là một câu lạc bộ bóng đá
              </p>
              <p className="text-sm p-2 text-right border-t-1 border-t-[#d0d0d0]">
                14/03/2025
              </p>
            </div>
          </div>
        </div>

        <div className="w-[300px] h-[350px] relative">
          <div
            className="w-full h-[95%] hover:scale-105 transition-transform duration-500 
          ease-in-out cursor-pointer overflow-hidden rounded-xl"
          >
            <img
              src="/banner2.jpg"
              alt="ảnh"
              className="w-full h-[230px] object-cover"
            ></img>
            <div className=" border-1 border-t-0 border-[#d0d0d0] rounded-b-xl">
              <p className="text-md m-2">
                Câu lạc bộ bóng đá Thép Xanh Nam Định là một câu lạc bộ bóng đá
              </p>
              <p className="text-sm p-2 text-right border-t-1 border-t-[#d0d0d0]">
                14/03/2025
              </p>
            </div>
          </div>
        </div>

        <div className="w-[300px] h-[350px] relative">
          <div
            className="w-full h-[95%] hover:scale-105 transition-transform duration-500 
          ease-in-out cursor-pointer overflow-hidden rounded-xl"
          >
            <img
              src="/banner3.jpg"
              alt="ảnh"
              className="w-full h-[230px] object-cover"
            ></img>
            <div className=" border-1 border-t-0 border-[#d0d0d0] rounded-b-xl">
              <p className="text-md m-2">
                Câu lạc bộ bóng đá Thép Xanh Nam Định là một câu lạc bộ bóng đá
              </p>
              <p className="text-sm p-2 text-right border-t-1 border-t-[#d0d0d0]">
                14/03/2025
              </p>
            </div>
          </div>
        </div>
      </Carousel>
    </div>
  );
};

export default NewsList;
