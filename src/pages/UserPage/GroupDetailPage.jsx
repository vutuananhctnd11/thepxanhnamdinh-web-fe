/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Calendar, Flag, MoreHorizontal } from "lucide-react";
import LayoutSocial from "../../components/LayoutSocial";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { useParams } from "react-router-dom";
import { handleAuthError } from "@/parts/HandleAuthError";
import ModalNotification from "@/parts/ModalNotification";
import CreatePost from "@/components/Post/CreatePost";
import NewsFeed from "@/components/HomePage/NewsFeed";

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const [activeTab, setActiveTab] = useState("discussion");
  const [groupInfo, setGroupInfo] = useState("discussion");
  const [listPosts, setListPosts] = useState([]);
  const [checkMember, setCheckMember] = useState(null);

  const [modalNotiProps, setModalNotiProps] = useState({});
  const [isModalNotiOpen, setIsModalNotiOpen] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 5;
  const [hasMore, setHasMore] = useState(true);

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
      handleAuthError(error, setModalNotiProps, setIsModalNotiOpen);
    }
  };

  const fetchCheckMember = async () => {
    try {
      const res = await fetchWithAuth(
        `http://localhost:8080/group-members?userId=${userLogin.userId}&groupId=${groupId}`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        setCheckMember(response.data);
      }
    } catch (error) {
      console.log("Có lỗi khi gọi api: ", error);
      handleAuthError(error, setModalNotiProps, setIsModalNotiOpen);
    }
  };

  const fetchGroupPost = async () => {
    try {
      const res = await fetchWithAuth(
        `http://localhost:8080/posts/group?page=${page}&limit=${limit}&groupId=${groupId}`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        const posts = response.data.listResults;
        setListPosts((prev) => [...prev, ...posts]);

        if (response.totalPage == page) {
          setHasMore(false);
        } else {
          setPage((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.log("Có lỗi khi gọi api: ", error);
      handleAuthError(error, setModalNotiProps, setIsModalNotiOpen);
    }
  };

  useEffect(() => {
    fetchGroupInfo();
    fetchGroupPost();
    fetchCheckMember();
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
            <div className="w-full md:w-1/3 lg:w-2/7 order-2 md:order-1">
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
            <div className="w-full md:w-2/3 lg:w-5/7 order-1 md:order-2">
              {/* list post */}
              {checkMember?.isMember ? (
                <div>
                  <div className="w-[80%]">
                    <CreatePost />
                  </div>
                  <NewsFeed listPost={listPosts} isReaction={true} />
                </div>
              ) : (
                <NewsFeed listPost={listPosts} isReaction={false} />
              )}
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
