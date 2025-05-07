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
import CreatePostModal from "@/components/HomePage/CreatePostModal";
import ModalNotification from "@/parts/ModalNotification";
import { Spin } from "antd";
import "./custom-scroll-bar.css";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import InfiniteScroll from "react-infinite-scroll-component";
import CreatePost from "@/components/Post/CreatePost";

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
  const limit = 5;
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
            <div className="w-[80%]">
              <CreatePost />
            </div>
            <NewsFeed listPost={listPost} isReaction={true} />
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
