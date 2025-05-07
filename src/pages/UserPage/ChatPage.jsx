import React, { useLayoutEffect } from "react";
import { useState, useEffect, useRef } from "react";
import {
  Send,
  Phone,
  Video,
  Image,
  Paperclip,
  Smile,
  MoreHorizontal,
  Search,
  Mic,
} from "lucide-react";
import LayoutSocial from "../../components/LayoutSocial";
import { Client } from "@stomp/stompjs";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import SideBarChat from "@/components/Chat/SideBarChat";
import MessageChat from "@/components/Chat/MessageChat";
import InputMessage from "@/components/Chat/InputMessage";

const ChatPage = () => {
  const { userId } = useParams();
  const [messageText, setMessageText] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const stompRef = useRef(null);
  const accessToken = localStorage.getItem("accessToken");
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
  const [messageApi, contextHolder] = message.useMessage();

  const [selectConversation, setSelectConversation] = useState(null);
  const [isScrollBottom, setIsScrollBottom] = useState(false);
  const [isTop, setIsTop] = useState(false);
  const containerRef = useRef(null);

  const [page, setPage] = useState(1);
  const limit = 7;
  const [hasMore, setHasMore] = useState(true);

  const messagesRef = useRef(null);
  const messageEndRef = useRef(null);

  const navigate = useNavigate();

  //fetch select conversation
  const fetchSelectConversations = async () => {
    try {
      const res = await fetchWithAuth(
        `http://localhost:8080/conversations?userId=${userId}`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        const conversation = response.data;
        setSelectConversation(conversation);
      }
    } catch (error) {
      console.log("Có lỗi khi gọi api: ", error);
      message.error({
        content: "Lỗi khi lấy danh sách bài viết: " + error,
        duration: 3,
      });
    }
  };

  //fetch list conversation
  const fetchOldMessages = async () => {
    try {
      const res = await fetchWithAuth(
        `http://localhost:8080/conversations/old-message?page=${page}&limit=${limit}&userId=${userId}`,
        { method: "GET" }
      );
      const response = await res.json();

      if (response.status === "success") {
        const container = messagesRef.current;
        const previousScrollHeight = container?.scrollHeight ?? 0;

        const messages = response.data.listResults;
        setChatMessages((prev) => [...messages, ...prev]);

        if (response.data.totalPage <= page) {
          setHasMore(false);
        } else {
          setPage(page + 1);
        }

        setTimeout(() => {
          if (container) {
            container.scrollTop = container.scrollHeight - previousScrollHeight;
          }
        }, 0);
      }
    } catch (error) {
      messageApi.error({
        content: "Lỗi khi lấy danh sách tin nhắn: " + error,
        duration: 3,
      });
    }
  };

  //check scroll
  const handleScroll = () => {
    const div = containerRef.current;
    if (!div) return;

    if (div.scrollTop <= 10) {
      setIsTop(true);
    } else {
      setIsTop(false);
    }
  };

  //loading data
  const handleLoadMore = async () => {
    console.log("has more: ", hasMore);
    fetchOldMessages();
  };

  // scroll bottom
  useEffect(() => {
    if (isScrollBottom) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setIsScrollBottom(false);
    }
  }, [isScrollBottom]);

  useLayoutEffect(() => {
    fetchSelectConversations();
  }, [userId]);

  useLayoutEffect(() => {
    setChatMessages([]);

    setPage(1);
    setHasMore(true);
    navigate(`/social/chat/${selectConversation?.userId}`);
    fetchOldMessages();
    setIsScrollBottom(true);
  }, [selectConversation]);

  //web socket
  useEffect(() => {
    if (!selectConversation) return;

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("WebSocket in chat connected");

        client.subscribe(`/topic/chat/${selectConversation.id}`, (message) => {
          const newMessage = JSON.parse(message.body);
          console.log("mesage: ", newMessage);
          // setChatMessages((prev) => [...prev, newMessage]);
          handleIncomingMessage(newMessage);
          setIsScrollBottom(true);
        });
      },
      onStompError: (frame) => {
        console.error("Broker error: " + frame.headers["message"]);
        console.error("Details: " + frame.body);
      },
    });

    stompRef.current = client;
    client.activate();

    return () => {
      client.deactivate();
      stompRef.current = null;
    };
  }, [selectConversation]);

  const handleIncomingMessage = (message) => {
    if (message.conversationId !== selectConversation.id) {
      // Người B nhắn khi đang nhắn với người A
      showNotification(message, selectConversation);
    } else {
      setChatMessages((prev) => [...prev, message]);
    }
  };

  //show notification when chat another conversation
  const showNotification = (message, selectConversation) => {
    // Hiển thị thông báo UI
    messageApi.info({
      content: `Tin nhắn mới từ ${
        selectConversation.firstName + " " + selectConversation.lastName
      }: ${message.content}`,
    });
  };

  const handleSendMessage = () => {
    if (!messageText) return;

    const payload = {
      conversationId: selectConversation.id,
      senderId: userLogin.userId,
      content: messageText,
      type: 0,
    };

    const stompClient = stompRef.current;

    if (!stompClient || !stompClient.connected) {
      console.warn("Chưa kết nối STOMP WebSocket.");
      return;
    }

    stompClient.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(payload),
    });
    setMessageText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <LayoutSocial>
      {contextHolder}
      <div className="flex h-screen pt-13">
        {/* Sidebar danh sách chat */}
        <SideBarChat
          selectConversation={selectConversation}
          setSelectConversation={setSelectConversation}
        />

        {/* Khung chat chính */}
        <div className="flex-1 flex flex-col">
          {/* Header chat */}
          <div className="bg-black/80 p-4 flex items-center justify-between border-b border-white text-white">
            <div className="flex items-center">
              <div className="relative">
                <img
                  src={selectConversation?.avatar || "/defaultavt.png"}
                  className="w-10 h-10 rounded-full"
                />
              </div>
              <div className="ml-3">
                <h2 className="font-semibold">
                  {selectConversation?.firstName +
                    " " +
                    selectConversation?.lastName}
                </h2>
              </div>
            </div>

            <div className="flex space-x-4">
              <button className="text-white hover:bg-gray-100 p-2 rounded-full">
                <Phone size={20} />
              </button>
              <button className="text-white hover:bg-gray-100 p-2 rounded-full">
                <Video size={20} />
              </button>
              <button className="text-white hover:bg-gray-100 p-2 rounded-full">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>

          {/* Vùng hiển thị tin nhắn */}
          <div
            className="flex-1 overflow-y-auto custom-scroll-bar p-4 bg-black/90"
            ref={containerRef}
            onScroll={handleScroll}
          >
            <div className="space-y-4">
              {isTop && hasMore && chatMessages.length !== 0 ? (
                <div
                  onClick={handleLoadMore}
                  className="text-white/70 text-sm hover:text-white underline flex justify-center mb-4 hover:cursor-pointer"
                >
                  <div> Xem thêm tin nhắn </div>
                </div>
              ) : null}
              {chatMessages.length === 0 && (
                <div className="my-10 flex justify-center text-white/70">
                  Hãy trò chuyện với bạn bè ngay nào!
                </div>
              )}
              {chatMessages.map((message) => (
                <MessageChat
                  message={message}
                  selectConversation={selectConversation}
                />
              ))}
              <div ref={messageEndRef} />
            </div>
          </div>

          {/* Footer nhập tin nhắn */}
          <InputMessage
            messageText={messageText}
            setMessageText={setMessageText}
            handleKeyPress={handleKeyPress}
            handleSendMessage={handleSendMessage}
            selectConversation={selectConversation}
            stompRef={stompRef}
          />
        </div>
      </div>
    </LayoutSocial>
  );
};

export default ChatPage;
