/* eslint-disable no-unused-vars */
import { LucideSearch } from "lucide-react";
import React, { useEffect, useState } from "react";
import ItemNav from "../ItemNav/ItemNav";
import { Avatar, AvatarImage } from "../ui/avatar";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import useNagivateLoading from "@/hooks/useNagivateLoading";
import { Dropdown } from "antd";

const NavBarRight = () => {
  const [listFriends, setListFriends] = useState([]);
  const navigate = useNagivateLoading();
  const [search, setSearch] = useState("");

  const getMenuItems = (userId) => [
    {
      key: `chat-${userId}`,
      label: <span className="w-[150px]">Nhắn tin</span>,
    },
    {
      key: `profile-${userId}`,
      label: <span className="w-[150px]">Trang cá nhân</span>,
    },
  ];

  const handleMenuClick = ({ key }) => {
    const [action, userId] = key.split("-");

    if (action === "chat") {
      // navigate(`/social/chat/${userId}`);
      fetchCheckConversations(userId);
    } else if (action === "profile") {
      navigate(`/social/personal-page/${userId}`);
    }
  };

  //fetch select conversation
  const fetchCheckConversations = async (userId) => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/conversations/check-conversation?userId=${userId}`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        const conversationId = response.data.id;
        navigate(`/social/chat/${conversationId}`);
      }
    } catch (error) {
      console.log("Có lỗi khi gọi api: ", error);
    }
  };

  const handleSearch = () => {
    navigate(`/social/search?query=${encodeURIComponent(search.trim())}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const fetchListFriend = async () => {
    const userLogin = JSON.parse(localStorage.getItem("userLogin"));
    const userId = userLogin.userId;

    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/friends?userId=${userId}&page=1&limit=10`,
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
        <button
          onClick={handleSearch}
          className="absolute left-2 top-0 bottom-0 flex items-center justify-center px-2 hover:cursor-pointer"
        >
          <LucideSearch className="h-4 w-4 text-white/70" />
        </button>
        <input
          type="text"
          placeholder="Tìm kiếm trên TXND FanZone"
          className="w-full h-full bg-white/20 rounded-2xl pl-10 pr-4 outline-none placeholder-white/30"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
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
            <Dropdown
              menu={{
                items: getMenuItems(friend.userId),
                onClick: handleMenuClick,
                className: "custom-dropdown-menu",
              }}
              trigger={["click"]}
              placement="bottom"
              overlayStyle={{ width: "140px" }}
            >
              <div>
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
                />
              </div>
            </Dropdown>
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
