import { Avatar, Image } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LayoutSocial from "../../components/LayoutSocial";
import NewsFeed from "@/components/HomePage/NewsFeed";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { handleAuthError } from "@/parts/HandleAuthError";
import ModalNotification from "@/parts/ModalNotification";
import InfiniteScroll from "react-infinite-scroll-component";

const PersonalPage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(0);
  const [modalNotiProps, setModalNotiProps] = useState({});
  const [isModalNotiOpen, setIsModalNotiOpen] = useState(false);

  const [listPost, setListPost] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 2;
  const [hasMore, setHasMore] = useState(true);

  //fetch personal page
  const fetchPersonalPage = async () => {
    try {
      const res = await fetchWithAuth(
        `http://localhost:8080/users/personal-page?userId=${userId}`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        const user = response.data;
        setUser(user);
      }
    } catch (error) {
      console.log("Có lỗi khi gọi api: ", error);
      handleAuthError(error, setModalNotiProps, setIsModalNotiOpen);
    }
  };

  //fetch list post of user
  const fetchPersonalPost = async () => {
    try {
      const res = await fetchWithAuth(
        `http://localhost:8080/posts/personal-page?page=${page}&limit=${limit}&userId=${userId}`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        const newPosts = response.data.listResults;

        setListPost((prev) => [...prev, ...newPosts]);

        if (response.data.totalPage == page) {
          setHasMore(false);
        } else {
          setPage((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.log("Có lỗi khi gọi api: ", error);
      handleAuthError(error, setModalNotiProps, setIsModalNotiOpen);
    }
  };

  useEffect(() => {
    fetchPersonalPage();
    fetchPersonalPost();
  }, []);

  return (
    <LayoutSocial>
      <div
        className="mt-13 w-full px-[20%] overflow-y-auto bg-black/90 py-3 text-white"
        id="scrollableDiv"
      >
        <InfiniteScroll
          dataLength={listPost.length}
          next={fetchPersonalPost}
          hasMore={hasMore}
          scrollThreshold={0.9}
          scrollableTarget="scrollableDiv"
          loader={<h4>Đang tải thêm...</h4>}
          endMessage={
            <p className="flex justify-center">Không còn bài viết nào.</p>
          }
          className="w-full flex flex-col"
        >
          <div className="relative bg-white/10 h-[250px] py-3 flex justify-between rounded-2xl pl-3 mb-3">
            <div className="absolute inset-0">
              <img
                src="/bg2.jpg"
                className="w-full h-full object-cover opacity-80"
              />
            </div>
            <div className="absolute inset-0 bg-black/60 w-full h-full"></div>
            <div className="flex items-end justify-between w-full z-20">
              <div className="flex items-end">
                <div className="h-[200px] w-[200px] flex items-center justify-center rounded-[50%]">
                  <Avatar
                    src={user.avatar || "/defaultavt.png"}
                    style={{ height: "100%", width: "100%" }}
                  />
                </div>
                <div className="ml-8">
                  <div className=" text-white space-y-2">
                    <div className="text-3xl font-bold">
                      {user.firstName + " " + user.lastName}
                    </div>
                    <div>{user.dateOfBirth}</div>
                    <div className="flex space-x-5">
                      <div>{user.totalFriends} bạn bè</div>
                      <div>-</div>
                      <div>{user.totalPosts} bài viết</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-end space-x-5 text-white mr-4">
                <div className="px-6 py-2 bg-blue-500/70 flex justify-center rounded-lg hover:cursor-pointer hover:bg-blue-600">
                  Kết bạn
                </div>
                <div className="px-3 py-2 bg-white/20 flex justify-center rounded-lg hover:cursor-pointer hover:bg-white/40">
                  Chỉnh sửa trang cá nhân
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-white/10 p-5 space-y-2 rounded-2xl">
              <div className="font-semibold">Thông tin cá nhân</div>
              <div className="flex justify-between">
                <div className="space-y-2 ml-3">
                  <div>
                    Số điện thoại:{" "}
                    {user.userId == userId ? user.phoneNumber : "********"}
                  </div>
                  <div>
                    Email:{" "}
                    {user.userId == userId ? user.emailAddress : "********"}
                  </div>
                  <div>
                    Địa chỉ: {user.userId == userId ? user.address : "********"}
                  </div>
                </div>
                <div>
                  <div className="px-3 py-2 bg-white/20 flex justify-center rounded-lg hover:cursor-pointer hover:bg-white/40">
                    Lịch sử đặt vé
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center ">
              <NewsFeed listPost={listPost} />
            </div>
          </div>
        </InfiniteScroll>
      </div>
      <ModalNotification
        isModalOpen={isModalNotiOpen}
        setIsModalOpen={setIsModalNotiOpen}
        {...modalNotiProps}
      />
    </LayoutSocial>
  );
};

export default PersonalPage;
