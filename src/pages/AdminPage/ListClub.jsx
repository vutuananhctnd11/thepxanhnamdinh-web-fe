import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { message, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import ModalNotification from "@/parts/ModalNotification";

const ListClub = () => {
  const [listClubs, setListClubs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const limit = 6;

  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [modalNotiProps, setModalNotiProps] = useState({});
  const [isModalNotiOpen, setIsModalNotiOpen] = useState(false);

  const fetchListClubs = async () => {
    try {
      const res = await fetchWithAuth(
        `${
          import.meta.env.VITE_API_URL
        }/clubs/list?page=${page}&limit=${limit}`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        const clubs = response.data.listResults;
        console.log("CLUBS: ", clubs);
        setTotalPage(response.data.totalPage);
        setListClubs(clubs);
      }
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  const handlePageChange = async (pageNumber) => {
    console.log("page: ", pageNumber);
    setPage(pageNumber);
  };

  const fetchDeleteClub = async (clubId) => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/clubs/${clubId}`,
        {
          method: "PATCH",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        setListClubs((prevList) =>
          prevList.filter((club) => club.clubId !== clubId)
        );
        messageApi.success({
          content: "Xóa CLB thành công!",
          duration: 3,
        });
      }
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  const handleDeleteClub = (clubId) => {
    setModalNotiProps({
      modalTitle: "Xóa CLB",
      modalMessage: "Bạn có chắc chắn muốn xóa CLB này?",
      type: "warning",
      buttonText: "Xác nhận",
      cancelButtonText: "Hủy",
      onConfirm: () => fetchDeleteClub(clubId),
    });
    setIsModalNotiOpen(true);
  };

  useEffect(() => {}, [listClubs]);

  useEffect(() => {
    fetchListClubs();
  }, [page]);

  return (
    <div className="px-10 py-3">
      {contextHolder}
      <div className="flex justify-between mb-2">
        <div className=" text-2xl m-2 w-[70%]">Các CLB đối thủ</div>
        <div
          className=" px-6 my-2 flex items-center rounded-lg bg-blue-400 hover:cursor-pointer hover:scale-105 transition"
          onClick={() => navigate("/admin/create-other-club")}
        >
          <PlusOutlined className="scale-130" style={{ color: "white" }} />
        </div>
      </div>
      <Table className="rounded-xl shadow-xl overflow-hidden bg-white/30">
        <TableHeader className="bg-black/10 backdrop-blur-md">
          <TableRow>
            <TableHead className="w-[3%] text-center">STT</TableHead>
            <TableHead className="w-[15%] text-center">Logo</TableHead>
            <TableHead className="w-[25%] text-center">Tên đội </TableHead>
            <TableHead className="w-[15%] text-center">Sân vận động</TableHead>
            <TableHead className="w-[15%] text-center">Thao tác</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {listClubs?.map((club, index) => (
            <TableRow
              key={club.clubId}
              className="hover:bg-black/5 transition-all duration-200"
            >
              <TableCell className="text-center">
                {(page - 1) * limit + index + 1}
              </TableCell>
              <TableCell className="font-medium text-center">
                <div className="flex flex-col items-center">
                  <img src={club.logo} className="h-15 object-cover" />
                </div>
              </TableCell>
              <TableCell className="text-center">{club.clubName}</TableCell>
              <TableCell className="text-center">{club.stadium}</TableCell>

              <TableCell className="text-center space-x-5">
                <EditOutlined
                  className="text-xl cursor-pointer hover:scale-110 transition-transform duration-300"
                  onClick={() =>
                    navigate(`/admin/update-other-club/${club.clubId}`)
                  }
                />
                <DeleteOutlined
                  className="text-xl cursor-pointer hover:scale-110 transition-transform duration-300"
                  onClick={() => handleDeleteClub(club.clubId)}
                />
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
      <ModalNotification
        isModalOpen={isModalNotiOpen}
        setIsModalOpen={setIsModalNotiOpen}
        {...modalNotiProps}
      />
    </div>
  );
};

export default ListClub;
