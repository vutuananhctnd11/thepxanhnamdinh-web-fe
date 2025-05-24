import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { message, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import ModalNotification from "@/parts/ModalNotification";
import UserInfoModal from "@/components/Admin/UserManagement/UserInfoModal";
import { KeyRoundIcon } from "lucide-react";

const ListUser = () => {
  const [listUsers, setListUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const limit = 10;

  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [selectUserId, setSelectUserId] = useState(null);

  const [modalNotiProps, setModalNotiProps] = useState({});
  const [isModalNotiOpen, setIsModalNotiOpen] = useState(false);

  const fetchListUser = async () => {
    try {
      const res = await fetchWithAuth(
        `${
          import.meta.env.VITE_API_URL
        }/users/list?page=${page}&limit=${limit}`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        const players = response.data.listResults;
        setTotalPage(response.data.totalPage);
        setListUsers(players);
      }
    } catch (error) {
      console.log("Lỗi khi lấy danh sách nhóm: ", error);
    }
  };

  const handlePageChange = async (pageNumber) => {
    setPage(pageNumber);
  };

  const fetchDeleteUser = async (userId) => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        {
          method: "PATCH",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        setListUsers((prevList) =>
          prevList.filter((user) => user.userId !== userId)
        );
        messageApi.success({
          content: "Xóa tài khoản thành công!",
          duration: 3,
        });
      }
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  const handleDeleteUser = (userId) => {
    setModalNotiProps({
      modalTitle: "Xóa tài khoản",
      modalMessage: (
        <>
          Bạn có chắc chắn muốn xóa tài khoản này?
          <br />
          Hệ thống sẽ gửi email thông báo đến email của tài khoản
        </>
      ),
      type: "warning",
      buttonText: "Xác nhận",
      cancelButtonText: "Hủy",
      onConfirm: () => fetchDeleteUser(userId),
    });
    setIsModalNotiOpen(true);
  };

  useEffect(() => {
    fetchListUser();
  }, [page]);

  return (
    <div className="px-10 py-3">
      {contextHolder}
      <div className="flex justify-between mb-2">
        <div className=" text-2xl font-medium m-2 w-[70%]">
          Danh sách người dùng hệ thống
        </div>
        <div
          className=" px-6 flex items-center rounded-xl hover:cursor-pointer hover:scale-110 transition"
          onClick={() => navigate("/admin/create-user")}
        >
          <PlusCircleOutlined className="scale-130" />
        </div>
      </div>
      <Table className="rounded-xl shadow-xl overflow-hidden bg-white/30">
        <TableHeader className="bg-black/10 backdrop-blur-md">
          <TableRow>
            <TableHead className="w-[5%] text-center">STT</TableHead>
            <TableHead className="w-[25%]">Họ và tên</TableHead>
            <TableHead className="w-[25%]">Địa chỉ email</TableHead>
            <TableHead className="w-[15%] text-center">Vai trò</TableHead>
            <TableHead className="w-[20%] text-center">Thao tác</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {listUsers.map((user, index) => (
            <TableRow
              key={user.playerId}
              className="hover:bg-black/5 transition-all duration-200"
            >
              <TableCell className="text-center">
                {(page - 1) * limit + index + 1}
              </TableCell>
              <TableCell className="font-medium text-[16px]">
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell className="">{user.emailAddress}</TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  {user.roleId == 3 && (
                    <div className="py-1 px-4 bg-blue-200 rounded-2xl">
                      Người dùng
                    </div>
                  )}
                  {user.roleId == 2 && (
                    <div className="py-1 px-4 bg-green-200 rounded-2xl">
                      Người quản lý
                    </div>
                  )}
                  {user.roleId == 1 && (
                    <div className="py-1 px-4 bg-red-200 rounded-2xl">
                      Admin hệ thống
                    </div>
                  )}
                </div>
              </TableCell>

              <TableCell className="text-center">
                <div className="flex justify-center space-x-5">
                  <EyeOutlined
                    className="text-xl cursor-pointer hover:scale-110 transition-transform duration-300"
                    onClick={() => {
                      setOpenInfoModal(true);
                      setSelectUserId(user.userId);
                      //   console.log("Player id select: ", user.userId);
                    }}
                  />
                  <DeleteOutlined
                    className="text-xl cursor-pointer hover:scale-110 transition-transform duration-300"
                    onClick={() => handleDeleteUser(user.userId)}
                  />
                </div>
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
      {selectUserId && (
        <UserInfoModal
          openInfoModal={openInfoModal}
          setOpenInfoModal={setOpenInfoModal}
          userId={selectUserId}
        />
      )}
      <ModalNotification
        isModalOpen={isModalNotiOpen}
        setIsModalOpen={setIsModalNotiOpen}
        {...modalNotiProps}
      />
    </div>
  );
};

export default ListUser;
