import useNagivateLoading from "@/hooks/useNagivateLoading";
import { Avatar, AvatarImage } from "../ui/avatar";
import React from "react";
import { Carousel, Image, message } from "antd";
import {
  CheckCircle,
  CheckCircle2,
  Globe2Icon,
  MessageCircleIcon,
  ThumbsUp,
  UsersIcon,
  XCircleIcon,
} from "lucide-react";
import { handleFriendAction } from "@/parts/HandleApiAction";

const PostWaitCensor = ({ post, setListPost, listPost }) => {
  const navigate = useNagivateLoading();
  const [messageApi, contextHolder] = message.useMessage();

  const handleApprovePost = (post) => {
    handleFriendAction({
      url: `${import.meta.env.VITE_API_URL}/posts/${post.postId}/approve`,
      method: "PATCH",
      onSuccess: () => {
        setListPost(listPost.filter((p) => p.postId !== post.postId));
      },
      successMessage: `Phê duyệt bài viết của ${post.userFullName} thành công!`,
      errorMessage: "Phê duyệt thất bại",
      messageApi: messageApi,
    });
  };

  const handleRejectPost = (post) => {
    handleFriendAction({
      url: `${import.meta.env.VITE_API_URL}/posts/${post.postId}/reject`,
      method: "PATCH",
      onSuccess: () => {
        setListPost(listPost.filter((p) => p.postId !== post.postId));
      },
      successMessage: `Bạn đã từ chối bài viết của ${post.userFullName}!`,
      errorMessage: "Từ chối thất bại",
      messageApi: messageApi,
    });
  };

  return (
    <div
      className="w-full text-[14px] bg-white/10 rounded-lg my-3 py-1"
      key={post?.postId}
    >
      {contextHolder}
      <div className="w-full">
        <div className="flex justify-between px-4 pt-4 pb-2">
          <div className="flex items-center">
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
              <div className="flex space-x-2 font-semibold ">
                <div className="hover:underline">{post?.userFullName}</div>
              </div>
              <div className="text-white/50 text-[13px] flex items-center">
                {post?.status == 1 ? (
                  <Globe2Icon className="scale-50" />
                ) : (
                  <UsersIcon className="scale-55" />
                )}
                <div className="mr-1">•</div>
                <div>{post?.seenAt}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 pb-3">{post?.content}</div>

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

        {/* aprrove or reject */}
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
        <div className="flex justify-center items-center text-white/70">
          <div
            className="w-[50%] py-1 flex justify-center items-center hover:bg-white/10 rounded-lg hover:cursor-pointer"
            onClick={() => handleApprovePost(post)}
          >
            <CheckCircle2 className="scale-80 mr-2 text-green-400 " />
            <div>Phê duyêt</div>
          </div>
          <div
            className="w-[50%] py-1 flex justify-center items-center hover:bg-white/10 rounded-lg hover:cursor-pointer"
            onClick={() => handleRejectPost(post)}
          >
            <XCircleIcon className="scale-80 mr-2 text-red-500" />
            <div>Từ chối</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostWaitCensor;
