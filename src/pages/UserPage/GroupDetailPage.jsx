import { useEffect, useState } from "react";
import {
  VideoIcon,
  SmilePlus,
  Calendar,
  Flag,
  MoreHorizontal,
  ThumbsUp,
  MessageSquare,
  Share2,
  Image,
} from "lucide-react";
import LayoutSocial from "../../components/LayoutSocial";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { useParams } from "react-router-dom";
import { handleAuthError } from "@/parts/HandleAuthError";
import ModalNotification from "@/parts/ModalNotification";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import CreatePost from "@/components/Post/CreatePost";

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const [activeTab, setActiveTab] = useState("discussion");
  const [groupInfo, setGroupInfo] = useState("discussion");
  const [showMembersList, setShowMembersList] = useState(false);

  const [modalNotiProps, setModalNotiProps] = useState({});
  const [isModalNotiOpen, setIsModalNotiOpen] = useState(false);

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
      handleAuthError(error, setModalNotiProps, setIsModalNotiOpen);
    }
  };

  useEffect(() => {
    fetchGroupInfo();
  }, []);

  return (
    <LayoutSocial>
      <div className="bg-black/90 min-h-screen mt-13 text-white">
        {/* Cover Photo */}
        <div className="relative h-64 bg-gray-300">
          <img
            src="/bg2.jpg"
            alt="Group cover"
            className="w-full h-full object-cover"
          />
          <div className="w-full h-full absolute bg-black/60 inset-0"></div>
          <div className="absolute bottom-4 left-4 md:left-8 flex items-end">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white bg-white overflow-hidden">
                <img
                  src={groupInfo.avatarImage}
                  alt={groupInfo.groupName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="ml-4 pb-2">
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
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/10 shadow-sm mb-4 text-white">
          <div className="max-w-6xl mx-auto px-4">
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
              <button className="px-4 py-3 font-medium text-sm whitespace-nowrap text-white">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 pb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Left Sidebar */}
            <div className="w-full md:w-1/3 lg:w-2/5 order-2 md:order-1">
              {/* About Section */}
              <div className="bg-white/10 rounded-lg shadow mb-4">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-bold text-lg">Giới thiệu</h2>
                    <button className="px-2 py-1 rounded-lg text-[#66FFFF] text-sm hover:bg-white/10">
                      Chỉnh sửa
                    </button>
                  </div>
                  <p className="text-sm text-white mb-3">
                    {groupInfo.description}
                  </p>
                  <div className="flex items-center text-sm text-white mb-2">
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
                    <span>Tạo ngày 20/04/2025</span>
                  </div>
                </div>
              </div>

              {/* Admins & Mods Section */}
              <div className="bg-white/10 rounded-lg shadow mb-4">
                <div className="p-4">
                  <h2 className="font-bold text-lg mb-3">
                    Quản trị viên và người kiểm duyệt
                  </h2>
                  {/* <div className="space-y-3">
                    {groupInfo.admins.map((admin) => (
                      <div key={admin.id} className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img
                            src={admin.avatar}
                            alt={admin.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-sm">{admin.name}</p>
                          <p className="text-xs text-white/70">Quản trị viên</p>
                        </div>
                      </div>
                    ))}
                  </div> */}
                  <button className="w-full mt-3 text-blue-600 text-sm font-medium">
                    Xem tất cả
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full md:w-2/3 lg:w-3/4 order-1 md:order-2">
              {/* Create Post */}
              <CreatePost />

              {/* Featured Post */}
              <div className="bg-white/10 rounded-lg shadow mb-4 border-l-4 border-blue-500">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className="text-blue-600 text-sm font-medium">
                        Bài viết ghim
                      </span>
                    </div>
                    <button>
                      <MoreHorizontal size={18} />
                    </button>
                  </div>

                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src="/api/placeholder/40/40"
                        alt="Admin profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-sm">Nguyễn Văn A</p>
                      <p className="text-xs text-white">
                        Quản trị viên • 3 ngày trước
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-white">
                      {/* Chú thích: Đây là bài viết quan trọng được ghim của quản trị viên với thông báo về các hoạt động sắp tới của nhóm hoặc luật lệ của nhóm */}
                      Chào các thành viên! Lịch offline xem chung kết Champions
                      League đã được công bố. Xem chi tiết trong bài viết này và
                      đăng ký tham gia!
                    </p>
                  </div>

                  <div className="flex justify-between text-gray-500 text-sm">
                    <div className="flex space-x-4">
                      <button className="flex items-center hover:text-blue-600">
                        <ThumbsUp size={16} className="mr-1" />
                        <span>256</span>
                      </button>
                      <button className="flex items-center hover:text-blue-600">
                        <MessageSquare size={16} className="mr-1" />
                        <span>48</span>
                      </button>
                    </div>
                    <button className="flex items-center hover:text-blue-600">
                      <Share2 size={16} className="mr-1" />
                      <span>Chia sẻ</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* list post */}
            </div>
          </div>
        </div>
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
