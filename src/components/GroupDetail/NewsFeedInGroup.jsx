import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreatePost from "@/components/Post/CreatePost";
import NewsFeed from "@/components/HomePage/NewsFeed";

const NewsFeedInGroup = ({ checkMember, groupInfo }) => {
  const { groupId } = useParams();
  const [listPosts, setListPosts] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 5;
  const [hasMore, setHasMore] = useState(true);

  const [messageApi, contextHolder] = message.useMessage();

  const fetchGroupPost = async () => {
    try {
      const res = await fetchWithAuth(
        `http://localhost:8080/posts/group?page=${page}&limit=${limit}&groupId=${groupId}`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        const posts = response.data.listResults;
        setListPosts((prev) => [...prev, ...posts]);

        if (response.totalPage == page) {
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
    fetchGroupPost();
  }, []);

  return (
    <div className="w-full md:w-2/3 lg:w-6/7 order-1 md:order-2">
      {contextHolder}
      {/* list post */}
      {(() => {
        if (checkMember?.isMember) {
          // is member
          return (
            <div className="w-full">
              <div className="w-full">
                <CreatePost />
              </div>
              {listPosts.length === 0 ? (
                <div className="text-white/70 w-[80%] my-10 flex justify-center">
                  Hãy cùng các thành viên thảo luận trong nhóm!
                </div>
              ) : (
                <NewsFeed listPost={listPosts} isReaction={true} />
              )}
            </div>
          );
        } else if (groupInfo.type !== 1) {
          // group private and is not member
          return (
            <div className="text-white/70 w-[80%] my-10 flex justify-center">
              Bạn chưa là thành viên của nhóm!
            </div>
          );
        } else {
          // group public and is not member
          return listPosts.length === 0 ? (
            <div className="text-white/70 w-[80%] my-10 flex justify-center">
              Chưa có bài viết nào trong nhóm!
            </div>
          ) : (
            <NewsFeed listPost={listPosts} isReaction={false} />
          );
        }
      })()}
    </div>
  );
};

export default NewsFeedInGroup;
