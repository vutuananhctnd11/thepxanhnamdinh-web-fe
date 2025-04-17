/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SideBar = () => {
  const navigate = useNavigate();
  const [isClubMenuOpen, setIsClubMenuOpen] = useState(false);
  return (
    <div className="flex flex-col w-64 mt-13 pr-1 bg-black/20 text-white shadow-amber-50 shadow-lg">
      <div className="p-4 font-bold text-xl">Quản lý CLB</div>
      <nav className="flex flex-col space-y-2">
        <Link
          to="/admin/dashboard"
          className="flex space-x-2 items-center p-2 pl-4 hover:bg-white/10 rounded-lg hover:cursor-pointer"
        >
          Trang chủ
        </Link>
        <Link
          to="/admin/users"
          className="flex space-x-2 items-center p-2 pl-4 hover:bg-white/10 rounded-lg hover:cursor-pointer"
        >
          Người dùng
        </Link>
        <div
          className="flex space-x-2 items-center p-2 pl-4 hover:bg-white/10 rounded-lg hover:cursor-pointer"
          onClick={() => setIsClubMenuOpen((prev) => !prev)}
        >
          <div className="w-full">Quản lý cầu thủ</div>
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
              className="ml-6 text-sm flex flex-col space-y-1 overflow-y-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="p-2 hover:bg-white/10 rounded-lg cursor-pointer"
                onClick={() => navigate("/admin/list-player")}
              >
                Danh sách cầu thủ
              </div>
              <div className="p-2 hover:bg-white/10 rounded-lg cursor-pointer">
                Trận đấu
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Link
          to="/admin/users"
          className="flex space-x-2 items-center p-2 pl-4 hover:bg-white/10 rounded-lg hover:cursor-pointer"
        >
          Người dùng
        </Link>
      </nav>
      <div className="text-[10px] mt-auto">
        <div className="flex justify-center mb-1">
          Copyright © TXND FanZone 2025 - All right reserved.
        </div>
      </div>
    </div>
  );
};

export default SideBar;
