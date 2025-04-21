/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import ItemNav from "../ItemNav/ItemNav";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useLocation, useNavigate } from "react-router-dom";
import useNagivateLoading from "@/hooks/useNagivateLoading";

const NewsFeed = () => {
  const navigateLoading = useNagivateLoading();
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));

  return (
    <div className="w-full h-full text-white p-3">
      <div>
        <ItemNav
          icon={
            <Avatar>
              <AvatarImage src={userLogin?.avatar} className={"object-cover"} />
            </Avatar>
          }
          name={userLogin?.firstName + " " + userLogin?.lastName}
        />
        <ItemNav
          icon={<i class="fa-solid fa-user-plus text-[#00C4B4] scale-120" />}
          name={"Kết bạn"}
        />
        <ItemNav
          icon={
            <Avatar>
              <AvatarFallback className="bg-[#2dc5f3] flex items-center justify-center w-full h-full">
                <i class="fa-solid fa-users scale-110" />
              </AvatarFallback>
            </Avatar>
          }
          name={"Nhóm"}
        />
        <ItemNav
          icon={
            <Avatar>
              <AvatarImage src="/logo.png" className={"object-cover"} />
            </Avatar>
          }
          name={"Trang chủ Thép Xanh Nam Định"}
          onClick={() => navigateLoading("/home-club")}
        />
        <ItemNav
          icon={<i class="fa-solid fa-ticket text-[#f59e0b] scale-130" />}
          name={"Đặt vé"}
          onClick={() => navigateLoading("/order-ticket")}
        />
        <ItemNav
          icon={<i class="fa-solid fa-people-group text-[#2dc5f3] scale-125" />}
          name={"Hội cổ động viên"}
        />
      </div>
      <hr className="m-3" />
      <div className="text-gray-300 my-1">Nhóm của bạn</div>
      <div>
        {Array.from({ length: 8 }).map((_, index) => (
          <ItemNav
            key={index}
            icon={
              <img
                src="aboutus.png"
                className="h-full object-cover rounded-sm"
              />
            }
            name={"Nhóm của hội cổ động viên Trực Ninh Nam Định"}
          />
        ))}
      </div>
      <div className="mt-3 text-[12px] text-gray-400 flex justify-center">
        <p>TXND FanZone - Copyright © 2025 by TuanAnhDev</p>
      </div>
    </div>
  );
};

export default NewsFeed;
