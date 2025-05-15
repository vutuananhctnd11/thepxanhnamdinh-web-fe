import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { message } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import PostWaitCensor from "../Post/PostWaitCensor";

const CensorPost = () => {
  const { groupId } = useParams();
  const [listPost, setListPost] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [page, setPage] = useState(1);
  const limit = 1;
  const [hasMore, setHasMore] = useState(true);
  const [totalPost, setTotalPost] = useState(0);

  //fetch list post waiting censor in group
  const fetchListPostWaitCensor = async () => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/posts/group/censor?page=${page}&limit=${limit}&groupId=${groupId}`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        const listRequest = response.data.listResults;
        setListPost((prev) => [...prev, ...listRequest]);
        setTotalPost(response.data.totalPage * limit);

        if (response.data.totalPage <= page) {
          setHasMore(false);
        } else {
          setPage((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.log("Có lỗi khi gọi api: ", error);
      messageApi.error({
        content: "Lỗi khi lấy danh sách bài viết: " + error,
        duration: 3,
      });
    }
  };

  useEffect(() => {
    fetchListPostWaitCensor();
  }, []);

  return (
    <div className="w-full max-w-2xl bg-white/10 rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4 text-white">
        Tổng số: {totalPost} bài viết đang chờ duyệt
      </h2>
      {contextHolder}
      <InfiniteScroll
        dataLength={listPost.length}
        next={fetchListPostWaitCensor}
        hasMore={hasMore}
        loader={<h4 className="text-center my-4">Đang tải thêm...</h4>}
        scrollThreshold={0.9}
        scrollableTarget="scrollableDiv"
        endMessage={
          <p className="flex text-white/60 text-sm justify-center py-4">
            Đã hiển thị tất cả yêu cầu tham gia.
          </p>
        }
        className="w-full flex flex-col gap-4"
      >
        {/* Danh sách thành viên */}
        <div className="space-y-3">
          {listPost.length > 0 ? (
            listPost.map((post) => (
              <PostWaitCensor
                post={post}
                setListPost={setListPost}
                listPost={listPost}
              />
            ))
          ) : (
            <div className="text-center py-4 text-white/70">
              Không có bài viết nào cần duyệt
            </div>
          )}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default CensorPost;
