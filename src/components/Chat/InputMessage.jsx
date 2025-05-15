import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { message, Spin, Upload } from "antd";
import { Image, Mic, ReplyIcon, Send, Smile, X } from "lucide-react";
import React, { useState, useRef } from "react";

const InputMessage = ({
  messageText,
  setMessageText,
  selectConversation,
  stompRef,
  replyingMessage,
  setReplyingMessage,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSendImage = async () => {
    try {
      let content;
      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);

        const fileRes = await fetchWithAuth(
          `${import.meta.env.VITE_API_URL}/cloudinary`,
          {
            method: "POST",
            body: formData,
          }
        );

        const fileResponse = await fileRes.json();
        if (fileRes.status == 200) {
          content = fileResponse.data;
        } else {
          messageApi.error({
            content: "Lỗi khi upload: ",
            duration: 2,
          });
        }
      }

      const payload = {
        conversationId: selectConversation.id,
        senderId: userLogin.userId,
        content: content,
        type: 1,
        replyToId: replyingMessage?.messageId || null,
      };
      console.log("layload: ", payload);

      const stompClient = stompRef.current;

      if (!stompClient || !stompClient.connected) {
        console.warn("Chưa kết nối STOMP WebSocket.");
        return;
      }

      stompClient.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(payload),
      });

      //send text message
      handleSendMessage();

      setMessageText("");
      setSelectedImage(null);
      setPreviewImage(null);
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      messageApi.error("Lỗi khi gửi tin nhắn");
    }
  };

  const handleSendMessage = () => {
    if (!messageText) return;

    const payload = {
      conversationId: selectConversation.id,
      senderId: userLogin.userId,
      content: messageText,
      type: 0,
      replyToId: replyingMessage?.messageId || null,
    };
    console.log("payload no image: ", payload);

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

  const handleSend = async () => {
    try {
      setIsLoading(true);

      if (selectedImage) {
        await handleSendImage();
      } else if (messageText.trim()) {
        handleSendMessage(messageText);
        setMessageText("");
      }
    } catch (error) {
      console.error("Lỗi khi gửi:", error);
      message.error("Lỗi khi gửi tin nhắn");
    } finally {
      setIsLoading(false);
      setReplyingMessage(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-black/80 p-4 border-t border-white">
      {contextHolder}
      {previewImage && (
        <div className="mb-2 relative inline-block">
          <img
            src={previewImage}
            alt="Preview"
            className="rounded-lg"
            style={{ maxHeight: "100px", maxWidth: "200px" }}
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-1 right-1 bg-gray-800 rounded-full p-1 text-white hover:bg-gray-700"
          >
            <X size={16} />
          </button>
        </div>
      )}
      {replyingMessage && (
        <div className="mb-4 px-5 py-2 bg-white/10 text-white rounded-2xl relative">
          <div className="text-white/70 flex items-center space-x-2 w-full pr-4">
            <ReplyIcon className="text-white scale-70 rotate-180 shrink-0 mt-1" />
            <span className=" text-white/70 px-1 rounded shrink-0 mt-1">
              Đang trả lời:
            </span>
            {replyingMessage.type === 1 ? (
              <img
                src={replyingMessage.content}
                alt="Ảnh reply"
                className="max-w-full mb-1 max-h-35 rounded-lg opacity-100"
              />
            ) : (
              <div className="text-white flex-1 break-words">
                {replyingMessage.content}
              </div>
            )}
          </div>

          <button
            onClick={() => setReplyingMessage(null)}
            className="absolute top-1 right-1 p-1 text-white hover:text-red-400"
          >
            <X size={16} />
          </button>
        </div>
      )}
      {isLoading && (
        <div className="w-full mb-5 flex space-x-3 justify-center text-white">
          <div className="my-3">
            <Spin style={{ marginBottom: 0 }}></Spin>
          </div>
          <div className="flex items-center">Đang tải ảnh lên...</div>
        </div>
      )}

      <div className="flex items-center">
        <div className="flex space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            style={{ display: "none" }}
          />
          <button
            onClick={handleImageButtonClick}
            className="text-white hover:bg-white/20 p-2 rounded-full"
          >
            <Image size={20} />
          </button>
          {/* <button className="text-white hover:bg-white/20 p-2 rounded-full">
            <Smile size={20} />
          </button> */}
        </div>

        <div className="flex-1 mx-4">
          <input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full border border-white text-white rounded-full px-4 py-2 focus:outline-none focus:border-blue-400 resize-none"
            placeholder="Aa"
          />
        </div>

        <div>
          {messageText.trim() || selectedImage ? (
            <button
              onClick={handleSend}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
            >
              <Send size={20} />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default InputMessage;
