import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import React, { useEffect, useState } from "react";

const ListFriend = () => {
  const [listFriends, setListFriends] = useState([]);

  const fetchListFriend = async () => {
    const userLogin = JSON.parse(localStorage.getItem("userLogin"));
    const userId = userLogin.userId;

    try {
      const res = await fetchWithAuth(
        `http://localhost:8080/friends?userId=${userId}&page=1&limit=10`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        setListFriends(response.data);
      } else {
        alert("ERROR: ", response.message);
      }
    } catch (error) {
      console.log("Lỗi khi gọi api: ", error);
    }
  };

  useEffect(() => {
    fetchListFriend();
  }, []);

  if (listFriends.length == 0) {
    return (
      <div className="w-full px-10 pb-10">
        <div className="text-xl font-semibold text-white mb-4">
          Danh sách bạn bè
        </div>
        <div className="text-white/80 text-lg flex justify-center my-2">
          Bạn chưa có ai là bạn bè!
        </div>
      </div>
    );
  } else
    return (
      <div className="w-full px-10 pb-10">
        <div className="text-xl font-semibold text-white mb-4">
          Danh sách bạn bè
        </div>
        <div className="flex flex-wrap gap-6 mx-10">
          {listFriends.map((friend) => (
            <div key={friend.id} className="flex justify-center flex-1">
              <div className="w-[220px] bg-white/20 border-1 rounded-lg overflow-hidden">
                <img
                  src={friend.avatar || "/defaultavt.png"}
                  className="w-full h-[180px] object-cover"
                />
                <div className="m-2 space-y-1 mb-4">
                  <div className="font-semibold text-white text-lg">
                    {friend.fullName}
                  </div>
                  <div className=" text-white/70 text-[12px]">
                    Bạn bè {friend.friendAt} trước
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
};

export default ListFriend;
