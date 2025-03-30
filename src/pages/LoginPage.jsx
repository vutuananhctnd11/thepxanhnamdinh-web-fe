import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

const LoginPage = () => {
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
            <div className="text-lg md:text-2xl font-bold text-[#0897df] flex justify-center">
              Nơi kết nối các cổ động viên
            </div>
          </div>
        </div>

        {/* form đăng nhập */}
        <div className="w-[60%] h-[70%]">
          <div className="w-full p-6 bg-black/60 rounded-2xl text-white">
            <div className="text-sm lg:text-2xl mb-8 font-bold flex justify-center">
              ĐĂNG NHẬP
            </div>
            <div className="grid items-center gap-1.5 mb-5">
              <Label htmlFor="fullName" className={"text-md"}>
                Email/Tên đăng nhập
              </Label>
              <Input type="text" id="username" />
            </div>
            <div className="grid max-w-sm items-center gap-1.5">
              <Label htmlFor="fullName" className={"text-md"}>
                Mật khẩu
              </Label>
              <Input type="password" id="password" />
            </div>
            <div>
              <div className="underline mt-2 mx-4 flex justify-end">
                Quên mật khẩu?
              </div>
            </div>
            <div className="w-full">
              <button
                className="px-6 py-2 mt-6 w-full bg-blue-500/60 text-white font-semibold
               rounded-lg shadow-md hover:bg-blue-600/70 transition"
              >
                Đăng nhập
              </button>
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
