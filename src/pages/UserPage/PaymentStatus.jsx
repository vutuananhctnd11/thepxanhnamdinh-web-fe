import useNagivateLoading from "@/hooks/useNagivateLoading";
import React from "react";
import { useLocation } from "react-router-dom";

const PaymentStatus = () => {
  const navigate = useNagivateLoading();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const success = query.get("success");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 text-center relative">
      <img src="/logo.png" className="absolute opacity-8 h-[90%]" />
      {success == "true" ? (
        <h1 className="text-4xl font-extrabold text-green-500 uppercase mb-4">
          Thanh toán thành công!
        </h1>
      ) : (
        <h1 className="text-4xl font-extrabold text-red-500 uppercase mb-4">
          Thanh toán thất bại!
        </h1>
      )}
      <div className="text-xl text-gray-700 space-y-3">
        <div>
          Vé đã được gửi về email của bạn! Cảm ơn bạn đã sử dụng dịch vụ.
        </div>
        <div>Đội ngũ TXND FanZone</div>
      </div>
      <div className="mt-15 z-10 space-x-20">
        <button
          className="px-6 py-2 rounded-xl text-white shadow-lg transition-all bg-blue-500 hover:bg-blue-700"
          onClick={() => navigate("/home-cub")}
        >
          Trang chủ CLB
        </button>
        <button
          className="px-6 py-2 rounded-xl text-white shadow-lg transition-all bg-blue-500 hover:bg-blue-700"
          onClick={() => navigate("/order-ticket")}
        >
          Tiếp tục mua vé
        </button>
      </div>
    </div>
  );
};

export default PaymentStatus;
