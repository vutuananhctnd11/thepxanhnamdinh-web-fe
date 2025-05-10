import { ReplyIcon } from "lucide-react";
import React from "react";
import ReplyMessage from "./ReplyMessage";

const MessageChat = ({ message, selectConversation, setReplyingMessage }) => {
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));

  const handleReply = (message) => {
    // console.log("reply: ", message);
    setReplyingMessage(message);
  };

  return (
    <div
      key={message.id}
      className={`flex ${
        message.senderId === userLogin.userId ? "justify-end" : "justify-start"
      }`}
    >
      {message.senderId !== userLogin.userId && (
        <img
          src={selectConversation?.avatar || "/defaultavt.png"}
          className="w-8 h-8 rounded-full mr-2 self-end"
        />
      )}

      <div
        className={`flex flex-col ${
          message.senderId === userLogin.userId ? "items-end" : "items-start"
        }`}
      >
        {message.replyToMessageId && <ReplyMessage message={message} />}

        <div className="flex">
          {message.senderId === userLogin.userId && (
            <div className="flex items-end mr-1">
              <div
                className="fa-solid fa-reply text-white scale-70 hover:cursor-pointer hover:scale-80 rotate-180"
                onClick={() => handleReply(message)}
              />
            </div>
          )}
          <div
            className={`max-w-xs md:max-w-md rounded-2xl ${
              message.senderId === userLogin.userId
                ? "bg-blue-500/80 text-white rounded-br-none"
                : "bg-white/20 text-white rounded-bl-none"
            }`}
          >
            {message.type === 1 ? (
              <img
                src={message.content}
                alt="Ảnh đã gửi"
                className={`max-w-full mb-1 max-h-60 rounded-lg mx-1 my-1 ${
                  message.senderId === userLogin.userId
                    ? "border-blue-500"
                    : "border-white/20"
                }`}
              />
            ) : (
              <p className=" px-4 py-2">{message.content}</p>
            )}

            <p className="text-xs mb-1 px-4 text-white/70">
              {message.createAt}
            </p>
          </div>
          {message.senderId !== userLogin.userId && (
            <div className="flex items-end ml-1">
              <div
                className="fa-solid fa-reply text-white scale-70 hover:cursor-pointer hover:scale-80 rotate-180"
                onClick={() => handleReply(message)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageChat;
