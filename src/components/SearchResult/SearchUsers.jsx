import { message } from "antd";
import {
  UserCheck,
  UserCheck2,
  UserMinus2Icon,
  UserPlus,
  UserPlus2,
} from "lucide-react";
import React, { useState } from "react";
import { handleFriendAction } from "@/parts/HandleApiAction";

const SearchUsers = ({ user }) => {
  const [isFriend, setIsFriend] = useState(user.isFriend);
  const [isSentRequest, setIsSentRequest] = useState(user.isSentRequest);
  const [isSender, setIsSender] = useState(user.isSender);
  const [messageApi, contextHolder] = message.useMessage();

  const userLogin = JSON.parse(localStorage.getItem("userLogin"));

  const handleAddFriendRequest = () =>
    handleFriendAction({
      url: "http://localhost:8080/friends",
      method: "POST",
      body: {
        senderId: userLogin.userId,
        receiverId: user.userId,
      },
      onSuccess: () => {
        setIsSentRequest(true);
        setIsSender(true);
      },
      successMessage: `Gửi lời mời kết bạn đến ${user.fullName} thành công!`,
      errorMessage: "Gửi lời mời thất bại",
      messageApi: messageApi,
    });

  const handleDeleteFriend = () =>
    handleFriendAction({
      url: `http://localhost:8080/friends/${user.userId}`,
      method: "DELETE",
      onSuccess: () => {
        setIsFriend(false);
        setIsSentRequest(false);
      },
      successMessage: `Hủy kết bạn với ${user.fullName} thành công!`,
      errorMessage: "Hủy kết bạn thất bại",
      messageApi: messageApi,
    });

  const handleRejectAddFriend = () =>
    handleFriendAction({
      url: `http://localhost:8080/friends/reject/${user.userId}`,
      method: "DELETE",
      onSuccess: () => {
        setIsFriend(false);
        setIsSentRequest(false);
      },
      successMessage: `Bạn đã từ chối lời kết bạn của ${user.fullName}!`,
      errorMessage: "Từ chối thất bại",
      messageApi: messageApi,
    });

  const handleAcceptAddFriend = () =>
    handleFriendAction({
      url: `http://localhost:8080/friends/accept/${user.userId}`,
      method: "PATCH",
      onSuccess: () => {
        setIsFriend(false);
        setIsSentRequest(false);
      },
      successMessage: `Bạn và ${user.fullName} đã trở thành bạn bè của nhau!`,
      errorMessage: "Lỗi khi chấp nhận lời mời",
      messageApi: messageApi,
    });

  const handleDeleteAddFriendRequest = () =>
    handleFriendAction({
      url: `http://localhost:8080/friends/add-request/${user.userId}`,
      method: "DELETE",
      onSuccess: () => {
        setIsFriend(false);
        setIsSentRequest(false);
      },
      successMessage: `Bạn hủy lời mời kết bạn đến ${user.fullName}!`,
      errorMessage: "Hủy lời mời thất bại",
      messageApi: messageApi,
    });

  return (
    <>
      {contextHolder}
      <div
        key={user.userId}
        className="flex items-center p-3 hover:bg-white/10 rounded-lg"
      >
        <div className="w-16 h-16 rounded-full overflow-hidden mr-3 flex-shrink-0">
          <img
            src={user.avatar || "/defaultavt.png"}
            alt={user.fullName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{user.fullName}</h3>
          <p className="text-white/70 text-sm mb-2">
            {user.totalFriends} bạn bè
          </p>
        </div>
        <div>
          {isFriend ? (
            <div className="flex space-x-3">
              <button className="px-3 py-1.5 bg-white/10 text-white rounded-md text-sm font-medium flex items-center">
                <UserCheck2 className="w-4 h-4 mr-1" />
                Bạn bè
              </button>
              <button
                className="px-3 py-1.5 bg-white/10 text-white rounded-md text-sm font-medium flex items-center hover:cursor-pointer hover:bg-white/30"
                onClick={handleDeleteFriend}
              >
                <UserMinus2Icon className="w-4 h-4 mr-1" />
                Hủy kết bạn
              </button>
            </div>
          ) : isSentRequest ? (
            isSender ? (
              <button
                className="px-3 py-1.5 bg-white/10 text-white rounded-md text-sm font-medium flex items-center hover:cursor-pointer hover:bg-white/30"
                onClick={handleDeleteAddFriendRequest}
              >
                <UserMinus2Icon className="w-4 h-4 mr-1" />
                Hủy lời mời
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  className="px-3 py-1.5 bg-blue-500/70 text-white rounded-md text-sm font-medium flex items-center hover:cursor-pointer hover:bg-blue-500"
                  onClick={handleAcceptAddFriend}
                >
                  <UserCheck2 className="w-4 h-4 mr-1" />
                  Xác nhận
                </button>
                <button
                  className="px-3 py-1.5 bg-white/10 text-white rounded-md text-sm font-medium flex items-center hover:cursor-pointer hover:bg-white/30"
                  onClick={handleRejectAddFriend}
                >
                  <UserMinus2Icon className="w-4 h-4 mr-1" />
                  Từ chối
                </button>
              </div>
            )
          ) : (
            <button
              className="px-3 py-1.5 bg-blue-500/70 text-white rounded-md text-sm font-medium flex items-center hover:cursor-pointer hover:bg-blue-500"
              onClick={handleAddFriendRequest}
            >
              <UserPlus className="w-4 h-4 mr-1" />
              Thêm bạn
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchUsers;
