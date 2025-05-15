import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { handleFriendAction } from "@/parts/HandleApiAction";
import { message } from "antd";
import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 6,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
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

const FriendRequestReceived = () => {
  const [listFriendRequestReceived, setListFriendRequestReceived] = useState(
    []
  );
  const [messageApi, contextHolder] = message.useMessage();

  const fetchAddFriendReceived = async () => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/friends/receiver?page=1&limit=10`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        setListFriendRequestReceived(response.data);
      } else {
        alert("ERROR: ", response.message);
      }
    } catch (error) {
      console.log("Lỗi khi gọi api: ", error);
    }
  };

  const handleRejectAddFriend = (friend) => {
    handleFriendAction({
      url: `${import.meta.env.VITE_API_URL}/friends/reject/${friend.senderId}`,
      method: "DELETE",
      onSuccess: () => {
        fetchAddFriendReceived();
      },
      successMessage: `Bạn đã từ chối lời kết bạn của ${friend.fullName}!`,
      errorMessage: "Từ chối thất bại",
      messageApi: messageApi,
    });
  };

  const handleAcceptAddFriend = (friend) => {
    handleFriendAction({
      url: `${import.meta.env.VITE_API_URL}/friends/accept/${friend.senderId}`,
      method: "PATCH",
      onSuccess: () => {
        setTimeout(() => {
          fetchAddFriendReceived();
        }, 2000);
      },
      successMessage: `Bạn và ${friend.fullName} đã trở thành bạn bè của nhau!`,
      errorMessage: "Lỗi khi chấp nhận lời mời",
      messageApi: messageApi,
    });
    console.log("fullname: ", friend.fullName);
  };

  useEffect(() => {
    fetchAddFriendReceived();
  }, []);

  if (listFriendRequestReceived.length == 0) {
    return (
      <div className="px-10">
        <div className="text-white text-xl font-bold my-2">
          Lời mời kết bạn nhận được
        </div>
        <div className="text-white/80 text-lg flex justify-center my-2">
          Bạn không nhận được lời mời kết bạn nào!
        </div>
      </div>
    );
  } else
    return (
      <div className="px-10">
        {contextHolder}
        <div className="text-white text-xl font-bold my-2">
          Lời mời kết bạn nhận được
        </div>
        <Carousel className="flex py-4" responsive={responsive}>
          {listFriendRequestReceived.map((friend) => (
            <div key={friend.senderId} className="flex justify-center">
              <div className="w-[220px] bg-white/20 border-1 rounded-lg overflow-hidden">
                <img
                  src={friend.avatar || "/defaultavt.png"}
                  className="w-full h-[180px] object-cover"
                />
                <div className="m-2 space-y-1 mb-4">
                  <div className="font-semibold text-white text-lg">
                    {friend.fullName}
                  </div>
                  <div className="text-white/70 text-sm">
                    Nhận {friend.seenAt}
                  </div>
                </div>
                <div className="space-x-4 my-2 mx-4 flex justify-between">
                  <button
                    className="px-4 py-2 bg-blue-500/80 hover:bg-blue-500 text-white rounded-lg shadow transition duration-200"
                    onClick={() => handleAcceptAddFriend(friend)}
                  >
                    Xác nhận
                  </button>

                  <button
                    className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg shadow transition duration-200"
                    onClick={() => handleRejectAddFriend(friend)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    );
};

export default FriendRequestReceived;
