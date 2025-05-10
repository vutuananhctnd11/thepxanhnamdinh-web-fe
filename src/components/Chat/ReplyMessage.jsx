import React from "react";

const ReplyMessage = ({ message }) => {
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));

  return (
    <div
      className={`px-2 py-2 text-sm border-l-4 rounded-xl mb-1 ${
        message.senderId === userLogin.userId
          ? "border-white/30 bg-white/10"
          : "border-blue-500/40 bg-blue-200/10"
      }`}
    >
      {message.replyToMessageType == 1 ? (
        <img
          src={message.replyToMessageContent}
          alt="Ảnh reply"
          className="max-w-full mb-1 max-h-40 rounded-lg opacity-40"
        />
      ) : (
        <p className="text-white/60">{message.replyToMessageContent}</p>
      )}
    </div>
  );
};

export default ReplyMessage;
