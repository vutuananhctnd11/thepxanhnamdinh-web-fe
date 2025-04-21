/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useNagivateLoading from "@/hooks/useNagivateLoading";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { refreshAccessToken } from "@/parts/ApiRefreshToken";
import ModalNotification from "@/parts/ModalNotification";
import { Dropdown, Menu } from "antd";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";

const Header = ({ isFixed }) => {
  const navigate = useNagivateLoading();
  const [userLogin, setUserLogin] = useState(null);
  const [isModalNotiOpen, setIsModalNotiOpen] = useState(false);
  const [modalNotiProps, setModalNotiProps] = useState({});
  const [isLogin, setIsLogin] = useState(false);

  const openModal = ({
    title,
    message,
    type,
    buttonText,
    redirectPath,
    cancelButtonText,
    onConfirm,
  }) => {
    setModalNotiProps({
      modalTitle: title,
      modalMessage: message,
      type: type,
      buttonText: buttonText,
      redirectPath: redirectPath,
      cancelButtonText: cancelButtonText,
      onConfirm: onConfirm,
    });
    setIsModalNotiOpen(true);
  };

  const items = [
    {
      key: "1",
      label: <span>Thông tin cá nhân</span>,
    },
    {
      key: "2",
      label: <span>Đăng xuất</span>,
    },
  ];

  useEffect(() => {
    const fetchUserLogin = async () => {
      try {
        const res = await fetchWithAuth("http://localhost:8080/users/me", {
          method: "GET",
        });

        const response = await res.json();

        if (response.status == "success") {
          localStorage.setItem("userLogin", JSON.stringify(response.data));
          setUserLogin(response.data);
          setIsLogin(true);
        } else {
          console.log("Thất bại: ", response.message);
        }
      } catch (error) {
        console.log("có lỗi khi gọi api: " + error);
        const accessToken = localStorage.getItem("accessToken");
        const currentPath = window.location.pathname;
        const isSocialPath = currentPath.startsWith("/social");

        if (accessToken && isSocialPath) {
          setModalNotiProps({
            modalTitle: "Phiên đăng nhập đã hết hạn",
            modalMessage: "Vui lòng đăng nhập lại!",
            type: "error",
            buttonText: "Đăng nhập",
            redirectPath: "/login",
          });
          setIsModalNotiOpen(true);
          localStorage.clear();
        } else if (isSocialPath) {
          setModalNotiProps({
            modalTitle: "Bạn chưa đăng nhập",
            modalMessage: "Vui lòng đăng nhập để sử dụng TXND FanZone!",
            buttonText: "Đăng nhập",
            redirectPath: "/login",
          });
          setIsModalNotiOpen(true);
        }
      }
    };
    fetchUserLogin();
  }, []);

  const deleteCookie = (name) => {
    document.cookie = `${name}=; Max-Age=-99999999; path=/;`;
  };

  const handleMenuClick = async ({ key }) => {
    if (key === "1") {
      console.log("Thông tin cá nhân");
    }

    if (key === "2") {
      openModal({
        title: "Đăng xuất?",
        message: "Bạn có chắc chắn muốn đăng xuất không?",
        type: "warning",
        buttonText: "Đăng xuất",
        cancelButtonText: "Hủy",
        onConfirm: () => {
          localStorage.removeItem("accessToken");
          deleteCookie("refreshToken");
          location.reload();
        },
      });
    }
  };

  return (
    <div
      className={`bg-[url('/public/bgblue.jpg')] text-white w-[100%] h-13 bg-cover bg-no-repeat ${
        isFixed ? "fixed z-50" : ""
      }`}
    >
      <div className="flex h-full">
        <div className="flex items-center w-[20%] h-full">
          <img src="/public/logo.png" className="h-[50px] pl-6" />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className=" h-[10px] text-[24px] font-bold pl-3 flex items-center cursor-pointer"
            onClick={() => navigate("/social/home")}
          >
            TXND FanZone
          </motion.p>
        </div>
        <div className="flex text-lg m-auto items-center justify-center">
          <div
            className="px-12 py-2 rounded-t-md hover:bg-white/20 hover:border-b-5 transition-all cursor-pointer"
            onClick={() => navigate("/social/home")}
          >
            <i class="fa-solid fa-house scale-120" />
          </div>
          <div className="px-12 py-2 rounded-t-md hover:bg-white/20 hover:border-b-5 transition-all cursor-pointer">
            <i class="fa-solid fa-user-plus scale-120" />
          </div>
          <div
            className="px-12 py-2 rounded-t-md hover:bg-white/20 hover:border-b-5 transition-all cursor-pointer"
            onClick={() => navigate("/home-club")}
          >
            <i class="fa-solid fa-futbol scale-120"></i>
          </div>
          <div
            className="px-12 py-2 rounded-t-md hover:bg-white/20 hover:border-b-5 transition-all cursor-pointer"
            onClick={() => navigate("/order-ticket")}
          >
            <i class="fa-solid fa-ticket scale-130" />
          </div>
          <div className="px-12 py-2 rounded-t-md hover:bg-white/20 hover:border-b-5 transition-all cursor-pointer">
            <i class="fa-solid fa-people-group scale-125" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 p-5 w-[20%]">
          {isLogin ? (
            <div>
              <Dropdown
                menu={{
                  items,
                  onClick: handleMenuClick,
                  className: "custom-dropdown-menu",
                }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <div className="cursor-pointer">
                  <Avatar className="scale-105">
                    <AvatarImage
                      src={userLogin.avatar ? userLogin.avatar : "/hlv.png"}
                      className="object-cover"
                    />
                  </Avatar>
                </div>
              </Dropdown>
            </div>
          ) : (
            <div className="flex gap-3">
              <div
                className="hover:scale-105 transition-transform duration-400 cursor-pointer"
                onClick={() => navigate("/sign-up")}
              >
                Đăng ký
              </div>
              <div>|</div>
              <div
                className="hover:scale-105 transition-transform duration-400 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </div>
            </div>
          )}
        </div>
      </div>

      <ModalNotification
        isModalOpen={isModalNotiOpen}
        setIsModalOpen={setIsModalNotiOpen}
        {...modalNotiProps}
      />
    </div>
  );
};

export default Header;
