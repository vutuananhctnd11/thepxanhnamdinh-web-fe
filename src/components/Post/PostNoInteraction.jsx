import useNagivateLoading from "@/hooks/useNagivateLoading";
import { Avatar, AvatarImage } from "../ui/avatar";
import React, { useState } from "react";
import { Carousel, Image } from "antd";
import { ExternalLink, MessageCircleIcon, ThumbsUp } from "lucide-react";

const PostNoInteraction = ({ post }) => {
  const navigate = useNagivateLoading();
  const [expanded, setExpanded] = useState(false);

  const MAX_LENGTH = 200; // Số ký tự muốn hiển thị khi thu gọn

  const isLongContent = post.content.length > MAX_LENGTH;
  const displayedContent = expanded
    ? post.content
    : post.content.slice(0, MAX_LENGTH);

  return (
    <div
      className="w-full text-[14px] bg-white/10 rounded-lg my-3 py-1"
      key={post?.postId}
    >
      <div className="w-full">
        <div className="flex items-center px-4 pt-4 pb-2">
          <Avatar
            className={"scale-120 hover:cursor-pointer"}
            onClick={() => navigate(`/social/personal-page/${post?.userId}`)}
          >
            <AvatarImage
              src={post?.avatar || "/defaultavt.png"}
              className={"object-cover"}
            />
          </Avatar>
          <div className="ml-3">
            <div className="font-semibold hover:underline">
              {post?.userFullName}
            </div>
            <div className="text-white/50 text-[13px]">{post?.seenAt}</div>
          </div>
        </div>
        <div className="px-4 pb-3 whitespace-pre-wrap">
          {displayedContent}
          {isLongContent && !expanded && (
            <span
              className="ml-3 text-white/70 cursor-pointer"
              onClick={() => setExpanded(true)}
            >
              ... Xem thêm
            </span>
          )}
          {expanded && (
            <span
              className="ml-3 text-white/70 cursor-pointer"
              onClick={() => setExpanded(false)}
            >
              Ẩn bớt
            </span>
          )}
        </div>

        <Carousel arrows={true} arrowOffset={20} style={{ display: "block" }}>
          {post?.medias.map((media) => (
            <div
              key={media.mediaId}
              style={{ display: "flex" }}
              className="h-[400px] items-center justify-center bg-black/50 !flex"
            >
              <Image
                src={media.linkCloud}
                preview={true}
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
          ))}
        </Carousel>

        {/* Lượt tương tác */}
        <div className="flex justify-between items-end">
          <div className="flex justify-center items-center mt-2">
            <div className="h-5 w-5 mx-2 rounded-2xl bg-blue-500 flex justify-center items-center hover:scale-105 transition">
              <i className="fa-solid fa-thumbs-up scale-85" />
            </div>
            <div className="text-[13px] hover:underline hover:cursor-default">
              {post?.reactCount} lượt thích
            </div>
          </div>
          <div className="text-[13px] hover:underline hover:cursor-default mr-3">
            {post?.commentCount} bình luận
          </div>
        </div>
        <hr className="border-white/30 mx-3 mt-2 mb-1" />
        {/* Thanh tương tác */}
        <div className="flex justify-center items-center text-white/50">
          <div className="w-[30%] py-1 flex justify-center items-center rounded-lg hover:cursor-pointer">
            <ThumbsUp className="scale-90 mr-2" />
            <div>Thích</div>
          </div>
          <div className="w-[30%] py-1 flex justify-center items-center rounded-lg">
            <MessageCircleIcon className="scale-90 mr-2" />
            <div>Bình luận</div>
          </div>
          <div className="w-[30%] py-1 flex justify-center items-center rounded-lg">
            <ExternalLink className="scale-90 mr-2" />
            <div>Đăng lại</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostNoInteraction;
