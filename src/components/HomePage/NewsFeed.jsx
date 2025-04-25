import React, { useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Carousel, Image } from "antd";
import { ExternalLink, MessageCircleIcon, ThumbsUp } from "lucide-react";
import CommentModal from "./CommentModal";

const NewsFeed = ({ listPost }) => {
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
  const [isCmtModalOpen, setIsCmtModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleCmt = (id) => {
    setSelectedId(id);
    setIsCmtModalOpen(true);
  };

  return (
    <>
      {/* Thông tin bài viết */}
      {listPost.map((post) => (
        <div
          className="w-[80%] text-[14px] bg-white/10 rounded-lg my-3 py-1"
          key={post.postId}
        >
          <div className="w-full">
            <div className="flex items-center px-4 pt-4 pb-2">
              <Avatar className={"scale-120"}>
                <AvatarImage
                  src={post.avatar || "/defaultavt.png"}
                  className={"object-cover"}
                />
              </Avatar>
              <div className="ml-3">
                <div className="font-semibold">{post.userFullName}</div>
                <div className="text-white/50 text-[13px]">{post.seenAt}</div>
              </div>
            </div>
            <div className="px-4 pb-3">{post.content}</div>

            <Carousel
              arrows={true}
              arrowOffset={20}
              style={{ display: "block" }}
            >
              {post.medias.map((media) => (
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
            <div className="flex items-center mt-2">
              <div className="h-5 w-5 mx-3 rounded-2xl bg-blue-500 flex justify-center items-center hover:scale-105 transition">
                <i className="fa-solid fa-thumbs-up scale-85" />
              </div>
              <div className="text-[13px] hover:underline">
                {post.reactCount}
              </div>
            </div>
            <hr className="border-white/30 mx-3 mt-2 mb-1" />
            {/* Thanh tương tác */}
            <div className="flex justify-center text-white/70">
              <div className="w-[30%] py-1 flex justify-center items-center hover:bg-white/10 rounded-lg">
                <ThumbsUp className="scale-90 mr-2" />
                <div>Thích</div>
              </div>
              <div
                className="w-[30%] py-1 flex justify-center items-center hover:bg-white/10 rounded-lg"
                onClick={() => handleCmt(post.postId)}
              >
                <MessageCircleIcon className="scale-90 mr-2" />
                <div>Bình luận</div>
              </div>
              <div className="w-[30%] py-1 flex justify-center items-center hover:bg-white/10 rounded-lg">
                <ExternalLink className="scale-90 mr-2" />
                <div>Chia sẻ</div>
              </div>
            </div>

            <hr className="border-white/30 my-1 mx-2" />
            {/* Comment */}
          </div>
        </div>
      ))}
      <CommentModal
        postId={selectedId}
        userLogin={userLogin}
        isCmtModalOpen={isCmtModalOpen}
        setIsCmtModalOpen={setIsCmtModalOpen}
      />
    </>
  );
};

export default NewsFeed;
