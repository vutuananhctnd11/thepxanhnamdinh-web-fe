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
import { useNavigate } from "react-router-dom";
import { Pagination } from "antd";

const ListFanGroup = () => {
  const [listGroups, setListGroups] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const limit = 6;

  const navigate = useNavigate();

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

  useEffect(() => {
    fetchListClubs();
  }, [page]);

  return (
    <div className="px-10 py-3">
      <div className="flex justify-between mb-2">
        <div className=" text-2xl m-2 w-[70%]">Hội cổ động viên chính thức</div>
      </div>
      <Table className="rounded-xl shadow-xl overflow-hidden bg-white/80 border-1">
        <TableHeader className="bg-white backdrop-blur-md">
          <TableRow>
            <TableHead className="w-[5%] text-center">STT</TableHead>
            <TableHead className="w-[30%] text-center">
              Tên hội cổ động viên
            </TableHead>
            <TableHead className="w-[25%] text-center">
              Ngày thành lập
            </TableHead>
            <TableHead className="w-[20%] text-center">Trưởng nhóm</TableHead>
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
              <TableCell className="w-[30%] font-medium text-center">
                {group.groupName}
              </TableCell>
              <TableCell className="w-[25%] text-center">
                {group.createDate}
              </TableCell>
              <TableCell className="w-[20%] text-center">
                <div>{group.createBy}</div>
                <div>{"(" + group.fullName + ")"}</div>
              </TableCell>

              <TableCell className="w-[15%]  space-x-5">
                <div className="flex justify-center">
                  <div
                    className="px-3 py-1 bg-blue-500 text-white rounded-md cursor-pointer hover:scale-110 transition-transform duration-300"
                    onClick={() =>
                      navigate(`/social/groups/detail/${group.groupId}`)
                    }
                  >
                    Xem nhóm
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

export default ListFanGroup;
