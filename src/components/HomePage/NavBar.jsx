import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import ItemNav from "../ItemNav/ItemNav";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useLocation, useNavigate } from "react-router-dom";
import useNagivateLoading from "@/hooks/useNagivateLoading";

const NewsFeed = () => {
  const navigateLoading = useNagivateLoading();

  return (
    <div className="w-full text-white p-3">
      <ItemNav
        icon={
          <Avatar>
            <AvatarImage src="/hlv.png" className={"object-cover"} />
          </Avatar>
        }
        name={"Vũ Tuấn Anh"}
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
      />
      <ItemNav
        icon={<i class="fa-solid fa-people-group text-[#2dc5f3] scale-125" />}
        name={"Hội cổ động viên"}
      />
      <hr className="m-3" />
    </div>
  );
};

export default NewsFeed;
