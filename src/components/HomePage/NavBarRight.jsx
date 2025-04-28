/* eslint-disable no-unused-vars */
import { LucideSearch } from "lucide-react";
import React, { useEffect, useState } from "react";
import ItemNav from "../ItemNav/ItemNav";
import { Avatar, AvatarImage } from "../ui/avatar";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import useNagivateLoading from "@/hooks/useNagivateLoading";

const NavBarRight = () => {
  const [listFriends, setListFriends] = useState([]);
  const navigate = useNagivateLoading();

  const fetchListFriend = async () => {
    const userLogin = JSON.parse(localStorage.getItem("userLogin"));
    const userId = userLogin.userId;

    try {
      const res = await fetchWithAuth(
        `http://localhost:8080/friends?userId=${userId}&page=1&limit=10`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        setListFriends(response.data);
      } else {
        alert("ERROR: ", response.message);
      }
    } catch (error) {
      console.log("Lỗi khi gọi api: ", error);
    }
  };

  useEffect(() => {
    fetchListFriend();
  }, []);

  return (
    <div className="m-3">
      <div className="h-8 relative">
        <LucideSearch className="absolute left-2 h-8 justify-center scale-85" />
        <input
          type="text"
          placeholder="Tìm kiếm trên TXND FanZone"
          className="w-full h-full bg-white/20 rounded-2xl pl-10 pr-4 outline-none placeholder-white/30"
        />
      </div>
      <div className="mt-3 space-y-2">
        <p className="text-gray-300">Quảng cáo</p>
        <div className=" w-full">
          <img src="/banner1.jpg" className="w-full" />
        </div>
      </div>
      <hr className="mt-5 mb-3 mx-2" />
      <div>
        <p className="text-gray-300 my-1">Người liên hệ</p>
        <div>
          {listFriends.map((friend) => (
            <ItemNav
              key={friend.friendId}
              icon={
                <Avatar>
                  <AvatarImage
                    src={friend.avatar || "/defaultavt.png"}
                    className={"object-cover"}
                  />
                </Avatar>
              }
              name={friend.fullName}
              onClick={() => navigate(`/social/personal-page/${friend.userId}`)}
            />
          ))}
        </div>
      </div>
      <div className="mt-3 text-[12px] text-gray-400 flex justify-center">
        <p>TXND FanZone - Copyright © 2025 by TuanAnhDev</p>
      </div>
    </div>
  );
};

export default NavBarRight;
