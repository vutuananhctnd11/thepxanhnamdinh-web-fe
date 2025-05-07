import React from "react";

const MessageChat = ({ message, selectConversation }) => {
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
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
            className={`max-w-full max-h-60 rounded-md border-b-0 border-1 border-blue-500 ${
              message.senderId === userLogin.userId
                ? "border-blue-500"
                : "border-white/20"
            }`}
          />
        ) : (
          <p className=" px-4 py-2">{message.content}</p>
        )}
        <p className="text-xs mb-1 px-4 text-white/70">{message.createAt}</p>
      </div>
    </div>
  );
};

export default MessageChat;
