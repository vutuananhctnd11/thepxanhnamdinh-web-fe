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
import dayjs from "dayjs";

const ListMatchResult = () => {
  const [listMatches, setListMatches] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const limit = 5;

  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [selectPlayerId, setSelectPlayerId] = useState(null);

  const [modalNotiProps, setModalNotiProps] = useState({});
  const [isModalNotiOpen, setIsModalNotiOpen] = useState(false);

  const fetchListMatch = async () => {
    try {
      const res = await fetchWithAuth(
        `${
          import.meta.env.VITE_API_URL
        }/matches/list-result?page=${page}&limit=${limit}`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        const matches = response.data.listResults;
        setTotalPage(response.data.totalPage);
        setListMatches(matches);
      }
    } catch (error) {
      console.log("ERROR: ", error);
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
        setListMatches((prevList) =>
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
    fetchListMatch();
  }, [page]);

  return (
    <div className="px-10 py-3">
      {contextHolder}
      <div className="flex justify-between mb-2">
        <div className=" text-2xl m-2 w-[70%]">Kết quả thi đấu</div>
      </div>
      <Table className="rounded-xl shadow-xl overflow-hidden bg-white/80 border-1">
        <TableHeader className="bg-white backdrop-blur-md">
          <TableRow>
            <TableHead className="w-[3%] text-center">STT</TableHead>
            <TableHead className="w-[15%] text-center">Đội nhà</TableHead>
            <TableHead className="w-[2%] text-center"></TableHead>
            <TableHead className="w-[15%] text-center">Đội khách</TableHead>
            <TableHead className="w-[5%] text-center">Vòng</TableHead>
            <TableHead className="w-[15%] text-center">Thời gian</TableHead>
            <TableHead className="w-[5%] text-center">Sân vận động</TableHead>
            <TableHead className="w-[15%] text-center">Thao tác</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {listMatches.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10">
                Không có dữ liệu!
              </TableCell>
            </TableRow>
          )}
          {listMatches.map((match, index) => {
            const date = dayjs(match.matchDate);
            const timeFormatted = date.format("HH[:]mm");
            const dateFormatted = date.format("DD/MM/YYYY");
            return (
              <TableRow
                key={match.matchId}
                className="hover:bg-black/5 transition-all duration-200"
              >
                <TableCell className="text-center">
                  {(page - 1) * limit + index + 1}
                </TableCell>
                <TableCell className="font-medium text-center">
                  <div className="flex flex-col items-center">
                    <img src={match.homeLogo} className="h-15 object-cover" />
                    <div>{match.homeName}</div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="text-2xl font-medium">
                    {match.homeScore + " - " + match.awayScore}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-center">
                  <div className="flex flex-col items-center">
                    <img src={match.awayLogo} className="h-15 object-cover" />
                    <div>{match.awayName}</div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {match.tournament} <br />
                  Vòng {match.round}
                </TableCell>
                <TableCell className="text-center">
                  {timeFormatted} <br /> {dateFormatted}{" "}
                </TableCell>
                <TableCell className="text-center">{match.stadium}</TableCell>

                <TableCell className="text-center space-x-5">
                  <EditOutlined
                    className="text-xl cursor-pointer hover:scale-110 transition-transform duration-300"
                    onClick={() =>
                      navigate(`/admin/players/update/${match.playerId}`)
                    }
                  />
                  <DeleteOutlined
                    className="text-xl cursor-pointer hover:scale-110 transition-transform duration-300"
                    onClick={() => handleDeletePlayer(match.playerId)}
                  />
                </TableCell>
              </TableRow>
            );
          })}
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

export default ListMatchResult;
