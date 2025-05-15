import { Input } from "@/components/ui/input";
import useNagivateLoading from "@/hooks/useNagivateLoading";
import { Form } from "antd";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";

const LoginPage = () => {
  const navigate = useNagivateLoading();
  const [errorMessage, setErrorMessage] = useState("");
  const onFinish = async (values) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });

      const response = await res.json();

      if (response.status == "success") {
        const token = response.data.token;
        localStorage.setItem("accessToken", token);
        const role = jwtDecode(token).role;
        if (role === "ROLE_USER") {
          navigate("/social/home");
        } else {
          navigate("/admin/dashboard");
        }
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      console.error("Có lỗi khi gọi API: " + error);
    }
  };

  return (
    <div className="w-full h-screen relative">
      <img
        src="/banner5.jpg"
        className="w-full h-full object-cover absolute opacity-85"
      />
      <div className="w-full lg:w-[40%] h-full flex flex-col justify-center items-center z-5 absolute">
        {/* Tiêu đề */}
        <div className="h-[30%] space-y-2 flex items-center justify-center">
          <img
            src="logo.png"
            className="h-[100px] drop-shadow-[0_10px_20px_rgba(0,139,208,0.8)]"
          />
          <div className="ml-3">
            <div
              className="text-4xl lg:text-5xl font-extrabold text-[#0897df] flex justify-center 
          drop-shadow-[0_10px_20px_rgba(0,139,208,0.4)]"
            >
              TXND FanZone
            </div>
            <div
              className="text-lg md:text-3xl font-bold text-[#0897df] flex justify-center"
              style={{ fontFamily: "Smooch Sans" }}
            >
              Nơi kết nối các cổ động viên
            </div>
          </div>
        </div>

        {/* form đăng nhập */}
        <div className="w-[60%] h-[70%]">
          <div className="w-full p-5 bg-black/50 rounded-2xl text-white">
            <div className="text-lg lg:text-2xl mb-8 font-bold flex justify-center">
              ĐĂNG NHẬP
            </div>
            <Form name="login-form" onFinish={onFinish} layout="vertical">
              <Form.Item
                style={{ marginBottom: "8px" }}
                label={
                  <span className="text-md text-white">Tên đăng nhập</span>
                }
                name="username"
                rules={[
                  { required: true, message: "Vui lòng nhập tên đăng nhập!" },
                ]}
              >
                <Input className="text-white" />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "8px" }}
                label={<span className="text-md text-white">Mật khẩu</span>}
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input type="password" className="text-white" />
              </Form.Item>

              <div
                className="mt-2 mx-4 flex justify-end text-white hover:underline hover:cursor-pointer"
                onClick={() => navigate("/forgot-password")}
              >
                Quên mật khẩu?
              </div>

              <Form.Item>
                <div className="text-red-600 mt-2 font-semibold flex justify-center">
                  <div className="bg-white/80 rounded-2xl px-2">
                    {errorMessage}
                  </div>
                </div>
                <button
                  type="primary"
                  htmlType="submit"
                  className="px-6 py-2 mt-3 w-full text-white bg-blue-500/70 font-semibold
               rounded-lg shadow-md hover:bg-blue-600/90 hover:cursor-pointer transition"
                >
                  Đăng nhập
                </button>
              </Form.Item>
            </Form>
            <div
              className="mt-2 flex justify-center text-white text-sm hover:underline hover:cursor-pointer"
              onClick={() => navigate("/sign-up")}
            >
              Bạn chưa có tài khoản?
            </div>
          </div>
        </div>
      </div>
      <div className="bottom-0 right-3 text-[13px] absolute z-10">
        © 2025 - Copyright by TuanAnhDev
      </div>
    </div>
  );
};

export default LoginPage;
