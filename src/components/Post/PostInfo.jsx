import useNagivateLoading from "@/hooks/useNagivateLoading";
import { Avatar, AvatarImage } from "../ui/avatar";
import React, { useState } from "react";
import { Carousel, Dropdown, Image, message, Spin } from "antd";
import {
  ExternalLink,
  Globe2Icon,
  MessageCircleIcon,
  MoreHorizontal,
  ThumbsUp,
  UsersIcon,
} from "lucide-react";
import { handleAuthError } from "@/parts/HandleAuthError";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import ModalNotification from "@/parts/ModalNotification";
import CommentModal from "../HomePage/CommentModal";
import { CaretRightOutlined } from "@ant-design/icons";
import UpdatePostModal from "./UpdatePostModal";

const PostInfo = ({ postInput }) => {
  const [post, setPost] = useState(postInput);
  const navigate = useNagivateLoading();
  const [isCmtModalOpen, setIsCmtModalOpen] = useState(false);
  const [userPostFullName, setUserPostFullName] = useState(null);
  const [isLiked, setIsLiked] = useState(post?.liked);
  const [countLike, setCountLike] = useState(post?.reactCount);

  const [modalNotiProps, setModalNotiProps] = useState({});
  const [isModalNotiOpen, setIsModalNotiOpen] = useState(false);

  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [isDeleted, setIsDeleted] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [expanded, setExpanded] = useState(false);
  const MAX_LENGTH = 100;
  const isLongContent = post.content.length > MAX_LENGTH;
  const displayedContent = expanded
    ? post.content
    : post.content.slice(0, MAX_LENGTH);

  const userLogin = JSON.parse(localStorage.getItem("userLogin"));

  const handleCmt = (id, fullName) => {
    setUserPostFullName(fullName);
    setIsCmtModalOpen(true);
  };

  const items = [
    ...(post?.userId === userLogin.userId
      ? [
          {
            key: "1",
            label: <span>Sửa bài viết</span>,
          },
          {
            key: "2",
            label: <span>Xóa bài viết</span>,
          },
        ]
      : []),
    {
      key: "3",
      label: <span>Báo cáo</span>,
    },
  ];

  const handleMenuClick = ({ key }) => {
    console.log("KEY: ", key);
    if (key === "1") {
      setIsModalUpdateOpen(true);
    } else if (key === "2") {
      setModalNotiProps({
        modalTitle: "Xóa bài viết",
        modalMessage: "Bạn có chắc chắn muốn xóa bài viết này?",
        type: "warning",
        buttonText: "Xác nhận",
        cancelButtonText: "Hủy",
        onConfirm: () => handleDeletePost(post?.postId),
        // onConfirm: () => console.log("Xóa thành công: "),
      });
      setIsModalNotiOpen(true);
    }
  };

  //fetch delete post
  const handleDeletePost = async (postId) => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/posts/${postId}/delete`,
        {
          method: "PATCH",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        messageApi.success({
          content: "Xóa bài viết thành công!",
          duration: 2,
        });
        setTimeout(() => {
          setIsDeleted(true);
        }, 2000);
      }
    } catch (error) {
      console.log("Có lỗi khi gọi api: ", error);
      handleAuthError(error, setModalNotiProps, setIsModalNotiOpen);
    }
  };

  //fetch like post
  const handleLike = async (postId) => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/reactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postId: postId, userId: userLogin.userId }),
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        setIsLiked(true);
        setCountLike(countLike + 1);
      }
    } catch (error) {
      console.log("Có lỗi khi gọi api: ", error);
      handleAuthError(error, setModalNotiProps, setIsModalNotiOpen);
    }
  };

  //fetch unlike post
  const handleUnlike = async (postId) => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/reactions/${postId}`,
        {
          method: "DELETE",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        setIsLiked(false);
        setCountLike(countLike - 1);
      }
    } catch (error) {
      console.log("Có lỗi khi gọi api: ", error);
      handleAuthError(error, setModalNotiProps, setIsModalNotiOpen);
    }
  };

  if (isUpdating) {
    return (
      <div className="w-[80%] h-15 py-10 my-3 text-md flex flex-col items-center justify-center bg-white/10 rounded-lg">
        <div className="my-3">
          <Spin style={{ marginBottom: 0 }}></Spin>
        </div>
        <div>Đang chỉnh sửa lại bài viết của bạn...</div>
      </div>
    );
  } else if (isDeleted) return <>{contextHolder}</>;
  else
    return (
      <div
        className="w-full text-[14px] bg-white/10 rounded-lg my-3 py-1"
        key={post?.postId}
      >
        {contextHolder}
        <div className="w-full">
          <div className="flex justify-between px-4 pt-4 pb-3">
            <div className="flex items-center">
              <Avatar
                className={"scale-120 hover:cursor-pointer"}
                onClick={() =>
                  navigate(`/social/personal-page/${post?.userId}`)
                }
              >
                <AvatarImage
                  src={post?.avatar || "/defaultavt.png"}
                  className={"object-cover"}
                />
              </Avatar>
              <div className="ml-3">
                <div className="flex space-x-2 font-semibold ">
                  <div className="hover:underline">{post?.userFullName}</div>

                  {post?.groupId != null && (
                    <div className="flex space-x-1">
                      <CaretRightOutlined />
                      <div
                        className="hover:underline"
                        onClick={() =>
                          navigate(`/social/groups/detail/${post?.groupId}`)
                        }
                      >
                        {post?.groupName}
                      </div>
                    </div>
                  )}
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
            <div className="flex space-x-2">
              <Dropdown
                menu={{
                  items,
                  onClick: handleMenuClick,
                  className: "custom-dropdown-menu",
                }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <MoreHorizontal className="scale-90 hover:cursor-pointer" />
              </Dropdown>
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
                {countLike} lượt thích
              </div>
            </div>
            <div className="text-[13px] hover:underline hover:cursor-default mr-3">
              {post?.commentCount} bình luận
            </div>
          </div>
          <hr className="border-white/30 mx-3 mt-2 mb-1" />
          {/* Thanh tương tác */}
          <div className="flex justify-center items-center text-white/70">
            {isLiked ? (
              <div
                className="w-[30%] py-1 flex justify-center items-center hover:bg-white/10 rounded-lg hover:cursor-pointer"
                onClick={() => handleUnlike(post?.postId)}
              >
                <ThumbsUp className="scale-90 mr-2 text-blue-500" />
                <div className="text-blue-500">Đã Thích</div>
              </div>
            ) : (
              <div
                className="w-[30%] py-1 flex justify-center items-center hover:bg-white/10 rounded-lg hover:cursor-pointer"
                onClick={() => handleLike(post?.postId)}
              >
                <ThumbsUp className="scale-90 mr-2" />
                <div>Thích</div>
              </div>
            )}
            <div
              className="w-[30%] py-1 flex justify-center items-center hover:bg-white/10 rounded-lg hover:cursor-pointer"
              onClick={() => handleCmt(post?.postId, post?.userFullName)}
            >
              <MessageCircleIcon className="scale-90 mr-2" />
              <div>Bình luận</div>
            </div>
            <div className="w-[30%] py-1 flex justify-center items-center hover:bg-white/10 rounded-lg hover:cursor-pointer">
              <ExternalLink className="scale-90 mr-2" />
              <div>Đăng lại</div>
            </div>
          </div>
        </div>
        <CommentModal
          postId={post?.postId}
          userLogin={userLogin}
          userPostFullName={userPostFullName}
          isCmtModalOpen={isCmtModalOpen}
          setIsCmtModalOpen={setIsCmtModalOpen}
        />
        <ModalNotification
          isModalOpen={isModalNotiOpen}
          setIsModalOpen={setIsModalNotiOpen}
          {...modalNotiProps}
        />
        <UpdatePostModal
          isModalOpen={isModalUpdateOpen}
          setIsModalOpen={setIsModalUpdateOpen}
          setIsUploading={setIsUpdating}
          setIsModalNotiOpen={setIsModalNotiOpen}
          setModalNotiProps={setModalNotiProps}
          post={post}
          setPost={setPost}
        />
      </div>
    );
};

export default PostInfo;
