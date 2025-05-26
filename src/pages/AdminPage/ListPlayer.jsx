import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { message, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import PlayerInfoModal from "@/components/Admin/PlayerManagement/PlayerInfoModal";
import ModalNotification from "@/parts/ModalNotification";

const ListPlayer = () => {
  const [listPlayers, setListPlayers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const limit = 5;

  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [selectPlayerId, setSelectPlayerId] = useState(null);

  const [modalNotiProps, setModalNotiProps] = useState({});
  const [isModalNotiOpen, setIsModalNotiOpen] = useState(false);

  const fetchListPlayer = async () => {
    try {
      const res = await fetchWithAuth(
        `${
          import.meta.env.VITE_API_URL
        }/players/list?page=${page}&limit=${limit}`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        const players = response.data.listResults;
        setTotalPage(response.data.totalPage);
        setListPlayers(players);
      }
    } catch (error) {
      console.log("Lỗi khi lấy danh sách nhóm: ", error);
    }
  };

  const handlePageChange = async (pageNumber) => {
    console.log("page: ", pageNumber);
    setPage(pageNumber);
  };

  const fetchDeletePlayer = async (playerId) => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/players/${playerId}`,
        {
          method: "PATCH",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        setListPlayers((prevList) =>
          prevList.filter((player) => player.playerId !== playerId)
        );
        messageApi.success({
          content: "Xóa cầu thủ thành công!",
          duration: 3,
        });
      }
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  const handleDeletePlayer = (playerId) => {
    setModalNotiProps({
      modalTitle: "Xóa cầu thủ",
      modalMessage: "Bạn có chắc chắn muốn xóa cầu thủ này?",
      type: "warning",
      buttonText: "Xác nhận",
      cancelButtonText: "Hủy",
      onConfirm: () => fetchDeletePlayer(playerId),
    });
    setIsModalNotiOpen(true);
  };
  useEffect(() => {
    fetchListPlayer();
  }, [page]);

  return (
    <div className="px-10 py-3">
      {contextHolder}
      <div className="flex justify-between mb-2">
        <div className=" text-2xl m-2 w-[70%]">
          Danh sách cầu thủ thuộc biên chế CLB
        </div>
        <div
          className=" px-4 my-2 bg-blue-500 flex items-center rounded-lg hover:cursor-pointer hover:scale-105 transition"
          onClick={() => navigate("/admin/players/create")}
        >
          <PlusOutlined className="scale-100" style={{ color: "white" }} />
          <div className="text-white text-sm ml-2">Thêm cầu thủ</div>
        </div>
      </div>
      <Table className="rounded-xl shadow-xl overflow-hidden bg-white/30">
        <TableHeader className="bg-black/10 backdrop-blur-md">
          <TableRow>
            <TableHead className="w-[60px] text-center">STT</TableHead>
            <TableHead className="w-[15%] text-center">Ảnh đại diện</TableHead>
            <TableHead className="w-[25%]">Họ và tên</TableHead>
            <TableHead className="w-[5%] text-center">Tuổi</TableHead>
            <TableHead className="w-[15%] text-center">Quốc tịch</TableHead>
            <TableHead className="w-[5%] text-center">Số áo</TableHead>
            <TableHead className="w-[15%] text-center">Vị trí</TableHead>
            <TableHead className="w-[15%] text-center">Thao tác</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {listPlayers.map((player, index) => (
            <TableRow
              key={player.playerId}
              className="hover:bg-black/5 transition-all duration-200"
            >
              <TableCell className="text-center">
                {(page - 1) * limit + index + 1}
              </TableCell>
              <TableCell className="text-center">
                <img
                  src={player.avatarImage}
                  className="h-[80px] w-[80px] object-cover rounded-[50%] mx-auto bg-blue-300"
                  alt="avatar"
                />
              </TableCell>
              <TableCell className="font-medium text-[16px]">
                {player.firstName} {player.lastName}
              </TableCell>
              <TableCell className="text-center">{player.age}</TableCell>
              <TableCell className="text-center">
                {player.nationality}
              </TableCell>
              <TableCell className="text-center text-[16px] font-medium">
                {player.shirtNumber}
              </TableCell>
              <TableCell className="text-center">{player.position}</TableCell>

              <TableCell className="text-center space-x-5">
                <EyeOutlined
                  className="text-xl cursor-pointer hover:scale-110 transition-transform duration-300"
                  onClick={() => {
                    setOpenInfoModal(true);
                    setSelectPlayerId(player.playerId);
                    console.log("Player id select: ", player.playerId);
                  }}
                />
                <EditOutlined
                  className="text-xl cursor-pointer hover:scale-110 transition-transform duration-300"
                  onClick={() =>
                    navigate(`/admin/players/update/${player.playerId}`)
                  }
                />
                <DeleteOutlined
                  className="text-xl cursor-pointer hover:scale-110 transition-transform duration-300"
                  onClick={() => handleDeletePlayer(player.playerId)}
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
      {selectPlayerId && (
        <PlayerInfoModal
          openInfoModal={openInfoModal}
          setOpenInfoModal={setOpenInfoModal}
          playerId={selectPlayerId}
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

export default ListPlayer;
