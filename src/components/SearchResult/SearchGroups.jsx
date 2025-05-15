import useNagivateLoading from "@/hooks/useNagivateLoading";
import { handleFriendAction } from "@/parts/HandleApiAction";
import { message } from "antd";
import { Globe, LucideCircleCheck } from "lucide-react";
import React, { useState } from "react";

const SearchGroups = ({ group }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isJoined, setIsJoined] = useState(group.isJoined);
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
  const navigate = useNagivateLoading();

  const handleJoinGroup = () =>
    handleFriendAction({
      url: `${import.meta.env.VITE_API_URL}/group-members/join-group`,
      method: "POST",
      body: {
        userId: userLogin.userId,
        groupId: group.groupId,
      },
      onSuccess: () => {
        setIsJoined(true);
      },
      successMessage: `Gửi lời tham gia đến ${group.groupName} thành công!`,
      errorMessage: "Tham gia thất bại",
      messageApi: messageApi,
    });

  return (
    <div
      key={group.id}
      className="flex items-center p-3 hover:bg-white/10 rounded-lg"
    >
      {contextHolder}
      <div
        className="w-16 h-16 rounded-lg overflow-hidden mr-3 flex-shrink-0  hover:cursor-pointer"
        onClick={() => navigate(`/social/groups/detail/${group.groupId}`)}
      >
        <img
          src={group.avatarImage || "/defaultavt.png"}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex space-x-2">
          <h3 className="font-medium">{group.groupName}</h3>
          {group.type === 2 && (
            <LucideCircleCheck className="scale-75 text-blue-500" />
          )}
        </div>
        <div className="flex items-center text-sm text-white/70 mb-1">
          <span>
            {group.type === 2 && "Hội cổ động viên • "}
            {group.type === 1 ? "Nhóm công khai" : "Nhóm riêng tư"} •{" "}
            {group.totalMembers} thành viên
          </span>
        </div>
      </div>
      <div>
        {!isJoined && (
          <button
            className="px-3 py-1.5 bg-blue-500/80 text-white rounded-md text-sm font-medium hover:bg-blue-500 hover:cursor-pointer"
            onClick={handleJoinGroup}
          >
            Tham gia nhóm
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchGroups;
