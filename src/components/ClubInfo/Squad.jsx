import React from "react";
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

const Squad = () => {
  return (
    <div className="w-[65%] h-full scale-95 text-[14px] relative">
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
  );
};

export default Squad;
