/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 8,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 6,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 4,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
  },
};

const Squad = ({ setPlayerId }) => {
  const [striker, setStriker] = useState(null);
  const [midfielder, setMidfielder] = useState(null);
  const [defender, setDefender] = useState(null);
  const [goalkeeper, setGoalkeeper] = useState(null);
  const [substitute, setSubstitute] = useState(null);

  useEffect(() => {
    const fetchSquadApi = async () => {
      try {
        const res = await fetch("http://localhost:8080/players/squad", {
          method: "GET",
        });
        const response = await res.json();

        if (response.status === "success") {
          setStriker(response.data.strikerPlayers);
          setMidfielder(response.data.midfielderPlayers);
          setDefender(response.data.defenderPlayers);
          setGoalkeeper(response.data.goalkeeperPlayer);
          setSubstitute(response.data.substitutePlayers);
        } else alert("ERROR: " + response.message);
      } catch (error) {
        console.log("Có lỗi khi gọi api:" + error);
      }
    };

    fetchSquadApi();
  }, []);

  return (
    <div className="w-[65%] h-full scale-95 text-[14px] relative">
      <div className="h-[86%] w-full">
        <img
          src="/sanco.png"
          className="h-[80%] w-full z-5 mt-20 pb-7 opacity-90 absolute drop-shadow-[0px_0px_30px_rgba(0,0,0,0.8)]"
        />

        {/* Thủ môn */}
        <div
          className="h-25 w-30 z-10 absolute bottom-0 left-1/2 top-2/3 -translate-x-1/2 
                                hover:scale-110 transition-transform duration-400 cursor-pointer"
          onClick={() => setPlayerId(goalkeeper[0].playerId)}
        >
          <div className="absolute w-6 m-2 flex justify-center text-white rounded-[50%] bg-[#008bd0]/60">
            {goalkeeper && goalkeeper[0].shirtNumber}
          </div>
          <img
            src={goalkeeper && goalkeeper[0].avatarImage}
            className="h-full mx-auto"
          />
          <p className="w-full flex justify-center bg-[#008bd0] text-white rounded-md">
            {goalkeeper && goalkeeper[0].nameInShirt}
          </p>
        </div>

        {/* Hậu vệ cánh trái */}
        <div
          className="h-25 w-30 z-10 absolute left-5/6 top-7/13 -translate-x-1/2 -translate-y-1/2
            hover:scale-110 transition-transform duration-400 cursor-pointer"
          onClick={() => setPlayerId(defender[3].playerId)}
        >
          <div className="absolute w-6 m-2 flex justify-center text-white rounded-[50%] bg-[#008bd0]/60">
            {defender && defender[3].shirtNumber}
          </div>
          <img
            src={defender && defender[3].avatarImage}
            className="h-full mx-auto"
          />
          <p className="w-full flex justify-center bg-[#008bd0] text-white rounded-md">
            {defender && defender[3].nameInShirt}
          </p>
        </div>

        {/* Hậu vệ lệch trái */}
        <div
          className="h-25 w-30 z-10 absolute left-4/11 top-8/13 -translate-x-1/2 -translate-y-1/2
            hover:scale-110 transition-transform duration-400 cursor-pointer"
          onClick={() => setPlayerId(defender[2].playerId)}
        >
          <div className="absolute w-6 m-2 flex justify-center text-white rounded-[50%] bg-[#008bd0]/60">
            {defender && defender[2].shirtNumber}
          </div>
          <img
            src={defender && defender[2].avatarImage}
            className="h-full mx-auto"
          />
          <p className="w-full flex justify-center bg-[#008bd0] text-white rounded-md">
            {defender && defender[2].nameInShirt}
          </p>
        </div>

        {/* Hậu vệ lệch phải */}
        <div
          className="h-25 w-30 z-10 absolute left-7/11 top-8/13 -translate-x-1/2 -translate-y-1/2
            hover:scale-110 transition-transform duration-400 cursor-pointer"
          onClick={() => setPlayerId(defender[1].playerId)}
        >
          <div className="absolute w-6 m-2 flex justify-center text-white rounded-[50%] bg-[#008bd0]/60">
            {defender && defender[1].shirtNumber}
          </div>
          <img
            src={defender && defender[1].avatarImage}
            className="h-full mx-auto"
          />
          <p className="w-full flex justify-center bg-[#008bd0] text-white rounded-md">
            {defender && defender[1].nameInShirt}
          </p>
        </div>

        {/* Hậu vệ cánh phải */}
        <div
          className="h-25 w-30 z-10 absolute left-1/6 top-7/13 -translate-x-1/2 -translate-y-1/2
            hover:scale-110 transition-transform duration-400 cursor-pointer"
          onClick={() => setPlayerId(defender[0].playerId)}
        >
          <div className="absolute w-6 m-2 flex justify-center text-white rounded-[50%] bg-[#008bd0]/60">
            {defender && defender[0].shirtNumber}
          </div>
          <img
            src={defender && defender[0].avatarImage}
            className="h-full mx-auto"
          />
          <p className="w-full flex justify-center bg-[#008bd0] text-white rounded-md">
            {defender && defender[0].nameInShirt}
          </p>
        </div>

        {/* Tiền vệ trung tâm lệch phải */}
        <div
          className="h-25 w-30 z-10 absolute left-7/11 top-5/13 -translate-x-1/2 -translate-y-1/2
            hover:scale-110 transition-transform duration-400 cursor-pointer"
          onClick={() => setPlayerId(midfielder[1].playerId)}
        >
          <div className="absolute w-6 m-2 flex justify-center text-white rounded-[50%] bg-[#008bd0]/60">
            {midfielder && midfielder[1].shirtNumber}
          </div>
          <img
            src={midfielder && midfielder[1].avatarImage}
            className="h-full mx-auto"
          />
          <p className="w-full flex justify-center bg-[#008bd0] text-white rounded-md">
            {midfielder && midfielder[1].nameInShirt}
          </p>
        </div>

        {/* Tiền vệ trung tâm lệch trái */}
        <div
          className="h-25 w-30 z-10 absolute left-4/11 top-5/13 -translate-x-1/2 -translate-y-1/2
            hover:scale-110 transition-transform duration-400 cursor-pointer"
          onClick={() => setPlayerId(midfielder[2].playerId)}
        >
          <div className="absolute w-6 m-2 flex justify-center text-white rounded-[50%] bg-[#008bd0]/60">
            {midfielder && midfielder[2].shirtNumber}
          </div>
          <img
            src={midfielder && midfielder[2].avatarImage}
            className="h-full mx-auto"
          />
          <p className="w-full flex justify-center bg-[#008bd0] text-white rounded-md">
            {midfielder && midfielder[2].nameInShirt}
          </p>
        </div>

        {/* Tiền vệ tấn công */}
        <div
          className="h-25 w-30 z-10 absolute left-1/2 top-4/13 -translate-x-1/2 -translate-y-1/2
            hover:scale-110 transition-transform duration-400 cursor-pointer"
          onClick={() => setPlayerId(midfielder[0].playerId)}
        >
          <div className="absolute w-6 m-2 flex justify-center text-white rounded-[50%] bg-[#008bd0]/60">
            {midfielder && midfielder[0].shirtNumber}
          </div>
          <img
            src={midfielder && midfielder[0].avatarImage}
            className="h-full mx-auto"
          />
          <p className="w-full flex justify-center bg-[#008bd0] text-white rounded-md">
            {midfielder && midfielder[0].nameInShirt}
          </p>
        </div>

        {/* Tiền đạo cánh trái */}
        <div
          className="h-25 w-30 z-10 absolute left-2/7 top-2/11 -translate-x-1/2 -translate-y-1/2
            hover:scale-110 transition-transform duration-400 cursor-pointer"
          onClick={() => setPlayerId(striker[1].playerId)}
        >
          <div className="absolute w-6 m-2 flex justify-center text-white rounded-[50%] bg-[#008bd0]/60">
            {striker && striker[1].shirtNumber}
          </div>
          <img
            src={striker && striker[1].avatarImage}
            className="h-full mx-auto"
          />
          <p className="w-full flex justify-center bg-[#008bd0] text-white rounded-md">
            {striker && striker[1].nameInShirt}
          </p>
        </div>

        {/* Tiền đạo cánh phải */}
        <div
          className="h-25 w-30 z-10 absolute left-5/7 top-2/11 -translate-x-1/2 -translate-y-1/2
            hover:scale-110 transition-transform duration-400 cursor-pointer"
          onClick={() => setPlayerId(striker[2].playerId)}
        >
          <div className="absolute w-6 m-2 flex justify-center text-white rounded-[50%] bg-[#008bd0]/60">
            {striker && striker[2].shirtNumber}
          </div>
          <img
            src={striker && striker[2].avatarImage}
            className="h-full mx-auto"
          />
          <p className="w-full flex justify-center bg-[#008bd0] text-white rounded-md">
            {striker && striker[2].nameInShirt}
          </p>
        </div>

        {/* Tiền đạo chủ lực */}
        <div
          className="h-25 w-30 z-10 absolute inset-0 mx-auto mt-6
            hover:scale-110 transition-transform duration-400 cursor-pointer"
          onClick={() => setPlayerId(striker[0].playerId)}
        >
          <div className="absolute w-6 m-2 flex justify-center text-white rounded-[50%] bg-[#008bd0]/60">
            {striker && striker[0].shirtNumber}
          </div>
          <img
            src={striker && striker[0].avatarImage}
            className="h-full mx-auto"
          />
          <p className="w-full flex justify-center bg-[#008bd0] text-white rounded-md">
            {striker && striker[0].nameInShirt}
          </p>
        </div>
      </div>
      {substitute && (
        <Carousel
          className="h-[22%] w-full space-x-5 flex relative pb-10"
          responsive={responsive}
          renderButtonGroupOutside={true}
        >
          {substitute.map((subPlayer, index) => (
            <div
              key={index}
              onClick={() => setPlayerId(subPlayer.playerId)}
              className="h-25 w-30 items-center hover:scale-110 transition-transform duration-400 cursor-pointer"
            >
              <div className="absolute w-6 my-4 mx-2 flex justify-center text-white rounded-[50%] bg-[#008bd0]/60">
                {subPlayer.shirtNumber}
              </div>
              <img
                src={subPlayer.avatarImage}
                className="h-full mx-auto drop-shadow-[0px_0px_10px_rgba(0,0,0,0.6)]"
              />
              <p className="w-full flex justify-center bg-[#008bd0] text-white rounded-md">
                {subPlayer.nameInShirt}
              </p>
            </div>
          ))}
          {substitute.map((subPlayer, index) => (
            <div
              key={index}
              onClick={() => setPlayerId(subPlayer.playerId)}
              className="h-25 w-30 items-center hover:scale-110 transition-transform duration-400 cursor-pointer"
            >
              <div className="absolute w-6 my-4 mx-2 flex justify-center text-white rounded-[50%] bg-[#008bd0]/60">
                {subPlayer.shirtNumber}
              </div>
              <img
                src={subPlayer.avatarImage}
                className="h-full mx-auto drop-shadow-[0px_0px_10px_rgba(0,0,0,0.6)]"
              />
              <p className="w-full flex justify-center bg-[#008bd0] text-white rounded-md">
                {subPlayer.nameInShirt}
              </p>
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default Squad;
