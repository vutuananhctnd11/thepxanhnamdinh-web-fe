import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { message, Upload } from "antd";
import { Image, Mic, Send, Smile, X } from "lucide-react";
import React, { useState, useRef } from "react";

const InputMessage = ({
  messageText,
  setMessageText,
  handleSendMessage,
  handleKeyPress,
  selectConversation,
  stompRef,
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
        formData.append("file", selectedImage); // single image

        const fileRes = await fetchWithAuth(
          "http://localhost:8080/cloudinary",
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

      // Reset sau khi gửi
      setMessageText("");
      setSelectedImage(null);
      setPreviewImage(null);
      console.log("đã gử websocket");
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      message.error("Lỗi khi gửi tin nhắn");
    }
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
      {isLoading && (
        <div className="w-full my-10 flex justify-center text-white">
          Đang tải ảnh lên
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
          <button className="text-white hover:bg-white/20 p-2 rounded-full">
            <Smile size={20} />
          </button>
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
          ) : (
            <button className="text-white hover:bg-white/20 p-2 rounded-full">
              <Mic size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputMessage;
