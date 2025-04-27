import React, { useEffect, useState } from "react";
import LayoutSocial from "../../components/LayoutSocial";
import {
  Users,
  Shield,
  Eye,
  Calendar,
  ChevronRight,
  LucideSearch,
  CheckCircle2Icon,
  PlusCircle,
} from "lucide-react";
import { handleAuthError } from "@/parts/HandleAuthError";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import ModalNotification from "@/parts/ModalNotification";
import useNagivateLoading from "@/hooks/useNagivateLoading";

const ListGroupPage = () => {
  const [modalNotiProps, setModalNotiProps] = useState({});
  const [isModalNotiOpen, setIsModalNotiOpen] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 5;
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNagivateLoading();

  const initialGroups = [
    {
      groupId: 1,
      groupName: "LFC Việt Nam",
      type: 2, // 1: fandom, 0: nhóm thường
      censorPost: true,
      censorMember: true,
      avatarImage: "/hlv.png",
      createdDate: "20/04/2025",
      totalMembers: 2,
    },
    {
      groupId: 2,
      groupName: "Cộng đồng React Việt Nam",
      type: 1,
      censorPost: false,
      censorMember: true,
      avatarImage: "",
      createdDate: "15/04/2025",
      totalMembers: 156,
    },
    {
      groupId: 3,
      groupName: "Manchester United FC",
      type: 1,
      censorPost: true,
      censorMember: false,
      avatarImage: "",
      createdDate: "10/03/2025",
      totalMembers: 325,
    },
    {
      groupId: 4,
      groupName: "Chia sẻ kinh nghiệm du lịch",
      type: 0,
      censorPost: false,
      censorMember: false,
      avatarImage: "",
      createdDate: "05/01/2025",
      totalMembers: 89,
    },
  ];

  const [groups, setGroups] = useState([]);
  const [filter, setFilter] = useState("all"); // all, fandom, normal

  // Lọc nhóm theo loại
  const filteredGroups = groups.filter((group) => {
    if (filter === "all") return true;
    if (filter === "fandom") return group.type === 2;
    if (filter === "normal") return group.type === 0 || group.type === 1;
    return true;
  });

  //fetch lisst group
  const fetchListGroups = async () => {
    try {
      const res = await fetchWithAuth(
        `http://localhost:8080/groups/all?page=${page}&limit=${limit}`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        const listGroups = response.data.listResults;
        setGroups((prev) => [...prev, ...listGroups]);

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
    fetchListGroups();
  }, []);
  return (
    <LayoutSocial>
      <div className="bg-black/90 min-h-screen mt-13 p-4">
        <div className="w-[70%] mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-5">
              Hội nhóm mà bạn có thể quan tâm
            </h1>
            <div className="flex justify-between">
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-1 rounded-md cursor-pointer ${
                    filter === "all"
                      ? "bg-blue-500/90 text-white"
                      : "bg-white/30 text-white hover:bg-white/40"
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setFilter("fandom")}
                  className={`px-4 py-1 rounded-md cursor-pointer ${
                    filter === "fandom"
                      ? "bg-blue-500/90 text-white"
                      : "bg-white/30 text-white hover:bg-white/40"
                  }`}
                >
                  Hội cổ động viên
                </button>
                <button
                  onClick={() => setFilter("normal")}
                  className={`px-4 py-1 rounded-md cursor-pointer ${
                    filter === "normal"
                      ? "bg-blue-500/90 text-white"
                      : "bg-white/30 text-white hover:bg-white/40"
                  }`}
                >
                  Nhóm trao đổi
                </button>
              </div>
              <div className="w-[40%] text-white">
                <div className="h-8 relative">
                  <LucideSearch className="absolute left-2 h-8 justify-center scale-85" />
                  <input
                    type="text"
                    placeholder="Nhóm bạn tìm không có trong danh sách?"
                    className="w-full h-full bg-white/20 rounded-2xl pl-10 pr-4 outline-none placeholder-white/30"
                  />
                </div>
              </div>
              <div>
                <div className="px-4 py-1 text-white bg-blue-500/80 flex justify-center rounded-lg hover:cursor-pointer hover:bg-blue-500">
                  <PlusCircle className="scale-70 mr-1" /> Tạo nhóm
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredGroups.map((group) => (
              <div
                key={group.groupId}
                className="bg-white/20 text-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    <img
                      src={group.avatarImage || "/defaultavt.png"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="ml-4 flex-grow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <h2 className="text-lg font-semibold">
                          {group.groupName}
                        </h2>
                        {group.type === 2 && (
                          <i class="fa-regular fa-circle-check text-blue-500" />
                        )}
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-[12px] font-medium ${
                          group.type === 2
                            ? "bg-blue-200 text-blue-700"
                            : group.type === 1
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-200 text-purple-800"
                        }`}
                      >
                        {group.type === 2 && "Hội CĐV"}
                        {group.type === 1 && "Công khai"}
                        {group.type === 0 && "Riêng tư"}
                      </div>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-y-2 text-sm">
                      <div className="flex items-center">
                        <Users size={16} className="mr-1" />
                        <span>{group.totalMembers} thành viên</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-1" />
                        <span>Ngày tạo: {group.createdDate}</span>
                      </div>
                      <div
                        className="flex items-center"
                        title="Kiểm duyệt bài viết"
                      >
                        <Eye size={16} className="mr-1" />
                        <span>
                          Kiểm duyệt bài: {group.censorPost ? "Có" : "Không"}
                        </span>
                      </div>
                      <div
                        className="flex items-center"
                        title="Kiểm duyệt thành viên"
                      >
                        <Shield size={16} className="mr-1" />
                        <span>
                          Kiểm duyệt TV: {group.censorMember ? "Có" : "Không"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 ml-2">
                    <button
                      className="p-2 rounded-full hover:bg-white/20"
                      onClick={() =>
                        navigate(`/social/groups/detail/${group.groupId}`)
                      }
                    >
                      <ChevronRight size={20} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredGroups.length === 0 && (
              <div className="text-center py-8 bg-white/10 rounded-lg shadow">
                <p className="text-white">Không tìm thấy nhóm nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ModalNotification
        isModalOpen={isModalNotiOpen}
        setIsModalOpen={setIsModalNotiOpen}
        {...modalNotiProps}
      />
    </LayoutSocial>
  );
};

export default ListGroupPage;
