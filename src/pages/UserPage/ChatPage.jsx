import React, { useLayoutEffect } from "react";
import { useState, useEffect, useRef } from "react";
import { Video, MoreHorizontal } from "lucide-react";
import LayoutSocial from "../../components/LayoutSocial";
import { Client } from "@stomp/stompjs";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import SideBarChat from "@/components/Chat/SideBarChat";
import MessageChat from "@/components/Chat/MessageChat";
import InputMessage from "@/components/Chat/InputMessage";
import VideoCall from "@/components/Chat/VideoCall";

const ChatPage = () => {
  const { conversationId } = useParams();
  const [messageText, setMessageText] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);

  const stompRef = useRef(null);
  const accessToken = localStorage.getItem("accessToken");
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
  const [messageApi, contextHolder] = message.useMessage();

  const [selectConversation, setSelectConversation] = useState(null);
  const [isScrollBottom, setIsScrollBottom] = useState(false);
  const [isTop, setIsTop] = useState(false);
  const containerRef = useRef(null);

  const [page, setPage] = useState(1);
  const limit = 10;
  const [hasMore, setHasMore] = useState(true);

  const messageEndRef = useRef(null);
  const navigate = useNavigate();

  const [replyingMessage, setReplyingMessage] = useState(null);

  //fetch select conversation
  const fetchSelectConversations = async () => {
    try {
      const res = await fetchWithAuth(
        `${
          import.meta.env.VITE_API_URL
        }/conversations?conversationId=${conversationId}`,
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
        `${
          import.meta.env.VITE_API_URL
        }/conversations/old-message?page=${page}&limit=${limit}&conversationId=${conversationId}`,
        { method: "GET" }
      );
      const response = await res.json();

      if (response.status === "success") {
        const messages = response.data.listResults;
        setChatMessages((prev) => [...messages, ...prev]);
        if (page === 1) setIsScrollBottom(true);

        if (response.data.totalPage <= page) {
          setHasMore(false);
        } else {
          setPage((prev) => prev + 1);
        }
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

    if (div.scrollTop <= 20) {
      setIsTop(true);
    } else {
      setIsTop(false);
    }
  };

  //loading more data
  const handleLoadMore = async () => {
    const div = containerRef.current;
    if (!div) return;

    const previousScrollHeight = div.scrollHeight;

    await fetchOldMessages(page, conversationId);

    setTimeout(() => {
      if (div) {
        const newScrollHeight = div.scrollHeight;
        div.scrollTop = newScrollHeight - previousScrollHeight;
      }
    }, 0);
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
  }, [conversationId]);

  useLayoutEffect(() => {
    if (!selectConversation?.id) return;

    setIsScrollBottom(true);
    setChatMessages([]);
    setPage(1);
    setHasMore(true);
    navigate(`/social/chat/${selectConversation?.id}`);
    fetchOldMessages(1, selectConversation?.id);
  }, [selectConversation]);

  useEffect(() => {
    const client = new Client({
      brokerURL: `${import.meta.env.VITE_WS_URL}`,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("WebSocket in chat connected ✅");

        // Subscribe tin nhắn chat
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
      showNotification(message);
    } else {
      setChatMessages((prev) => [...prev, message]);
    }
    setLastMessage(message);
  };

  //show notification when chat another conversation
  const showNotification = (message) => {
    if (message.type === 0) {
      messageApi.info({
        content: `${message.senderFullName} đã gửi một tin nhắn: ${message.content}`,
      });
    } else {
      messageApi.info({
        content: `${message.senderFullName} đã gửi một ảnh/video`,
      });
    }
  };

  const initiateCall = () => {
    if (!selectConversation) return;

    const stompClient = stompRef.current;
    if (!stompClient) {
      messageApi.error({ content: "Lỗi kết nối, vui lòng thử lại sau" });
      return;
    }

    const channel = `call_${userLogin.userId}_${selectConversation.userId}`;

    stompClient.publish({
      destination: "/app/call",
      body: JSON.stringify({
        type: "CALL_OFFER",
        fromUserId: userLogin.userId,
        fromName: userLogin.firstName + " " + userLogin.lastName,
        toUserId: selectConversation.userId,
        channel: channel,
      }),
    });

    messageApi.info({
      content:
        "Đang gọi đến " +
        selectConversation?.firstName +
        " " +
        selectConversation?.lastName,
      duration: 4,
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
              <button
                className="text-white hover:bg-white/30 p-2 rounded-full transition-colors"
                onClick={initiateCall}
                disabled={!selectConversation}
              >
                <Video size={20} />
              </button>
              <button className="text-white hover:bg-white/30 p-2 rounded-full transition-colors">
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
                  key={message.id || message.timestamp}
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
