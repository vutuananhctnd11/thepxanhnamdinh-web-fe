import useNagivateLoading from "@/hooks/useNagivateLoading";
import { ShieldAlert } from "lucide-react";
import React from "react";

const AccessDeniedPage = () => {
  const navigate = useNagivateLoading();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-300 to-blue-200 px-4 text-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <div className="flex justify-center mb-4 text-red-500">
          <ShieldAlert size={50} />
        </div>
        <h1 className="text-2xl font-bold text-red-500 mb-2">
          Truy cập bị từ chối
        </h1>
        <p className="text-black mb-6">
          Bạn không có quyền truy cập trang này. Vui lòng đăng nhập với tài
          khoản quản trị được cấp.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-red-500/90 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition"
        >
          Đăng nhập lại
        </button>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
