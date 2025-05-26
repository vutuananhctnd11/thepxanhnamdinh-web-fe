import useNagivateLoading from "@/hooks/useNagivateLoading";
import { Avatar, AvatarImage } from "../../ui/avatar";
import React, { useState } from "react";
import { Carousel, Image } from "antd";
import {
  CheckCircle2,
  Delete,
  Globe2Icon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react";
import { handleFriendAction } from "@/parts/HandleApiAction";
import ModalNotification from "@/parts/ModalNotification";

const PostReport = ({ report, setListReport, listReport, messageApi }) => {
  const post = report.post;
  const navigate = useNagivateLoading();

  const [modalNotiProps, setModalNotiProps] = useState({});
  const [isModalNotiOpen, setIsModalNotiOpen] = useState(false);

  const handleApproveReport = (report) => {
    handleFriendAction({
      url: `${import.meta.env.VITE_API_URL}/reports/approve/${report.reportId}`,
      method: "PATCH",
      onSuccess: () => {
        setListReport(listReport.filter((r) => r.reportId !== report.reportId));
      },
      successMessage: `Đã lưu lịch sử báo cáo của bài viết này!`,
      errorMessage: "Thao tác thất bại",
      messageApi: messageApi,
    });
  };

  const handleRejectReport = (report) => {
    handleFriendAction({
      url: `${import.meta.env.VITE_API_URL}/reports/reject/${report.reportId}`,
      method: "PATCH",
      onSuccess: () => {
        setListReport(listReport.filter((r) => r.reportId !== report.reportId));
      },
      successMessage: `Bài viết không vi phạm, đã xóa báo cáo của bài viêt này!`,
      errorMessage: "Thao tác thất bại",
      messageApi: messageApi,
    });
  };

  const fetchDeletePost = (report) => {
    handleFriendAction({
      url: `${import.meta.env.VITE_API_URL}/posts/${report.post.postId}/delete`,
      method: "PATCH",
      onSuccess: () => {
        setListReport(listReport.filter((r) => r.reportId !== report.reportId));
      },
      successMessage: `Đã xóa bài viết theo vi phạm đã được ${report.reporterFullName} báo cáo!`,
      errorMessage: "Thao tác thất bại",
      messageApi: messageApi,
    });
  };

  const handleDeletePost = (report) => {
    setModalNotiProps({
      modalTitle: "Xóa bài viết",
      modalMessage: "Bạn có chắc chắn muốn xóa bài viết này?",
      type: "warning",
      buttonText: "Xác nhận",
      cancelButtonText: "Hủy",
      onConfirm: () => fetchDeletePost(report),
    });
    setIsModalNotiOpen(true);
  };

  return (
    <div
      className="w-full text-[14px] bg-white/70 rounded-lg shadow-2xl my-3 py-1"
      key={post?.postId}
    >
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
              <div className="text-black text-[13px] flex items-center">
                {post?.status == 1 ? (
                  <Globe2Icon className="scale-50 " />
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

        <Carousel
          arrows={true}
          arrowOffset={20}
          style={{ display: "block", maxHeight: 300, overflow: "hidden" }}
        >
          {post?.medias.map((media) => (
            <div
              key={media.mediaId}
              style={{ display: "flex" }}
              className="h-[300px] items-center justify-center bg-black/50 !flex"
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

        <div className="flex justify-between items-end">
          <div className="flex justify-center items-center mt-2">
            <div className="h-5 w-5 mx-2 rounded-2xl bg-blue-500 flex justify-center items-center hover:scale-105 transition">
              <i className="fa-solid fa-thumbs-up scale-85 text-white" />
            </div>
            <div className="text-[13px] hover:underline hover:cursor-default">
              {post?.reactCount} lượt thích
            </div>
          </div>
          <div className="text-[13px] hover:underline hover:cursor-default mr-3">
            {post?.commentCount} bình luận
          </div>
        </div>
        <hr className="border-black/30 mx-3 mt-2 mb-1" />
        {/* Thanh tương tác */}
        <div className="flex justify-center items-center">
          <div
            className="w-[50%] py-1 flex justify-center items-center hover:bg-black/10 rounded-lg hover:cursor-pointer"
            onClick={() => handleApproveReport(report)}
          >
            <CheckCircle2 className="scale-80 mr-2 text-green-400 " />
            <div>Lưu tố cáo</div>
          </div>
          <div
            className="w-[50%] py-1 flex justify-center items-center hover:bg-black/10 rounded-lg hover:cursor-pointer"
            onClick={() => handleRejectReport(report)}
          >
            <XCircleIcon className="scale-80 mr-2 text-red-500" />
            <div>Không vi phạm</div>
          </div>
          <div
            className="w-[50%] py-1 flex justify-center items-center hover:bg-black/10 rounded-lg hover:cursor-pointer"
            onClick={() => handleDeletePost(report)}
          >
            <Delete className="scale-80 mr-2 text-red-500" />
            <div>Xóa bài</div>
          </div>
        </div>
      </div>
      <ModalNotification
        isModalOpen={isModalNotiOpen}
        setIsModalOpen={setIsModalNotiOpen}
        {...modalNotiProps}
      />
    </div>
  );
};

export default PostReport;
