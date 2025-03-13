import React from "react";

const Footer = () => {
  return (
    <div className="bg-[url('/public/bgblue.jpg')] text-white w-[100%] h-[400px] bg-cover bg-no-repeat">
      <div className="flex">
        <div className="w-[30%] flex flex-col ml-15 mt-5 mr-10 space-y-3">
          <img src="/public/logo.png" className="h-30 w-30 ml-15" />
          <p className="font-bold">Câu lạc bộ bóng đá Thép Xanh Nam Định</p>
          <p className="text-justify">
            Trụ sở chính: Khán đài A SVĐ Thiên Trường, Đường Đặng Xuân Thiều,
            Phường Vị Hoàng, Thành phố Nam Định, Việt Nam{" "}
          </p>
          <p className="">Email: vutuananhctnd117@gmail.com</p>
          <p className="">Hotline: 0326.095.000</p>
        </div>
        <div className="w-[30%] mt-15 space-y-3 pl-10">
          <div className="hover:scale-105 transition-transform duration-400 cursor-pointer">
            Về chúng tôi
          </div>
          <div className="hover:scale-105 transition-transform duration-400 cursor-pointer">
            Tin tức mới
          </div>
          <div className="hover:scale-105 transition-transform duration-400 cursor-pointer">
            Mua vé trận tiếp theo
          </div>
          <div className="hover:scale-105 transition-transform duration-400 cursor-pointer">
            Hội cổ động viên
          </div>
          <div className="hover:scale-105 transition-transform duration-400 cursor-pointer">
            Câu hỏi thường gặp
          </div>
          <div className="hover:scale-105 transition-transform duration-400 cursor-pointer">
            Liên hệ hỗ trợ
          </div>
        </div>
        <div className="w-[40%] mt-15 space-y-3">
          <p className="font-bold">
            Hào khí Đông A! Hành trình bảo vệ ngôi vương!
          </p>
          <p>Hãy theo dõi CLB để cập nhật những thông tin mới nhất!</p>
          <div className="flex gap-5">
            <img src="/public/fb.png" className="h-8 hover:scale-105" />
            <img src="/public/ytb.png" className="h-8 w-10 hover:scale-105" />
            <img src="/public/insta.png" className="h-8 hover:scale-105" />
            <img src="/public/tiktok.png" className="h-8 hover:scale-105" />
          </div>
        </div>
      </div>
      <div className="pt-8 w-full flex justify-center">
        © 2025 Thép Xanh Nam Định bởi TuanAnhDev
      </div>
    </div>
  );
};

export default Footer;
