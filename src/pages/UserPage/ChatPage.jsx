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
  const { conversationId } = useParams();
  const [messageText, setMessageText] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);

  const stompRef = useRef(null);
  const accessToken = localStorage.getItem("accessToken");
  const [messageApi, contextHolder] = message.useMessage();

  const [selectConversation, setSelectConversation] = useState(null);
  const [isScrollBottom, setIsScrollBottom] = useState(false);
  const [isTop, setIsTop] = useState(false);
  const containerRef = useRef(null);

  const [page, setPage] = useState(1);
  const limit = 10;
  const [hasMore, setHasMore] = useState(true);

  const messagesRef = useRef(null);
  const messageEndRef = useRef(null);
  const navigate = useNavigate();

  const [replyingMessage, setReplyingMessage] = useState(null);

  //fetch select conversation
  const fetchSelectConversations = async () => {
    try {
      const res = await fetchWithAuth(
        `http://localhost:8080/conversations?conversationId=${conversationId}`,
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

  //fetch old message of conversation
  const fetchOldMessages = async (page, conversationId) => {
    try {
      const res = await fetchWithAuth(
        `http://localhost:8080/conversations/old-message?page=${page}&limit=${limit}&conversationId=${conversationId}`,
        { method: "GET" }
      );
      const response = await res.json();

      if (response.status === "success") {
        const container = messagesRef.current;
        const previousScrollHeight = container?.scrollHeight ?? 0;

        const messages = response.data.listResults;
        setChatMessages((prev) => [...messages, ...prev]);
        if (page === 1) setIsScrollBottom(true);

        if (response.data.totalPage <= page) {
          setHasMore(false);
        } else {
          setPage((prev) => prev + 1);
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

  //check scroll to top
  const handleScroll = () => {
    const div = containerRef.current;
    if (!div) return;

    if (div.scrollTop <= 10) {
      setIsTop(true);
    } else {
      setIsTop(false);
    }
  };

  //loading more data
  const handleLoadMore = async () => {
    console.log("has more: ", hasMore);
    fetchOldMessages(page, conversationId);
  };

  // scroll bottom
  useEffect(() => {
    if (isScrollBottom) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setIsScrollBottom(false);
    }
  }, [isScrollBottom]);

  useEffect(() => {
    fetchSelectConversations();
  }, []);

  useLayoutEffect(() => {
    setIsScrollBottom(true);
    setChatMessages([]);
    setPage(1);
    setHasMore(true);
    selectConversation?.userId &&
      navigate(`/social/chat/${selectConversation?.id}`);
    fetchOldMessages(1, selectConversation?.id);
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

        client.subscribe("/user/queue/chat", (message) => {
          const msg = JSON.parse(message.body);
          handleIncomingMessage(msg);
          setIsScrollBottom(true);
        });
      },
      onStompError: (frame) => {
        console.error("Broker error: " + frame.headers["message"]);
        console.error("Details: " + frame.body);
        messageApi.error({
          content: "Kết nối thất bại: " + frame.headers["message"],
          duration: 2,
        });
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
      showNotification(message, selectConversation);
    } else {
      setChatMessages((prev) => [...prev, message]);
    }
    setLastMessage(message);
  };

  //show notification when chat another conversation
  const showNotification = (message, selectConversation) => {
    messageApi.info({
      content: `Tin nhắn mới từ ${
        selectConversation.firstName + " " + selectConversation.lastName
      }: ${message.content}`,
    });
  };

  return (
    <LayoutSocial>
      {contextHolder}
      <div className="flex h-screen pt-13">
        {/* Sidebar danh sách chat */}
        <SideBarChat
          selectConversation={selectConversation}
          setSelectConversation={setSelectConversation}
          message={lastMessage}
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
                  setReplyingMessage={setReplyingMessage}
                />
              ))}
              <div ref={messageEndRef} />
            </div>
          </div>

          {/* Footer nhập tin nhắn */}
          <InputMessage
            messageText={messageText}
            setMessageText={setMessageText}
            selectConversation={selectConversation}
            stompRef={stompRef}
            replyingMessage={replyingMessage}
            setReplyingMessage={setReplyingMessage}
          />
        </div>
      </div>
    </LayoutSocial>
  );
};

export default ChatPage;
