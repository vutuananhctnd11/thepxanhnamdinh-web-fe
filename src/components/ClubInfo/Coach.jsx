/* eslint-disable no-unused-vars */
import { style } from "framer-motion/client";
import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 6,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
  },
};

const Coach = () => {
  const [listCoach, setListCoach] = useState(null);

  useEffect(() => {
    const fetchListCoach = async () => {
      try {
        const res = await fetch("http://localhost:8080/coaches", {
          method: "GET",
        });
        const response = await res.json();
        if (response.status === "success") {
          setListCoach(response.data);
        } else {
          alert("Thất bại: ", response.message);
        }
      } catch (error) {
        // alert("Có lỗi khi gọi api player info ", error);
        console.log("Có lỗi khi gọi api player info ", error);
      }
    };

    fetchListCoach();
  }, []);
  return (
    <>
      <div className=" w-full relative mt-30">
        <div className="w-full flex flex-col drop-shadow-[5px_10px_20px_rgba(0,0,0,0.8)]">
          <div className="flex justify-center">
            <div
              className="bg-white/60 text-[#008bd0] text-[30px] uppercase font-bold flex justify-center w-[25%] rounded-xl
              border-3 border-[#008bd0]"
            >
              Ban lãnh đạo
            </div>
          </div>
          <div className="mt-10">
            {listCoach && (
              <Carousel
                className="flex overflow-visible h-[500px] pl-5"
                responsive={responsive}
              >
                {listCoach?.map((coachInfo, index) => (
                  <div
                    key={coachInfo.coachId}
                    className="h-full aspect-[1/1.4] transform transition-all duration-300 hover:scale-105 hover:z-10"
                  >
                    <img
                      src={coachInfo.image}
                      className=" h-[350px] object-contain shadow-lg"
                    />
                    <div className=" pl-2 pt-2">
                      <p>{coachInfo.position}</p>
                      <p>
                        Họ và tên:{" "}
                        {coachInfo.firstName + " " + coachInfo.lastName}
                      </p>
                      <p>Quốc tịch: {coachInfo.nationality}</p>
                      <p>Ngày sinh: {coachInfo.dateOfBirth}</p>
                    </div>
                  </div>
                ))}
              </Carousel>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Coach;
