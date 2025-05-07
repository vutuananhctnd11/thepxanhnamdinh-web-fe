/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Calendar, Flag, MoreHorizontal } from "lucide-react";
import LayoutSocial from "../../components/LayoutSocial";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { useParams } from "react-router-dom";
import { handleAuthError } from "@/parts/HandleAuthError";
import ApiCheckIsMember from "@/parts/ApiCheckIsMember";
import ModalNotification from "@/parts/ModalNotification";
import { message } from "antd";
import UpdateGroupModal from "@/components/Group/UpdateGroupModal";
import { DeleteOutlined } from "@ant-design/icons";
import useNagivateLoading from "@/hooks/useNagivateLoading";
import { handleFriendAction } from "@/parts/HandleApiAction";
import NewsFeedInGroup from "@/components/GroupDetail/NewsFeedInGroup";
import CensorMember from "@/components/GroupDetail/CensorMember";

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const [activeTab, setActiveTab] = useState("discussion");
  const [groupInfo, setGroupInfo] = useState("discussion");
  const [listPosts, setListPosts] = useState([]);
  const [checkMember, setCheckMember] = useState(null);
  const [statusMember, setStatusMember] = useState(null);

  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [modalNotiProps, setModalNotiProps] = useState({});
  const [isModalNotiOpen, setIsModalNotiOpen] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNagivateLoading();

  const userLogin = JSON.parse(localStorage.getItem("userLogin"));

  const fetchGroupInfo = async () => {
    try {
      const res = await fetchWithAuth(
        `http://localhost:8080/groups/${groupId}`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        const groupResponse = response.data;
        setGroupInfo(groupResponse);
      }
    } catch (error) {
      console.log("Có lỗi khi gọi api: ", error);
      messageApi.error({
        content: "Lỗi khi lấy danh sách bài viết: " + error,
        duration: 3,
      });
    }
  };

  const handleDeleteGroup = () => {
    setModalNotiProps({
      modalTitle: "Bạn có chắc chắn muốn xóa nhóm?",
      modalMessage: "Xóa sẽ không thể khôi phục!",
      type: "warning",
      buttonText: "Xác nhận",
      cancelButtonText: "Hủy",
      onConfirm: fetchDeleteGroup,
    });
    setIsModalNotiOpen(true);
  };

  const fetchDeleteGroup = async () => {
    try {
      const res = await fetchWithAuth(
        `http://localhost:8080/groups/${groupId}`,
        {
          method: "PATCH",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        messageApi.success({
          content:
            "Xóa nhóm thành công, vui lòng liên hệ admin nếu muốn khôi phục",
          duration: 2,
        });
        setTimeout(() => {
          navigate("/social/home");
        }, 2000);
      } else {
        messageApi.error({
          content: "Lỗi khi xóa nhóm: " + response.message,
          duration: 3,
        });
      }
    } catch (error) {
      console.log("Có lỗi khi gọi api: ", error);
      messageApi.error({
        content: "Lỗi khi xóa nhóm: " + error,
        duration: 3,
      });
    }
  };

  const handleJoinGroup = () =>
    handleFriendAction({
      url: "http://localhost:8080/group-members/join-group",
      method: "POST",
      body: {
        userId: userLogin.userId,
        groupId: groupId,
      },
      onSuccess: () => {
        if (groupInfo?.censorMember) {
          setStatusMember(1);
        } else {
          setStatusMember(2);
        }
      },
      successMessage: `Gửi lời tham gia đến ${groupInfo.groupName} thành công!`,
      errorMessage: "Tham gia thất bại",
      messageApi: messageApi,
    });

  const handleLeavedGroup = () =>
    handleFriendAction({
      url: `http://localhost:8080/group-members?groupId=${groupId}&userId=${userLogin.userId}`,
      method: "DELETE",
      onSuccess: () => {
        setStatusMember(0);
      },
      successMessage: `Bạn ra không còn là thành viên của ${groupInfo.groupName}!`,
      errorMessage: "Rời nhóm thất bại",
      messageApi: messageApi,
    });

  const handleDeleteRequestGroup = () =>
    handleFriendAction({
      url: `http://localhost:8080/group-members/join-request?groupId=${groupId}&userId=${userLogin.userId}`,
      method: "DELETE",
      onSuccess: () => {
        setStatusMember(0);
      },
      successMessage: `Hủy yêu cầu tham gia ${groupInfo.groupName}!`,
      errorMessage: "Hủy yêu cầu thất bại",
      messageApi: messageApi,
    });

  useEffect(() => {
    fetchGroupInfo();
    const checkMemberStatus = async () => {
      const result = await ApiCheckIsMember(userLogin.userId, groupId);
      setCheckMember(result);
    };
    checkMemberStatus();
  }, []);

  useEffect(() => {
    if (groupInfo?.statusMember !== undefined) {
      setStatusMember(groupInfo.statusMember);
    }
  }, [groupInfo]);

  return (
    <LayoutSocial>
      {contextHolder}
      <div className="bg-black/90 min-h-screen mt-13 text-white">
        {/* Cover Photo */}
        <div className="relative h-64 bg-gray-300">
          <img
            src="/bg2.jpg"
            alt="Group cover"
            className="w-full h-full object-cover"
          />
          <div className="w-full h-full absolute bg-black/60 inset-0"></div>
          <div className="w-[80%] absolute bottom-4 left-4 md:left-8 flex items-end">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white bg-white overflow-hidden">
                <img
                  src={groupInfo.avatarImage || "/defaultavt.png"}
                  alt={groupInfo.groupName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="w-full flex items-end justify-between">
              <div className="ml-4 pb-2 w-full">
                <div className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg">
                  {groupInfo.groupName}
                </div>

                <div className="flex items-center mt-1">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {groupInfo.type == 2 ? "Hội cổ động viên" : "Nhóm trao đổi"}
                  </span>
                  <span className="text-white text-sm ml-2 drop-shadow-md">
                    {groupInfo.type == 1 ? "Công khai" : "Riêng tư"} •{" "}
                    {groupInfo.totalMembers} thành viên
                  </span>
                </div>
              </div>
              <div className="w-full flex justify-end">
                {statusMember == 2 ? (
                  <button
                    className="px-3 py-1.5 bg-black/30 text-white rounded-md text-sm font-medium hover:bg-white/40 hover:cursor-pointer"
                    onClick={handleLeavedGroup}
                  >
                    Rời khỏi nhóm
                  </button>
                ) : statusMember == 0 ? (
                  <button
                    className="px-3 py-1.5 bg-blue-500/80 text-white rounded-md text-sm font-medium hover:bg-blue-500 hover:cursor-pointer"
                    onClick={handleJoinGroup}
                  >
                    Tham gia nhóm
                  </button>
                ) : (
                  <button
                    className="px-3 py-1.5 bg-white/30 text-white rounded-md text-sm font-medium hover:bg-white/40 hover:cursor-pointer"
                    onClick={handleDeleteRequestGroup}
                  >
                    Hủy yêu cầu tham gia
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/10 shadow-sm mb-4 lg:px-[12%] text-white flex justify-between">
          <div className="max-w-6xl px-4">
            <div className="flex overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab("discussion")}
                className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${
                  activeTab === "discussion"
                    ? "text-white border-b-2 border-white bg-white/10"
                    : "text-white/70"
                }`}
              >
                Thảo luận
              </button>
              <button
                onClick={() => setActiveTab("members")}
                className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${
                  activeTab === "members"
                    ? "text-white border-b-2 border-white bg-white/10"
                    : "text-white/70"
                }`}
              >
                Thành viên
              </button>
              <button
                onClick={() => setActiveTab("moderationMember")}
                className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${
                  activeTab === "moderationMember"
                    ? "text-white border-b-2 border-white bg-white/10"
                    : "text-white/70"
                }`}
              >
                Kiểm duyệt thành viên
              </button>
              <button
                onClick={() => setActiveTab("moderationPost")}
                className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${
                  activeTab === "moderationPost"
                    ? "text-white border-b-2 border-white bg-white/10"
                    : "text-white/70"
                }`}
              >
                Kiểm duyệt bài viết
              </button>
            </div>
          </div>
          {checkMember?.memberRole == 2 && (
            <div
              className="px-4 flex items-center hover:bg-white/10 rounded-lg"
              onClick={handleDeleteGroup}
            >
              <DeleteOutlined />
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 pb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Left Sidebar */}
            <div className="w-full md:w-1/3 lg:w-2/7 order-2 md:order-1">
              <div className="bg-white/10 rounded-lg shadow mb-4">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-bold text-lg">Giới thiệu</h2>
                    {checkMember?.memberRole == 2 && (
                      <button
                        className="px-2 py-1 rounded-lg text-[#66FFFF] text-sm hover:bg-white/10"
                        onClick={() => setIsModalUpdateOpen(true)}
                      >
                        Chỉnh sửa
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-white mb-3">
                    {groupInfo.description}
                  </p>
                  <div className="flex items-center text-sm text-white mt-4 mb-2">
                    <Flag size={16} className="mr-2" />
                    <span>
                      {groupInfo.type == 2
                        ? "Hội cổ động viên"
                        : "Nhóm trao đổi"}{" "}
                      • {groupInfo.type == 1 ? "Công khai" : "Riêng tư"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-white mb-2">
                    <Calendar size={16} className="mr-2" />
                    <span>Thành lập ngày 20/04/2025</span>
                  </div>
                </div>
              </div>

              {/* Admins & Mods Section */}
              <div className="bg-white/10 rounded-lg shadow mb-4">
                <div className="p-4">
                  <h2 className="font-bold text-lg mb-3">
                    Quản trị viên và người kiểm duyệt
                  </h2>
                  <button className="w-full mt-3 text-blue-600 text-sm font-medium">
                    Xem tất cả
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full md:w-2/3 lg:w-5/7 order-1 md:order-2">
              {activeTab === "discussion" && (
                <NewsFeedInGroup
                  checkMember={checkMember}
                  groupInfo={groupInfo}
                />
              )}
              {activeTab === "moderationMember" && (
                <CensorMember/>
              )}
            </div>
          </div>
        </div>
        <UpdateGroupModal
          isModalOpen={isModalUpdateOpen}
          setIsModalOpen={setIsModalUpdateOpen}
          groupInfo={groupInfo}
        />
        <ModalNotification
          isModalOpen={isModalNotiOpen}
          setIsModalOpen={setIsModalNotiOpen}
          {...modalNotiProps}
        />
      </div>
    </LayoutSocial>
  );
};

export default GroupDetailPage;
