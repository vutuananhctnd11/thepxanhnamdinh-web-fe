/* eslint-disable no-unused-vars */
import Layout from "@/components/Layout";
import TicketOfMatch from "@/components/OrderTicket/TicketOfMatch";
import React, { useEffect, useState } from "react";

const OrderTicket = () => {
  const [listMatches, setListMatches] = useState([]);

  useEffect(() => {
    const fetchMatchInfo = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/matches/top3-matches-nearest`,
          {
            method: "GET",
          }
        );
        const response = await res.json();
        if (response.status === "success") {
          setListMatches(response.data);
        } else {
          console.log("Thất bại: " + response.message);
        }
      } catch (error) {
        console.log("Có lỗi khi gọi api get match info: ", error);
      }
    };

    fetchMatchInfo();
  }, []);
  return (
    <Layout>
      <div className="w-full h-[300px] relative overflow-hidden lg:h-[500px]">
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
        {listMatches?.map((item) => (
          <div key={item.matchId} className="">
            <TicketOfMatch data={item} />
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default OrderTicket;
