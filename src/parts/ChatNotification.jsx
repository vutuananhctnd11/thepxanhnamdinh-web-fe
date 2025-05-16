import VideoCall from "@/components/Chat/VideoCall";
import { Client } from "@stomp/stompjs";
import { message } from "antd";
import React, { useEffect, useRef, useState } from "react";

const ChatNotification = () => {
  const stompRef = useRef(null);
  const accessToken = localStorage.getItem("accessToken");
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
  const [messageApi, contextHolder] = message.useMessage();

  const [inCall, setInCall] = useState(false);
  const [channelName, setChannelName] = useState(null);
  const [callingUser, setCallingUser] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);

  //web socket
  useEffect(() => {
    const client = new Client({
      brokerURL: `${import.meta.env.VITE_WS_URL}`,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("WebSocket notification in chat connected");

        // Subscribe tin nhắn chat
        client.subscribe("/user/queue/chat", (message) => {
          const msg = JSON.parse(message.body);
          showNotification(msg);
        });

        // Subscribe sự kiện gọi video
        client.subscribe("/user/queue/call", (message) => {
          const callData = JSON.parse(message.body);
          //   console.log("📞 Call event:", callData);
          handleCallEvent(callData);
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
  }, []);

  //show notification when chat another conversation
  const showNotification = (message) => {
    const pathRegex = /^\/social\/chat\/\d+$/;
    if (pathRegex.test(window.location.pathname)) {
      return null;
    }
    if (message.senderId !== userLogin.userId) {
      if (message.type === 0) {
        messageApi.info({
          content: `${message.senderFullName} đã gửi một tin nhắn: ${message.content}`,
          duration: 3,
        });
      } else {
        messageApi.info({
          content: `${message.senderFullName} đã gửi một ảnh`,
          duration: 3,
        });
      }
    }
  };

  const handleCallEvent = (data) => {
    switch (data.type) {
      case "CALL_OFFER":
        console.log("CALL_OFFER received:", data);
        setIncomingCall(data);
        break;
      case "CALL_ACCEPT":
        console.log("CALL_ACCEPT channel:", data.channel);
        setChannelName(data.channel);
        setInCall(true);
        setCallingUser(data.fromUserId);
        break;
      case "CALL_REJECT":
        messageApi.error({
          content: `${data.fromName} đã từ chối cuộc gọi của bạn!`,
          duration: 3,
        });
        setCallingUser(null);
        break;
      case "CALL_END":
        handleLeaveCall();
        break;
      default:
        console.warn("Unknown call event", data);
        break;
    }
  };

  const handleLeaveCall = () => {
    const stompClient = stompRef.current;
    if (!stompRef.current || !callingUser) {
      setInCall(false);
      setChannelName(null);
      setCallingUser(null);
      return;
    }

    stompClient.publish({
      destination: "/app/call",
      body: JSON.stringify({
        type: "CALL_END",
        fromUserId: userLogin.userId,
        fromName: userLogin.firstName + " " + userLogin.lastName,
        toUserId: callingUser,
      }),
    });

    setInCall(false);
    setChannelName(null);
    setCallingUser(null);
  };

  const acceptCall = () => {
    const stompClient = stompRef.current;
    if (!stompClient || !incomingCall) {
      messageApi.error({
        content: "Lỗi kết nối, không thể chấp nhận cuộc gọi",
      });
      return;
    }

    stompClient.publish({
      destination: "/app/call",
      body: JSON.stringify({
        type: "CALL_ACCEPT",
        fromUserId: userLogin.userId,
        fromName: userLogin.firstName + " " + userLogin.lastName,
        toUserId: incomingCall.fromUserId,
        channel: incomingCall.channel,
      }),
    });
    console.log(
      " CALL MESSAGE: ",
      JSON.stringify({
        type: "CALL_ACCEPT",
        fromUserId: userLogin.userId,
        fromName: userLogin.firstName + " " + userLogin.lastName,
        toUserId: incomingCall.fromUserId,
        channel: incomingCall.channel,
      })
    );

    setChannelName(incomingCall.channel);
    setCallingUser(incomingCall.fromUserId);
    setInCall(true);
    setIncomingCall(null);
  };

  const rejectCall = () => {
    const stompClient = stompRef.current;
    if (!stompClient || !incomingCall) {
      setIncomingCall(null);
      return;
    }

    stompClient.publish({
      destination: "/app/call",
      body: JSON.stringify({
        type: "CALL_REJECT",
        fromUserId: userLogin.userId,
        fromName: userLogin.firstName + " " + userLogin.lastName,
        toUserId: incomingCall.fromUserId,
      }),
    });

    setIncomingCall(null);
  };

  return (
    <div>
      {contextHolder}

      {inCall && channelName && (
        <VideoCall
          appId={import.meta.env.VITE_AGORA_APP_ID}
          channel={channelName}
          uid={userLogin.userId}
          onLeave={handleLeaveCall}
        />
      )}

      {incomingCall && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white/90 rounded-lg p-6 shadow-lg w-80">
            <div className="text-center mb-4">
              <h3 className="text-lg text-black font-semibold mb-2">
                Cuộc gọi đến
              </h3>
              <p className="text-black">
                {incomingCall.fromName || "Ai đó"} đang gọi cho bạn
              </p>
            </div>
            <div className="flex justify-between space-x-4">
              <button
                onClick={rejectCall}
                className="flex-1 bg-red-500 text-white py-1 rounded-lg hover:bg-red-600 transition-colors"
              >
                Từ chối
              </button>
              <button
                onClick={acceptCall}
                className="flex-1 bg-green-500 text-white py-1 rounded-lg hover:bg-green-600 transition-colors"
              >
                Chấp nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatNotification;
