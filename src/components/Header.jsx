/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useNagivateLoading from "@/hooks/useNagivateLoading";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { refreshAccessToken } from "@/parts/ApiRefreshToken";
import ModalNotification from "@/parts/ModalNotification";
import { Dropdown, Menu } from "antd";

const Header = ({ isFixed }) => {
  const navigate = useNagivateLoading();
  const [userLogin, setUserLogin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState({});
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
    setModalProps({
      modalTitle: title,
      modalMessage: message,
      type: type,
      buttonText: buttonText,
      redirectPath: redirectPath,
      cancelButtonText: cancelButtonText,
      onConfirm: onConfirm,
    });
    setIsModalOpen(true);
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
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;
        let res = await fetch("http://localhost:8080/users/me", {
          method: "GET",
          headers: { Authorization: "Bearer " + accessToken },
        });

        if (res.status === 403) {
          console.log("Token hết hạn, đang gọi refresh...");
          const newToken = await refreshAccessToken();
          console.log("New access token: " + newToken);

          if (!newToken) {
            if (localStorage.getItem("accessToken")) {
              openModal({
                title: "Phiên đăng nhập đã hết hạn",
                message: "Vui lòng đăng nhập lại!",
                type: "error",
                buttonText: "Đăng nhập",
                redirectPath: "/login",
              });
              localStorage.clear();
              return;
            }
            return;
          }

          res = await fetch("http://localhost:8080/users/me", {
            method: "GET",
            headers: { Authorization: "Bearer " + newToken },
          });
        }

        const response = await res.json();

        if (response.status == "success") {
          localStorage.setItem("userLogin", JSON.stringify(response.data));
          setUserLogin(response.data);
          setIsLogin(true);
        } else alert("có lỗi");
      } catch (error) {
        console.log("có lỗi" + error);
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
            onClick={() => navigate("/home")}
          >
            TXND FanZone
          </motion.p>
        </div>
        <div className="flex text-lg m-auto items-center justify-center">
          <div
            className="px-12 py-2 rounded-t-md hover:bg-white/20 hover:border-b-5 transition-all cursor-pointer"
            onClick={() => navigate("/home")}
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
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        {...modalProps}
      />
    </div>
  );
};

export default Header;
