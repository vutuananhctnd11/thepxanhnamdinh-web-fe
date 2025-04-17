import React from "react";
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

const listPlayers = [
  {
    playerId: "1",
    firstName: "Nguyễn Xuân",
    lastName: "Son",
    age: "32",
    nationality: "Việt Nam",
    shirtNumber: "14",
    position: "Tiền đại mục tiêu",
    avatarImage: "/sonavt.png",
  },
  {
    playerId: "2",
    firstName: "Nguyễn Xuân",
    lastName: "Son",
    age: "32",
    nationality: "Việt Nam",
    shirtNumber: "14",
    position: "Tiền đại mục tiêu",
    avatarImage: "/sonavt.png",
  },
  {
    playerId: "3",
    firstName: "Nguyễn Xuân",
    lastName: "Son",
    age: "32",
    nationality: "Việt Nam",
    shirtNumber: "14",
    position: "Tiền đại mục tiêu",
    avatarImage: "/sonavt.png",
  },
];

const ListPlayer = () => {
  return (
    <div className="p-10 text-white">
      <div className="flex justify-between mb-4">
        <div className="text-white text-xl m-2 w-[70%]">
          Danh sách cầu thủ thuộc biên chế CLB
        </div>
        <div className=" px-6 bg-white/20 flex items-center rounded-xl hover:cursor-pointer hover:scale-105 transition">
          <PlusOutlined className="scale-130" />
        </div>
      </div>
      <Table className="rounded-xl shadow-xl overflow-hidden border border-white/10">
        <TableHeader className="bg-white/10 backdrop-blur-md">
          <TableRow>
            <TableHead className="w-[60px] text-white text-center">
              STT
            </TableHead>
            <TableHead className="text-white">Họ và tên</TableHead>
            <TableHead className="text-white text-center">Tuổi</TableHead>
            <TableHead className="text-white text-center">Quốc tịch</TableHead>
            <TableHead className="text-white text-center">Số áo</TableHead>
            <TableHead className="text-white">Vị trí</TableHead>
            <TableHead className="text-white text-center">Avatar</TableHead>
            <TableHead className="text-white text-center">Thao tác</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {listPlayers.map((player, index) => (
            <TableRow
              key={player.playerId}
              className="hover:bg-white/10 transition-all duration-200"
            >
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell className="font-medium">
                {player.firstName} {player.lastName}
              </TableCell>
              <TableCell className="text-center">{player.age}</TableCell>
              <TableCell className="text-center">
                {player.nationality}
              </TableCell>
              <TableCell className="text-center">
                {player.shirtNumber}
              </TableCell>
              <TableCell>{player.position}</TableCell>
              <TableCell className="text-center">
                <img
                  src={player.avatarImage}
                  className="h-[60px] w-[60px] object-cover rounded-2xl mx-auto"
                  alt="avatar"
                />
              </TableCell>
              <TableCell className="text-center space-x-5">
                <EyeOutlined className="scale-130 " />
                <EditOutlined className="scale-130 " />
                <DeleteOutlined className="scale-130 " />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ListPlayer;
