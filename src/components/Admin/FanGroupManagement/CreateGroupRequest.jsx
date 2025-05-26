import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { message, Pagination } from "antd";
import dayjs from "dayjs";
import { handleFriendAction } from "@/parts/HandleApiAction";

const CreateGroupRequest = () => {
  const [listGroups, setListGroups] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const limit = 6;

  const [messageApi, contextHolder] = message.useMessage();

  const formatDate = (dateString) => {
    return dayjs(dateString).format("HH:mm DD/MM/YYYY");
  };

  const fetchListClubs = async () => {
    try {
      const res = await fetchWithAuth(
        `${
          import.meta.env.VITE_API_URL
        }/groups/list-fan-group?page=${page}&limit=${limit}`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        const clubs = response.data.listResults;
        setTotalPage(response.data.totalPage);
        setListGroups(clubs);
      }
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  const handlePageChange = async (pageNumber) => {
    console.log("page: ", pageNumber);
    setPage(pageNumber);
  };

  const handleAcceptCreateGroup = (group) => {
    handleFriendAction({
      url: `${import.meta.env.VITE_API_URL}/groups/aprrove-fan-group/${
        group.groupId
      }`,
      method: "PATCH",
      onSuccess: () => {
        setListGroups(listGroups.filter((g) => g.groupId !== group.groupId));
      },
      successMessage: `Bạn đã phê duyệt Hội CĐV: ${group.groupName} do ${group.createBy} làm trưởng nhóm!`,
      errorMessage: "Thao tác thất bại",
      messageApi: messageApi,
    });
  };

  const handleRejectCreateGroup = (group) => {
    handleFriendAction({
      url: `${import.meta.env.VITE_API_URL}/groups/reject-fan-group/${
        group.groupId
      }`,
      method: "PATCH",
      onSuccess: () => {
        setListGroups(listGroups.filter((g) => g.groupId !== group.groupId));
      },
      successMessage: `Bạn đã xóa yêu cầu tạo Hội CĐV của ${group.fullName}!`,
      errorMessage: "Thao tác thất bại",
      messageApi: messageApi,
    });
  };

  useEffect(() => {}, [listGroups]);

  useEffect(() => {
    fetchListClubs();
  }, [page]);

  return (
    <div className="px-10 py-3">
      {contextHolder}
      <div className="flex justify-between mb-2">
        <div className=" text-2xl m-2 w-[70%]">
          Yêu cầu thành lập hội CĐV mới
        </div>
      </div>
      <Table className="rounded-xl shadow-xl overflow-hidden bg-white/30">
        <TableHeader className="bg-black/10 backdrop-blur-md">
          <TableRow>
            <TableHead className="w-[5%] text-center">STT</TableHead>
            <TableHead className="w-[5%] text-center">Ảnh nhóm</TableHead>
            <TableHead className="w-[30%] text-center">
              Tên hội cổ động viên
            </TableHead>
            <TableHead className="w-[20%] text-center">
              Thời gian yêu cầu
            </TableHead>
            <TableHead className="w-[20%] text-center">Người yêu cầu</TableHead>
            <TableHead className="w-[15%] text-center">Thao tác</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {listGroups.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10">
                Không có dữ liệu!
              </TableCell>
            </TableRow>
          )}
          {listGroups?.map((group, index) => (
            <TableRow
              key={group.groupId}
              className="hover:bg-black/5 transition-all duration-200"
            >
              <TableCell className="w-[5%] text-center">
                {(page - 1) * limit + index + 1}
              </TableCell>
              <TableCell className="text-center">
                <img
                  src={group.avatarImage}
                  className="h-[80px] w-[80px] object-cover rounded-[50%] mx-auto bg-blue-300"
                  alt="avatar"
                />
              </TableCell>
              <TableCell className="w-[30%] font-medium text-center">
                {group.groupName}
              </TableCell>
              <TableCell className="w-[25%] text-center">
                {formatDate(group.createDate)}
              </TableCell>
              <TableCell className="w-[20%] text-center">
                <div>{group.createBy}</div>
                <div>{"(" + group.fullName + ")"}</div>
              </TableCell>

              <TableCell className="w-[25%]">
                <div className="flex justify-center   space-x-5">
                  <div
                    className="px-3 py-1 bg-green-500 text-white rounded-md cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => handleAcceptCreateGroup(group)}
                  >
                    Chấp nhận
                  </div>
                  <div
                    className="px-3 py-1 bg-red-500 text-white rounded-md cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => handleRejectCreateGroup(group)}
                  >
                    Từ chối
                  </div>
                </div>
                {/* <DeleteOutlined
                  className="text-xl cursor-pointer hover:scale-110 transition-transform duration-300"
                  onClick={() => handleDeleteClub(group.clubId)}
                /> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-6">
        <Pagination
          defaultCurrent={1}
          total={totalPage * limit}
          pageSize={limit}
          align="end"
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default CreateGroupRequest;
