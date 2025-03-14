import React from "react";
import Layout from "../Layout";
import NewsList from "./NewsList";

const NewsDetail = () => {
  return (
    <>
      <Layout>
        <div>
          <img
            src="/banner3.jpg"
            alt="ảnh"
            className="w-[100%] h-200 object-cover"
          />
          <div className="ml-[20%] mr-[20%] mt-5 mb-10">
            <div className="text-5xl font-bold mb-10">
              CLB Nam Định ký hợp đồng với tuyển thủ Việt Nam
            </div>
            <p className="text-lg text-justify">
              Theo nguồn tin của Báo điện tử VTC News, tiền đạo Lâm Ti Phông là
              tân binh tiếp theo của CLB Nam Định trong mùa giải 2024/25. Anh
              chuyển đến đội đương kim vô địch V.League từ CLB Thanh Hóa. Lâm Ti
              Phông nhận được giấy thanh lý hợp đồng đúng vào ngày cuối cùng của
              kì chuyển nhượng.
              <br /> <br /> Trận đấu tại cúp Quốc gia gặp CLB Hải Phòng là lần
              cuối cùng tiền đạo sinh năm 1996 ra sân cho CLB Thanh Hóa. Sau
              trận đấu, HLV Velizar Popov cũng nói lời chia tay đội bóng trong
              sự nuối tiếc của người hâm mộ đội bóng xứ Thanh. CLB Thanh Hóa
              trải qua chuỗi 10 trận không thắng, bị loại khỏi 2 đấu trường cúp
              Quốc gia và cúp vô địch Đông Nam Á.
            </p>
            <div></div>
          </div>
          <div className="m-15">
            <NewsList title={"Tin tức mới nhất"} />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default NewsDetail;
