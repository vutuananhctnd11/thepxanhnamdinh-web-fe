import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";

const SideBarChat = ({ selectConversation, setSelectConversation }) => {
  const [listConversation, setListConversation] = useState([]);
  //fetch list conversation
  const fetchConversations = async () => {
    try {
      const res = await fetchWithAuth(
        "http://localhost:8080/conversations/list",
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        const conversations = response.data;
        setListConversation(conversations);
      }
    } catch (error) {
      console.log("Có lỗi khi gọi api: ", error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="w-80 bg-black/80 border-r border-white flex flex-col text-white">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-500 drop-shadow-[0_5px_10px_rgba(255,255,255,0.4)]">
          TXND FanZone Chat
        </h1>
      </div>

      <div className="p-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-white" />
          </div>
          <input
            type="text"
            className="bg-white/10 pl-10 pr-4 py-2 rounded-full w-full focus:outline-none"
            placeholder="Tìm kiếm trong tin nhắn"
          />
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        {listConversation.map((conversation) => (
          <div
            key={conversation.id}
            className={`flex items-center p-3 hover:bg-white/10 cursor-pointer ${
              selectConversation?.id === conversation.id ? "bg-white/35" : ""
            }`}
            onClick={() => setSelectConversation(conversation)}
          >
            <div className="relative">
              <img
                src={conversation.avatar || "/defaultavt.png"}
                className="w-12 h-12 rounded-full"
              />
            </div>
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-white">
                  {conversation.firstName + " " + conversation.lastName}
                </h3>
              </div>
              <div className="flex justify-between items-center space-y-1">
                <p className="text-sm text-white/90 truncate">
                  {conversation.lastMessage}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBarChat;
