import React from "react";

const Dashboard = () => {
  return (
    // <div>
    //   <div className="text-white h-full overflow-hidden">
    //     <div className="flex justify-center">
    //       <img src="/logo.png" className="opacity-10 h-[600px]" />
    //     </div>
    //   </div>
    // </div>
    <div className="flex flex-col items-center justify-center px-4 py-8">
      <img src={"/logo.png"} alt={""} className="h-60 opacity-80 mb-6" />
      <h1
        className="text-4xl font-bold text-gray-800 mb-4"
        style={{ fontFamily: "MyCustomFont" }}
      >
        {"Thép Xanh Nam Định"}
      </h1>
      <p className="text-gray-600 text-justify max-w-xl mb-4">
        Câu lạc bộ bóng đá Thép Xanh Nam Định là một câu lạc bộ bóng đá chuyên
        nghiệp ở Việt Nam có trụ sở tại thành phố Nam Định, tỉnh Nam Định. Câu
        lạc bộ hiện đang là đương kim vô địch V.League 1 với chức vô địch mùa
        giải 2023-24. Được xem là một trong những câu lạc bộ bóng đá có lịch sử
        lâu đời tại Việt Nam, trong quá khứ đội bóng từng 1 lần giành ngôi vô
        địch Giải vô địch bóng đá Việt Nam năm 1985 với thành tích bất bại toàn
        mùa giải với danh xưng Công nghiệp Hà Nam Ninh.
      </p>
      <p className="text-black text-xl">
        🏟️ Sân vận động: <span className="font-medium">{"Thiên trường"}</span>
      </p>
    </div>
  );
};

export default Dashboard;
