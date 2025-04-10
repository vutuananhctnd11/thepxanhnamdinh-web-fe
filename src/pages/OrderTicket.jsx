import Layout from "@/components/Layout";
import TicketOfMatch from "@/components/OrderTicket/TicketOfMatch";
import React from "react";

const OrderTicket = () => {
  const mock = [
    {
      title: "Vòng 12 -Vleague 2024/2025",
      homeImg: "/logo.png",
      homeName: "Thép Xanh Nam Định",
      awayImg: "viettel.png",
      awayName: "Thể Công Viettel",
      time: "19:30",
      date: "06/04/2025",
      location: "SVĐ Thiên Trường",
      status: "comming",
    },
    {
      title: "Vòng 12 -Vleague 2024/2025",
      homeImg: "/logo.png",
      homeName: "Thép Xanh Nam Định",
      awayImg: "viettel.png",
      awayName: "Thể Công Viettel",
      time: "19:30",
      date: "06/04/2025",
      location: "SVĐ Thiên Trường",
      status: "selling",
    },
    {
      title: "Vòng 12 -Vleague 2024/2025",
      homeImg: "/logo.png",
      homeName: "Thép Xanh Nam Định",
      awayImg: "viettel.png",
      awayName: "Thể Công Viettel",
      time: "19:30",
      date: "06/04/2025",
      location: "SVĐ Thiên Trường",
      status: "done",
    },
  ];
  return (
    <Layout>
      <div className="w-screen h-[300px] relative overflow-hidden lg:h-[500px]">
        <img
          src="/bgticket.png"
          className=" absolute scale-110 object-center"
        />
        <div className="bg-black/50 w-full h-full bg-no-repeat absolute z-5" />
        <img
          src="/bgticket.png"
          className=" w-[80%] h-[450px] absolute z-10 inset-0 m-auto object-contain"
        />
      </div>
      <div className="w-full flex flex-wrap gap-8 justify-around my-5 px-15">
        {mock.map((item, index) => (
          <div key={index} className="">
            <TicketOfMatch data={item} />
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default OrderTicket;
