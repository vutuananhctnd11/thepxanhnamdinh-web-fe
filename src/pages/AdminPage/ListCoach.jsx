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
import CoachInfoModal from "@/components/Admin/CoachManagement/CoachInfoModal";

const ListCoach = () => {
  const [listCoaches, setListCoaches] = useState([]);

  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [selectCoachId, setSelectCoachId] = useState(null);

  const [modalNotiProps, setModalNotiProps] = useState({});
  const [isModalNotiOpen, setIsModalNotiOpen] = useState(false);

  const calculateAge = (dob) => {
    return dayjs().diff(dayjs(dob), "year");
  };

  const fetchListCoach = async () => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/coaches`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        const players = response.data;
        setListCoaches(players);
      }
    } catch (error) {
      console.log("Lỗi khi lấy danh sách nhóm: ", error);
    }
  };

  const fetchDeleteCoach = async (coachId) => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/coaches/${coachId}`,
        {
          method: "PATCH",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        setListCoaches((prevList) =>
          prevList.filter((coach) => coach.coachId !== coachId)
        );
        messageApi.success({
          content: "Xóa HLV thành công!",
          duration: 3,
        });
      }
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  const handleDeleteCoach = (coachId) => {
    setModalNotiProps({
      modalTitle: "Xóa HLV",
      modalMessage: "Bạn có chắc chắn muốn xóa HLV này?",
      type: "warning",
      buttonText: "Xác nhận",
      cancelButtonText: "Hủy",
      onConfirm: () => fetchDeleteCoach(coachId),
    });
    setIsModalNotiOpen(true);
  };

  useEffect(() => {
    fetchListCoach();
  }, []);

  return (
    <div className="px-10 py-3">
      {contextHolder}
      <div className="flex justify-between mb-2">
        <div className=" text-2xl m-2 w-[70%]">
          Danh sách ban huấn luyện CLB
        </div>
        <div
          className=" px-4 my-2 bg-blue-500 flex items-center rounded-lg hover:cursor-pointer hover:scale-105 transition"
          onClick={() => navigate("/admin/coaches/create")}
        >
          <PlusOutlined className="scale-100" style={{ color: "white" }} />
          <div className="text-white text-sm ml-2">Thêm HLV</div>
        </div>
      </div>
      <Table className="rounded-xl shadow-xl overflow-hidden bg-white/30">
        <TableHeader className="bg-black/10 backdrop-blur-md">
          <TableRow>
            <TableHead className="w-[60px] text-center">STT</TableHead>
            <TableHead className="w-[15%] text-center">Ảnh đại diện</TableHead>
            <TableHead className="w-[20%]">Họ và tên</TableHead>
            <TableHead className="w-[5%] text-center">Tuổi</TableHead>
            <TableHead className="w-[15%] text-center">Quốc tịch</TableHead>
            <TableHead className="w-[20%] text-center">Vị trí</TableHead>
            <TableHead className="w-[15%] text-center">Thao tác</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {listCoaches?.map((coach, index) => (
            <TableRow
              key={coach.coachId}
              className="hover:bg-black/5 transition-all duration-200"
            >
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell className="text-center">
                <img
                  src={coach.image}
                  className="h-[150px] w-[70%] object-cover rounded-lg mx-auto bg-blue-300"
                  alt="avatar"
                />
              </TableCell>
              <TableCell className="font-medium text-[16px]">
                {coach.firstName} {coach.lastName}
              </TableCell>
              <TableCell className="text-center">
                {calculateAge(coach.dateOfBirth)}
              </TableCell>
              <TableCell className="text-center">{coach.nationality}</TableCell>
              <TableCell className="text-center">{coach.position}</TableCell>

              <TableCell className="text-center space-x-5">
                <EyeOutlined
                  className="text-xl cursor-pointer hover:scale-110 transition-transform duration-300"
                  onClick={() => {
                    setOpenInfoModal(true);
                    setSelectCoachId(coach.coachId);
                    console.log("Player id select: ", coach.playerId);
                  }}
                />
                <EditOutlined
                  className="text-xl cursor-pointer hover:scale-110 transition-transform duration-300"
                  onClick={() =>
                    navigate(`/admin/coaches/update/${coach.coachId}`)
                  }
                />
                <DeleteOutlined
                  className="text-xl cursor-pointer hover:scale-110 transition-transform duration-300"
                  onClick={() => handleDeleteCoach(coach.coachId)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectCoachId && (
        <CoachInfoModal
          openInfoModal={openInfoModal}
          setOpenInfoModal={setOpenInfoModal}
          coachId={selectCoachId}
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

export default ListCoach;
