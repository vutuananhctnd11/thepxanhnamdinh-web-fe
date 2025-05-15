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

const FriendRequestSent = () => {
  const [listFriendRequestsent, setListFriendRequestsent] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchAddFriendSent = async () => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/friends/sender?page=1&limit=10`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        setListFriendRequestsent(response.data);
      } else {
        alert("ERROR: ", response.message);
      }
    } catch (error) {
      console.log("Lỗi khi gọi api: ", error);
    }
  };

  const handleDeleteAddFriendRequest = (addFriendRequest) =>
    handleFriendAction({
      url: `${import.meta.env.VITE_API_URL}/friends/add-request/${addFriendRequest.userId}`,
      method: "DELETE",
      onSuccess: () => {
        fetchAddFriendSent();
      },
      successMessage: `Bạn hủy lời mời kết bạn đến ${addFriendRequest.fullName}!`,
      errorMessage: "Hủy lời mời thất bại",
      messageApi: messageApi,
    });

  useEffect(() => {
    fetchAddFriendSent();
  }, []);

  if (listFriendRequestsent.length == 0) {
    return (
      <div className="px-10">
        <div className="text-white text-xl font-bold my-2">
          Lời mời kết bạn đã gửi
        </div>
        <div className="text-white/80 text-lg flex justify-center my-2">
          Bạn chưa gửi lời kết bạn đến ai cả!
        </div>
      </div>
    );
  } else
    return (
      <div className="px-10 mt-5">
        {contextHolder}
        <div className="text-white text-xl font-bold my-2">
          Lời mời kết bạn đã gửi
        </div>
        <Carousel className="flex py-4" responsive={responsive}>
          {listFriendRequestsent.map((addFriendRequest) => (
            <div
              key={addFriendRequest.senderId}
              className="flex justify-center"
            >
              <div className="w-[220px] bg-white/20 border-1 rounded-lg overflow-hidden">
                <img
                  src={addFriendRequest.avatar || "/defaultavt.png"}
                  className="w-full h-[180px] object-cover"
                />
                <div className="m-2 space-y-1 mb-4">
                  <div className="font-semibold text-white text-lg">
                    {addFriendRequest.fullName}
                  </div>
                  <div className="text-white/70 text-sm">
                    Gửi {addFriendRequest.seenAt}
                  </div>
                </div>
                <div className="space-x-4 my-2 mx-4 flex justify-center">
                  <button
                    className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg shadow transition duration-200"
                    onClick={handleDeleteAddFriendRequest}
                  >
                    Hủy lời mời
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    );
};

export default FriendRequestSent;
