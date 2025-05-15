/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import ItemNav from "../ItemNav/ItemNav";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useLocation, useNavigate } from "react-router-dom";
import useNagivateLoading from "@/hooks/useNagivateLoading";
import { handleFriendAction } from "@/parts/HandleApiAction";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";

const NewsFeed = () => {
  const navigateLoading = useNagivateLoading();
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
  const [listGroups, setListGroups] = useState([]);

  const fetchListGroupJoined = async () => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/groups/user-joined?page=1&limit=10&userId=${userLogin.userId}`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        const groups = response.data.listResults;
        setListGroups(groups);
      }
    } catch (error) {
      console.log("Lỗi khi lấy danh sách nhóm: ", error);
    }
  };

  useEffect(() => {
    fetchListGroupJoined();
  }, []);

  return (
    <div className="w-full h-full text-white p-3">
      <div>
        <ItemNav
          icon={
            <Avatar>
              <AvatarImage
                src={userLogin?.avatar || "/defaultavt.png"}
                className={"object-cover"}
              />
            </Avatar>
          }
          name={userLogin?.firstName + " " + userLogin?.lastName}
          onClick={() =>
            navigateLoading(`/social/personal-page/${userLogin.userId}`)
          }
        />
        <ItemNav
          icon={<i class="fa-solid fa-user-plus text-[#00C4B4] scale-120" />}
          name={"Kết bạn"}
          onClick={() => navigateLoading("/social/friends")}
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
          onClick={() => navigateLoading("/social/groups/list")}
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
      </div>
      <hr className="m-3" />
      <div className="text-gray-300 my-1">Nhóm của bạn</div>
      <div>
        {listGroups?.map((group) => (
          <ItemNav
            key={group.groupId}
            icon={
              <img
                src={group.avatarImage || "/defaultavt.png"}
                className="h-full object-cover rounded-sm"
              />
            }
            name={group.groupName}
            onClick={() =>
              navigateLoading(`/social/groups/detail/${group.groupId}`)
            }
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
