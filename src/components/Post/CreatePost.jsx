import { Image, SmilePlus, VideoIcon } from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import CreatePostModal from "@/components/HomePage/CreatePostModal";
import ModalNotification from "@/parts/ModalNotification";
import { Spin } from "antd";
import PostInfo from "./PostInfo";

const CreatePost = () => {
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalNotiProps, setModalNotiProps] = useState({});
  const [isModalNotiOpen, setIsModalNotiOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newPost, setNewPost] = useState(null);

  const handelCreatePost = () => {
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="w-full bg-white/10 mb-2 pt-4 pb-2 rounded-lg">
        <div className="space-x-3 flex h-[40%] px-4 mb-4 justify-center items-center">
          <Avatar className={"scale-120"}>
            <AvatarImage
              src={userLogin?.avatar || "/defaultavt.png"}
              className={"object-cover"}
            />
          </Avatar>
          <div className="h-10 w-full relative">
            <input
              type="text"
              onClick={handelCreatePost}
              placeholder="Bạn đang nghĩ gì?"
              className="w-full h-full bg-white/10 rounded-2xl pl-4 pr-4 outline-none placeholder-white/30"
            />
          </div>
        </div>
        <hr className="mx-5 my-2 border-white/20 " />
        <div className="w-full flex justify-center items-center ">
          <div className="w-[30%] flex justify-center space-x-3 hover:bg-white/10 py-2 px-3 rounded-lg">
            <VideoIcon className="text-red-600" />
            <div>Video trực tiếp</div>
          </div>
          <div className="w-[30%] flex justify-center space-x-3 hover:bg-white/10 py-2 px-3 rounded-lg">
            <Image className="text-green-500" />
            <div>Ảnh và video </div>
          </div>
          <div className="w-[35%] flex justify-center space-x-3 hover:bg-white/10 py-2 px-3 rounded-lg">
            <SmilePlus className="text-yellow-400" />
            <div>Cảm xúc/hoạt động</div>
          </div>
        </div>
        {/* Modal điền thông tin bài viết */}
        <CreatePostModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setIsUploading={setIsUploading}
          setModalNotiProps={setModalNotiProps}
          setIsModalNotiOpen={setIsModalNotiOpen}
          setNewPost={setNewPost}
        />
      </div>
      {/* loading create post */}
      {isUploading ? (
        <div className="w-full h-10 py-10 my-3 text-md flex flex-col items-center justify-center bg-white/10 rounded-lg">
          <div className="my-3">
            <Spin style={{ marginBottom: 0 }}></Spin>
          </div>
          <div>Đang tải lên bài viết của bạn...</div>
        </div>
      ) : null}
      {newPost && (
        <div className="w-full mt-3">
          <PostInfo postInput={newPost} />
        </div>
      )}
      <ModalNotification
        isModalOpen={isModalNotiOpen}
        setIsModalOpen={setIsModalNotiOpen}
        {...modalNotiProps}
      />
    </div>
  );
};

export default CreatePost;
