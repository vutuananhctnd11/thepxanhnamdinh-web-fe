/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { refreshAccessToken } from "@/parts/ApiRefreshToken";
import { BellRing, LogOutIcon } from "lucide-react";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import ModalNotification from "@/parts/ModalNotification";

const Header = () => {
  const navigate = useNavigate();
  const [userLogin, setUserLogin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState({});

  const openModal = ({ title, message, type, buttonText, redirectPath }) => {
    setModalProps({
      modalTitle: title,
      modalMessage: message,
      type: type,
      buttonText: buttonText,
      redirectPath,
    });
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchUserLogin = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          openModal({
            title: "Bạn chưa đăng nhập",
            message: "Vui lòng đăng nhập để truy cập trang quản trị!",
            type: "error",
            buttonText: "Đăng nhập",
            redirectPath: "/login",
          });
          return;
        }

        let res = await fetchWithAuth(
          `${import.meta.env.VITE_API_URL}/users/admin/me`,
          {
            method: "GET",
          }
        );

        if (res.status == 401) {
          navigate("/access-denied");
          return;
        }

        const response = await res.json();

        if (response.status == "success") {
          setUserLogin(response.data);
          localStorage.setItem("userLogin", JSON.stringify(response.data));
        } else console.log("có lỗi" + response.message);
      } catch (error) {
        console.log("có lỗi" + error);
      }
    };
    fetchUserLogin();
  }, []);

  const handleLogout = () => {
    setModalProps({
      modalTitle: "Đăng xuất?",
      modalMessage: "Bạn có chắc chắn muốn đăng xuất không?",
      type: "warning",
      buttonText: "Đăng xuất",
      cancelButtonText: "Hủy",
      onConfirm: () => {
        localStorage.removeItem("accessToken");
        deleteCookie("refreshToken");
        location.reload();
      },
    });
    setIsModalOpen(true);
  };

  const deleteCookie = (name) => {
    document.cookie = `${name}=; Max-Age=-99999999; path=/;`;
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-[url('/public/bgblue.jpg')] text-white w-[100%] h-13 bg-cover bg-no-repeat fixed z-50">
        <div className="flex h-full">
          <div className="flex items-center w-[70%] h-full">
            <img
              src="/public/logo.png"
              className="h-[20px] md:h-[50px] pl-2 md:pl-6"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className=" h-[10px] text-sm md:text-[24px] font-bold pl-3 flex items-center cursor-pointer"
              onClick={() => navigate("/admin/dashboard")}
            >
              Trang quản trị TXND FanZone
            </motion.p>
          </div>
          <div className="flex items-center justify-end gap-4 p-5 w-[30%]">
            <div>
              <Avatar className="scale-105">
                <AvatarImage
                  src={userLogin?.avatar ? userLogin.avatar : "/hlv.png"}
                  className={"object-cover"}
                />
              </Avatar>
            </div>
            <div className="cursor-pointer">
              <LogOutIcon className="scale-100" onClick={handleLogout} />
            </div>
          </div>
        </div>
      </div>
      <ModalNotification
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        {...modalProps}
      />
    </div>
  );
};

export default Header;
