/* eslint-disable no-unused-vars */
import React from "react";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useNagivateLoading from "@/hooks/useNagivateLoading";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Header = ({ isFixed }) => {
  const navigate = useNavigate();
  const navigateLoading = useNagivateLoading();

  return (
    <div
      className={`bg-[url('/public/bgblue.jpg')] text-white w-[100%] h-13 bg-cover bg-no-repeat ${
        isFixed ? "fixed z-50" : ""
      }`}
    >
      <div className="flex h-full">
        <div className="flex items-center h-full">
          <img src="/public/logo.png" className="h-[50px] pl-6" />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className=" h-[10px] text-[24px] font-bold pl-3 flex items-center cursor-pointer"
            onClick={() => navigate("/home")}
          >
            TXND FanZone
          </motion.p>
        </div>
        <div className="flex text-lg m-auto items-center pl-15 space-x-3.5">
          <div
            className="hover:scale-105 transition-transform duration-400 cursor-pointer"
            onClick={() => navigate("/home")}
          >
            Trang chủ
          </div>
          <div>|</div>
          <div className="hover:scale-105 transition-transform duration-400 cursor-pointer">
            Kết bạn
          </div>
          <div>|</div>
          <div
            className="hover:scale-105 transition-transform duration-400 cursor-pointer"
            onClick={() => navigateLoading("/home-club")}
          >
            Thông tin CLB
          </div>
          <div>|</div>
          <div
            className="hover:scale-105 transition-transform duration-400 cursor-pointer"
            onClick={() => navigateLoading("/order-ticket")}
          >
            Mua vé
          </div>
          <div>|</div>
          <div className="hover:scale-105 transition-transform duration-400 cursor-pointer">
            Hội CĐV
          </div>
        </div>
        <div className="flex items-center ml-auto gap-4 p-5">
          <div className="text-lg">
            <Avatar>
              <AvatarImage
                src="hlv.png"
                alt="Vũ Hồng Việt"
                className={"object-cover"}
              />
            </Avatar>
          </div>
          <LogOut size={25} onClick={() => navigate("/login")} />
        </div>
      </div>
    </div>
  );
};

export default Header;
