import React, { useEffect } from "react";
import { useState } from "react";
import { UserPlus, UserMinus, Search } from "lucide-react";
import { handleFriendAction } from "@/parts/HandleApiAction";
import { useParams } from "react-router-dom";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { message } from "antd";

const CensorMember = () => {
  const { groupId } = useParams();
  const [members, setMembers] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  //   const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;
  const [hasMore, setHasMore] = useState(true);

  const userLogin = JSON.parse(localStorage.getItem("userLogin"));

  const fetchListJoinRequest = async () => {
    try {
      const res = await fetchWithAuth(
        `http://localhost:8080/group-members/list-join-request?page=${page}&limit=${limit}&groupId=${groupId}`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        const listRequest = response.data.listResults;
        setMembers(listRequest);
      }
    } catch (error) {
      console.log("Có lỗi khi gọi api: ", error);
      messageApi.error({
        content: "Lỗi khi lấy danh sách bài viết: " + error,
        duration: 3,
      });
    }
  };

  const handleApprove = (member) =>
    handleFriendAction({
      url: `http://localhost:8080/group-members/${member.groupMemberId}`,
      method: "PATCH",
      onSuccess: () => {
        setMembers(
          members.filter((m) => m.groupMemberId !== member.groupMemberId)
        );
      },
      successMessage: `${
        member.firstName + " " + member.lastName
      } đã là thành viên của nhóm!`,
      errorMessage: "Chấp nhận thất bại",
      messageApi: messageApi,
    });

  const handleReject = (member) =>
    handleFriendAction({
      url: `http://localhost:8080/group-members/join-request?groupId=${groupId}&userId=${userLogin.userId}`,
      method: "DELETE",
      onSuccess: () => {
        setMembers(
          members.filter((m) => m.groupMemberId !== member.groupMemberId)
        );
      },
      successMessage: `${
        member.firstName + " " + member.lastName
      } đã không được phê duyệt vào nhóm!`,
      errorMessage: "Từ chối thất bại",
      messageApi: messageApi,
    });

  useEffect(() => {
    fetchListJoinRequest();
  }, []);

  //   // Lọc thành viên theo tên
  //   const filteredMembers = members.filter((member) =>
  //     member.name.toLowerCase().includes(searchTerm.toLowerCase())
  //   );

  return (
    <div className="w-full max-w-2xl bg-white/10 rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4 text-white">
        Kiểm Duyệt Thành Viên Nhóm
      </h2>
      {contextHolder}

      {/* Thanh tìm kiếm */}
      {/* <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tìm kiếm thành viên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div> */}

      {/* Danh sách thành viên */}
      <div className="space-y-3">
        {members.length > 0 ? (
          members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between bg-white/10 p-3 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={member.avatar || "/defaultavt.png"}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-white">
                    {member.firstName + " " + member.lastName}
                  </p>
                  <p className="text-sm text-white/70">
                    Yêu cầu: {member.requestAt}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                  onClick={() => handleApprove(member)}
                >
                  <UserPlus className="w-5 h-5" />
                </button>
                <button
                  className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                  onClick={() => handleReject(member)}
                >
                  <UserMinus className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            Không tìm thấy thành viên nào
          </div>
        )}
      </div>

      {/* Hiển thị tổng số thành viên đang chờ duyệt */}
      <div className="mt-4 text-sm text-white text-right">
        Tổng số: {members.length} thành viên đang chờ duyệt
      </div>
    </div>
  );
};

export default CensorMember;
