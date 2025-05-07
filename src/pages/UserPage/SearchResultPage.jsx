import React, { useEffect, useState } from "react";
import { Users, Globe, Lock, LucideSearch, Users2 } from "lucide-react";
import LayoutSocial from "../../components/LayoutSocial";
import { useSearchParams } from "react-router-dom";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { message } from "antd";
import SearchUsers from "@/components/SearchResult/SearchUsers";
import SearchGroups from "@/components/SearchResult/SearchGroups";

const SearchResultPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("query") || "");

  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);

  const [page, setPage] = useState(1);
  const limit = 5;
  const [hasMore, setHasMore] = useState(true);

  const [messageApi, contextHolder] = message.useMessage();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const keyword = e.target.value.trim();
      if (keyword !== "") {
        searchParams.set("query", keyword);
        setSearchParams(searchParams);
        setSearch(keyword);
        setPage(1);
      }
    }
  };

  //fetch search user
  const fetchSearchUsers = async () => {
    try {
      const res = await fetchWithAuth(`http://localhost:8080/users/search`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page, limit, search }),
      });
      const response = await res.json();

      if (response.status === "success") {
        const usersResponse = response.data.listResults;
        setUsers(usersResponse);

        if (response.totalPage == page) {
          setHasMore(false);
        } else {
          setPage((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.log("Có lỗi khi tìm kiếm user: ", error);
    }
  };

  //fetch search group result
  const fetchSearchGroups = async () => {
    try {
      const res = await fetchWithAuth(`http://localhost:8080/groups/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page, limit, search }),
      });
      const response = await res.json();

      if (response.status === "success") {
        const usersResponse = response.data.listResults;
        setGroups(usersResponse);

        if (response.totalPage == page) {
          setHasMore(false);
        } else {
          setPage((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.log("Có lỗi khi tìm kiếm nhóm: ", error);
    }
  };

  useEffect(() => {
    fetchSearchUsers();
    fetchSearchGroups();
  }, [search]);

  return (
    <LayoutSocial>
      {contextHolder}
      <div className="bg-black/90 min-h-screen mt-13">
        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-6 text-white">
          <div className="bg-white/10 rounded-lg shadow-sm">
            {/* Search Header */}
            <div className="p-4 border-b flex justify-between">
              <h1 className="text-xl font-bold">
                Kết quả tìm kiếm cho "{search}"
              </h1>
              <div className="h-8 relative">
                <LucideSearch className="absolute left-2 h-8 justify-center scale-85" />
                <input
                  type="text"
                  placeholder="Khám phá thêm"
                  className="w-full h-full bg-white/20 rounded-2xl pl-10 pr-4 outline-none placeholder-white/30"
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>

            {/* Search Tabs */}
            <div className="flex border-b">
              <button
                className={`px-4 py-3 font-medium text-sm flex items-center ${
                  activeTab === "all"
                    ? "text-white border-b-2 border-white bg-white/10"
                    : "text-white/70"
                }`}
                onClick={() => setActiveTab("all")}
              >
                Tất cả
              </button>
              <button
                className={`px-4 py-3 font-medium text-sm flex items-center ${
                  activeTab === "people"
                    ? "text-white border-b-2 border-white bg-white/10"
                    : "text-white/70"
                }`}
                onClick={() => setActiveTab("people")}
              >
                <Users2 className="w-4 h-4 mr-1" />
                Mọi người
              </button>
              <button
                className={`px-4 py-3 font-medium text-sm flex items-center ${
                  activeTab === "groups"
                    ? "text-white border-b-2 border-white bg-white/10"
                    : "text-white/70"
                }`}
                onClick={() => setActiveTab("groups")}
              >
                <Users2 className="w-4 h-4 mr-1" />
                Nhóm
              </button>
            </div>

            {/* Search Results */}
            <div className="p-4">
              {/* People Section */}
              {(activeTab === "all" || activeTab === "people") && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold">Mọi người</h2>
                    {activeTab === "all" && (
                      <div
                        className="py-1 px-2 rounded-md text-blue-500 text-sm hover:cursor-pointer hover:bg-white/10"
                        onClick={() => setActiveTab("people")}
                      >
                        Xem tất cả
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {users.length === 0 ? (
                      <div className="my-10 flex justify-center">
                        Không có ai phù hợp cả!
                      </div>
                    ) : (
                      users.map((user) => <SearchUsers user={user} />)
                    )}
                  </div>
                </div>
              )}

              {/* Groups Section */}
              {(activeTab === "all" || activeTab === "groups") && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold">Nhóm</h2>
                    {activeTab === "all" && (
                      <div
                        className="py-1 px-2 rounded-md text-blue-500 text-sm hover:cursor-pointer hover:bg-white/10"
                        onClick={() => setActiveTab("groups")}
                      >
                        Xem tất cả
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {groups.length === 0 ? (
                      <div className="my-10 flex justify-center">
                        Không tìm thấy nhóm phù hợp!
                      </div>
                    ) : (
                      groups.map((group) => <SearchGroups group={group} />)
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </LayoutSocial>
  );
};

export default SearchResultPage;
