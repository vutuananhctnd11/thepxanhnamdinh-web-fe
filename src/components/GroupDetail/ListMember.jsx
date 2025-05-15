import useNagivateLoading from "@/hooks/useNagivateLoading";
import ApiCheckIsMember from "@/parts/ApiCheckIsMember";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { handleFriendAction } from "@/parts/HandleApiAction";
import { message, Tooltip } from "antd";
import {
  BadgeCheck,
  Search,
  TrendingUp,
  UserMinus,
  UserMinus2,
  UserPlus,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ListMember = ({ checkMember }) => {
  const { groupId } = useParams();
  const [members, setMembers] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [page, setPage] = useState(1);
  const limit = 5;
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNagivateLoading();

  const userLogin = JSON.parse(localStorage.getItem("userLogin"));

  const fetchListMembers = async () => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/group-members/list-member?page=${page}&limit=${limit}&groupId=${groupId}`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        const listRequest = response.data.listResults;
        setMembers((prev) => [...prev, ...listRequest]);

        if (response.data.totalPage <= page) {
          setHasMore(false);
        } else {
          setPage((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.log("Có lỗi khi gọi api: ", error);
      messageApi.error({
        content: "Lỗi khi lấy danh sách bài viết: " + error,
        duration: 3,
      });
    }
  };

  const handleDeleteMember = (member) =>
    handleFriendAction({
      url: `${import.meta.env.VITE_API_URL}/group-members?groupId=${groupId}&userId=${userLogin.userId}`,
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
    fetchListMembers();
  }, []);

  return (
    <div className="w-full max-w-2xl bg-white/10 rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4 text-white">
        {members.length} Thành viên
      </h2>
      {contextHolder}

      {/* Thanh tìm kiếm */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tìm kiếm thành viên..."
          // value={}
          // onChange={}
        />
      </div>
      <div className="max-h-[500px] overflow-y-auto custom-scroll-bar">
        {/* <InfiniteScroll
          dataLength={members.length}
          next={fetchListJoinRequest}
          hasMore={hasMore}
          loader={<h4 className="text-center my-4">Đang tải thêm...</h4>}
          scrollThreshold={0.8}
          scrollableTarget="scrollableDiv"
          endMessage={
            <p className="flex text-white/60 text-sm justify-center py-4">
              Đã hiển thị tất cả yêu cầu tham gia.
            </p>
          }
          className="w-full flex flex-col gap-4"
        > */}
        {/* Danh sách thành viên */}
        <div className="space-y-3">
          {members.length > 0 ? (
            members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between bg-white/10 p-3 rounded-lg"
              >
                <div
                  className="flex items-center space-x-3 hover:cursor-pointer"
                  onClick={() =>
                    navigate(`/social/personal-page/${member.userId}`)
                  }
                >
                  <img
                    src={member.avatar || "/defaultavt.png"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-white">
                      {member.firstName + " " + member.lastName}
                    </p>
                    <p className="text-xs mt-1 text-white/70">
                      Là thành viên {member.requestAt}
                    </p>
                  </div>
                </div>
                <div className="text-[14px]">
                  {member.memberRole == 2 && (
                    <div className="text-red-700 text-xs font-semibold bg-red-100 px-2 py-1 rounded-xl">
                      Quản trị viên
                    </div>
                  )}
                  {member.memberRole == 1 && (
                    <div className="text-blue-600 text-xs font-semibold bg-blue-100 px-2 py-1 rounded-xl">
                      Người kiểm duyệt
                    </div>
                  )}
                  {member.memberRole == 0 && (
                    <div className="text-green-700 text-xs font-semibold bg-green-100 px-2 py-1 rounded-xl">
                      Thành viên
                    </div>
                  )}
                </div>
                {checkMember?.isMember && checkMember?.memberRole !== 0 && (
                  <div className="flex space-x-2">
                    <Tooltip title="Chỉ định thành Người kiểm duyệt">
                      <button
                        className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                        // onClick={() => handleApprove(member)}
                      >
                        <i class="fa-solid fa-user-tie w-6 h-5 scale-115"></i>
                      </button>
                    </Tooltip>
                    <Tooltip title="Xóa thành viên">
                      <button
                        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                        title="Thăng chức thành quản trị viên"
                        onClick={() => handleDeleteMember(member)}
                      >
                        <i class="fa-solid fa-user-minus w-6 h-5"></i>
                      </button>
                    </Tooltip>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              Không tìm thấy thành viên nào
            </div>
          )}
        </div>
        {/* </InfiniteScroll> */}
      </div>
    </div>
  );
};

export default ListMember;
