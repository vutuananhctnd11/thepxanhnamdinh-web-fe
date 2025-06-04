import useNagivateLoading from "@/hooks/useNagivateLoading";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { Spin } from "antd";
import React, { useEffect, useState } from "react";

const PaymentStatus = () => {
  const navigate = useNagivateLoading();
  const [status, setStatus] = useState("");

  useEffect(() => {
    const checkPayment = async () => {
      const query = window.location.search;
      try {
        const res = await fetchWithAuth(
          `${import.meta.env.VITE_API_URL}/vnpay/payment-info${query}`,
          {
            method: "GET",
            header: {
              Accept: "application/json",
            },
          }
        );
        const response = await res.json();
        if (response.status == "success") {
          setStatus("success");
        } else {
          setStatus("error");
        }
        console.log("Kết quả thanh toán: ", response);
      } catch (error) {
        console.log("ERROR: ", error);
      }
    };

    checkPayment();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 text-center relative">
      <img src="/logo.png" className="absolute opacity-8 h-[90%]" />

      {status === "" && (
        <div>
          <Spin></Spin>
          <h1 className="text-4xl font-extrabold text-blue-500 uppercase mb-4">
            Đang xử lý thanh toán...
          </h1>
        </div>
      )}
      {status === "success" && (
        <h1 className="text-4xl font-extrabold text-green-500 uppercase mb-4">
          Thanh toán thành công!
        </h1>
      )}
      {status === "error" && (
        <h1 className="text-4xl font-extrabold text-red-500 uppercase mb-4">
          Thanh toán thất bại!
        </h1>
      )}

      <div className="text-xl text-gray-700 space-y-5">
        {status === "success" ? (
          <div>
            Vé đã được gửi về email của bạn! Cảm ơn bạn đã sử dụng dịch vụ.{" "}
            <br />
            Vui lòng xuất trình vé điện tử khi đến sân!
          </div>
        ) : status === "error" ? (
          <div>Vui lòng kiểm tra lại thông tin thanh toán của bạn!</div>
        ) : (
          <div>
            Vui lòng chờ trong giây lát, hệ thống đang xử lý thanh toán...
          </div>
        )}
        <div className="text-[15px]">Đội ngũ TXND FanZone</div>
      </div>

      <div className="mt-10 z-10 space-x-20">
        <button
          className="px-6 py-2 rounded-xl text-white shadow-lg transition-all bg-blue-500 hover:bg-blue-700"
          onClick={() => navigate("/home-club")}
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
