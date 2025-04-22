/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Image } from "antd";
import { ExternalLink, MessageCircleIcon, ThumbsUp } from "lucide-react";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import InfiniteScroll from "react-infinite-scroll-component";

const NewsFeed = () => {
  const [listPost, setListPost] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 1;
  const [hasMore, setHasMore] = useState(true);

  console.log(listPost);
  console.log(page);
  console.log(hasMore);

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
  console.log(hasMore);
  useEffect(() => {
    fetchNewsFeed();
  }, []);

  return (
    <InfiniteScroll
      dataLength={listPost.length}
      next={fetchNewsFeed}
      hasMore={true}
      scrollThreshold={0.9}
      loader={<h4>Đang tải thêm...</h4>}
      endMessage={<p>Không còn bài viết nào.</p>}
      className="w-[100%] flex flex-col items-center"
    >
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
            {post.medias.map((media) => (
              <Image
                src={media.linkCloud}
                className="w-full object-cover"
                style={{ height: "400px" }}
              />
            ))}
            {/* Lượt tương tác */}
            <div className="flex items-center">
              <div className="h-5 w-5 mx-3 rounded-2xl bg-blue-500 flex justify-center items-center hover:scale-105 transition">
                <i class="fa-solid fa-thumbs-up scale-85" />
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
              <div className="w-[30%] py-1 flex justify-center items-center hover:bg-white/10 rounded-lg">
                <MessageCircleIcon className="scale-90 mr-2" />
                <div>Bình luận</div>
              </div>
              <div className="w-[30%] py-1 flex justify-center items-center hover:bg-white/10 rounded-lg">
                <ExternalLink className="scale-90 mr-2" />
                <div>Chia sẻ</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </InfiniteScroll>
  );
};

export default NewsFeed;
