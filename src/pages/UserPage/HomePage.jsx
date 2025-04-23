/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import LayoutSocial from "../../components/LayoutSocial";
import NavBarLeft from "../../components/HomePage/NavBarLeft";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavBarRight from "@/components/HomePage/NavBarRight";
import NewsFeed from "../../components/HomePage/NewsFeed";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Image, Smile, VideoIcon } from "lucide-react";
import CreatePost from "@/components/HomePage/CreatePost";
import ModalNotification from "@/parts/ModalNotification";
import { Spin } from "antd";
import "./custom-scroll-bar.css";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import InfiniteScroll from "react-infinite-scroll-component";

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalNotiProps, setModalNotiProps] = useState({});
  const [isModalNotiOpen, setIsModalNotiOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const userLogin = JSON.parse(localStorage.getItem("userLogin"));

  const showModal = () => {
    setIsModalOpen(true);
  };

  const [listPost, setListPost] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 1;
  const [hasMore, setHasMore] = useState(true);

  const fetchNewsFeed = async () => {
    try {
      const res = await fetchWithAuth(
        `http://localhost:8080/posts/news-feed?page=${page}&limit=${limit}`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        const newPosts = response.data;

        setListPost((prev) => [...prev, ...newPosts]);

        if (newPosts.length < limit) {
          setHasMore(false);
        } else {
          setPage((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.log("Có lỗi khi gọi api: ", error);
    }
  };

  useEffect(() => {
    fetchNewsFeed();
  }, []);

  return (
    <LayoutSocial>
      <div className="w-full pt-13 h-screen flex text-white bg-black/90 relative">
        {/* left nav bar */}
        <ScrollArea className="w-[25%] h-[calc(100vh-52px)] left-0 fixed">
          <NavBarLeft />
        </ScrollArea>

        {/* home page */}
        <div
          className="w-[50%] h-[calc(100vh-52px)] overflow-y-auto flex flex-col items-center custom-scroll-bar"
          id="scrollableDiv"
        >
          {/* Bài viết */}
          <InfiniteScroll
            dataLength={listPost.length}
            next={fetchNewsFeed}
            hasMore={hasMore}
            scrollThreshold={0.9}
            scrollableTarget="scrollableDiv"
            loader={<h4>Đang tải thêm...</h4>}
            endMessage={<p>Không còn bài viết nào.</p>}
            className="w-full flex flex-col items-center"
          >
            {/* tạo bài viết mới */}
            <div className="h-[110px] w-[80%] bg-white/10 mt-5 mb-2 rounded-lg">
              <div className="space-x-3 flex h-[40%] px-4 my-2 justify-center items-center">
                <Avatar className={"scale-120"}>
                  <AvatarImage
                    src={userLogin?.avatar || "/defaultavt.png"}
                    className={"object-cover"}
                  />
                </Avatar>
                <div className="h-10 w-full relative">
                  <input
                    type="text"
                    onClick={showModal}
                    placeholder="Bạn đang nghĩ gì?"
                    className="w-full h-full bg-white/10 rounded-2xl pl-4 pr-4 outline-none placeholder-white/30"
                  />
                </div>
              </div>
              <hr className="mx-5 my-2 border-white/20 " />
              <div className="w-full flex justify-center items-center ">
                <div className="w-[30%] flex space-x-3 hover:bg-white/10 py-1 px-3 rounded-lg">
                  <VideoIcon className="text-red-600" />
                  <div>Video trực tiếp</div>
                </div>
                <div className="w-[30%] flex space-x-3 hover:bg-white/10 py-1 px-3 rounded-lg">
                  <Image className="text-green-500" />
                  <div>Ảnh và video </div>
                </div>
                <div className="w-[35%] flex space-x-3 hover:bg-white/10 py-1 px-3 rounded-lg">
                  <Smile className="text-yellow-400" />
                  <div>Cảm xúc/hoạt động</div>
                </div>
              </div>
              {/* Modal điền thông tin bài viết */}
              <CreatePost
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                setIsUploading={setIsUploading}
                setModalNotiProps={setModalNotiProps}
                setIsModalNotiOpen={setIsModalNotiOpen}
              />
            </div>
            {/* loading create post */}
            {isUploading ? (
              <div className="w-[80%] h-10 py-10 my-3 text-md flex flex-col items-center justify-center bg-white/10 rounded-lg">
                <div className="my-3">
                  <Spin style={{ marginBottom: 0 }}></Spin>
                </div>
                <div>Đang tải lên bài viết của bạn...</div>
              </div>
            ) : null}
            <NewsFeed listPost={listPost} />
          </InfiniteScroll>
        </div>

        {/* right nav bar */}
        <ScrollArea className="w-[25%] h-[calc(100vh-52px)] fixed right-0">
          <NavBarRight />
        </ScrollArea>
      </div>
      <ModalNotification
        isModalOpen={isModalNotiOpen}
        setIsModalOpen={setIsModalNotiOpen}
        {...modalNotiProps}
      />
    </LayoutSocial>
  );
};

export default HomePage;
