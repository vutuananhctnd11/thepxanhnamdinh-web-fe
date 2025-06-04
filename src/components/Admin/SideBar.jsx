/* eslint-disable no-unused-vars */
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SideBar = () => {
  const navigate = useNavigate();
  const [isClubMenuOpen, setIsClubMenuOpen] = useState(false);
  const [isFanMenuOpen, setIsFanMenuOpen] = useState(false);
  const [isMatchMenuOpen, setIsMatchMenuOpen] = useState(false);
  const [isClubOtherMenuOpen, setIsClubOtherMenuOpen] = useState(false);

  const [userLogin, setUserLogin] = useState(null);

  const fetchAdminInfo = async (post) => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/users/admin/me`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        setUserLogin(response.data);
      }
    } catch (error) {
      console.log("Có lỗi khi gọi api: ", error);
    }
  };

  useEffect(() => {
    fetchAdminInfo();
  }, []);

  return (
    <div className="flex flex-col z-50 w-64 mt-13 pr-1 bg-black/80 text-white shadow-black shadow-lg overflow-y-auto custom-scroll-bar">
      <div className="p-2 font-bold text-lg bg-white/8">Quản lý CLB</div>
      {userLogin?.roleId == 1 && (
        <nav className="flex flex-col space-y-2 ml-2">
          <Link
            to="/admin/dashboard"
            className="flex space-x-2 items-center p-2 pl-4 hover:bg-white/10 rounded-lg hover:cursor-pointer"
          >
            Trang chủ
          </Link>
          <div
            className="flex space-x-2 items-center p-2 pl-4 hover:bg-white/10 rounded-lg hover:cursor-pointer"
            onClick={() => setIsMatchMenuOpen((prev) => !prev)}
          >
            <div className="w-full">Quản lý trận đấu</div>
            <div className="flex justify-end">
              {isMatchMenuOpen ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </div>
          </div>
          <AnimatePresence>
            {isMatchMenuOpen && (
              <motion.div
                className="ml-6 text-sm flex flex-col bg-white/5 rounded-md space-y-1 overflow-y-hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="p-2 hover:bg-white/10 rounded-lg cursor-pointer"
                  onClick={() => navigate("/admin/matches")}
                >
                  Lịch thi đấu
                </div>
                <hr className="border-white/30 mx-2" />
                <div
                  className="p-2 hover:bg-white/10 rounded-lg cursor-pointer"
                  onClick={() => navigate("/admin/matches/result")}
                >
                  Kết quả thi đấu
                </div>
                <hr className="border-white/30 mx-2" />
                <div
                  className="p-2 hover:bg-white/10 rounded-lg cursor-pointer"
                  onClick={() => navigate("/admin/matches/request-update")}
                >
                  Cập nhật kết quả
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div
            className="flex space-x-2 items-center p-2 pl-4 hover:bg-white/10 rounded-lg hover:cursor-pointer"
            onClick={() => setIsClubMenuOpen((prev) => !prev)}
          >
            <div className="w-full">Quản lý thông tin CLB</div>
            <div className="flex justify-end">
              {isClubMenuOpen ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </div>
          </div>
          <AnimatePresence>
            {isClubMenuOpen && (
              <motion.div
                className="ml-6 text-sm flex flex-col bg-white/5 rounded-md space-y-1 overflow-y-hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="p-2 hover:bg-white/10 rounded-lg cursor-pointer"
                  onClick={() => navigate("/admin/players")}
                >
                  Danh sách cầu thủ
                </div>
                <hr className="border-white/30 mx-2" />
                <div
                  className="p-2 hover:bg-white/10 rounded-lg cursor-pointer"
                  onClick={() => navigate("/admin/coaches")}
                >
                  Danh sách Ban huấn luyện
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div
            className="flex space-x-2 items-center p-2 pl-4 hover:bg-white/10 rounded-lg hover:cursor-pointer"
            onClick={() => setIsClubOtherMenuOpen((prev) => !prev)}
          >
            <div className="w-full">Dữ liệu các CLB khác</div>
            <div className="flex justify-end">
              {isClubOtherMenuOpen ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </div>
          </div>
          <AnimatePresence>
            {isClubOtherMenuOpen && (
              <motion.div
                className="ml-6 text-sm flex flex-col bg-white/5 rounded-md space-y-1 overflow-y-hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="p-2 hover:bg-white/10 rounded-lg cursor-pointer"
                  onClick={() => navigate("/admin/other-clubs")}
                >
                  Danh sách CLB đối thủ
                </div>
                <hr className="border-white/30 mx-2" />
                <div
                  className="p-2 hover:bg-white/10 rounded-lg cursor-pointer"
                  onClick={() => navigate("/admin/coaches")}
                >
                  Danh sách cầu thủ đại diện
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <Link
            to="/admin/users"
            className="flex space-x-2 items-center p-2 pl-4 hover:bg-white/10 rounded-lg hover:cursor-pointer"
          >
            Quản lý người dùng
          </Link>

          <Link
            to="/admin/matches/home"
            className="flex space-x-2 items-center p-2 pl-4 hover:bg-white/10 rounded-lg hover:cursor-pointer"
          >
            Mở bán vé
          </Link>
        </nav>
      )}

      <div className="p-2 font-bold text-lg bg-white/8">
        Quản lý Mạng xã hội
      </div>
      <nav className="flex flex-col space-y-2">
        <Link
          to="/admin/reports"
          className="flex space-x-2 items-center p-2 pl-4 hover:bg-white/10 rounded-lg hover:cursor-pointer"
        >
          Bài viết bị báo cáo
        </Link>
        <div
          className="flex space-x-2 items-center p-2 pl-4 hover:bg-white/10 rounded-lg hover:cursor-pointer"
          onClick={() => setIsFanMenuOpen((prev) => !prev)}
        >
          <div className="w-full">Quản lý Hội cổ động viên</div>
          <div className="flex justify-end">
            {isFanMenuOpen ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </div>
        </div>
        <AnimatePresence>
          {isFanMenuOpen && (
            <motion.div
              className="ml-6 text-sm flex flex-col bg-white/5 rounded-md space-y-1 overflow-y-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="p-2 hover:bg-white/10 rounded-lg cursor-pointer"
                onClick={() => navigate("/admin/fan-groups")}
              >
                Danh sách Hội cổ động viên
              </div>
              <hr className="border-white/30 mx-2" />
              <div
                className="p-2 hover:bg-white/10 rounded-lg cursor-pointer"
                onClick={() => navigate("/admin/fan-groups/create-request")}
              >
                Yêu cầu tạo hội cổ động viên
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <div className="text-[10px] mt-5">
        <div className="flex justify-center mb-1">
          Copyright © TXND FanZone 2025 - All right reserved.
        </div>
      </div>
    </div>
  );
};

export default SideBar;
