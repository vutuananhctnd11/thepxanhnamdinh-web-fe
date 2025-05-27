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
import { Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const ListHomeMatch = () => {
  const [listMatches, setListMatches] = useState([]);

  const navigate = useNavigate();

  const fetchListMatch = async () => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/matches/list-home-match`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        const matches = response.data.listResults;
        setListMatches(matches);
      }
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  useEffect(() => {
    fetchListMatch();
  }, []);

  return (
    <div className="px-10 py-3">
      <div className="flex justify-between mb-2">
        <div className=" text-2xl m-2 w-[70%]">Trận đấu sắp tới</div>
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
                Không có trận đấu sân nhà nào sắp tới!
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
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="font-medium text-center">
                  <div className="flex flex-col items-center">
                    <img src={match.homeLogo} className="h-15 object-cover" />
                    <div>{match.homeName}</div>
                  </div>
                </TableCell>
                <TableCell className="text-center text-lg">VS</TableCell>
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
                  <div className="flex justify-center">
                    <div
                      className="px-3 py-1 bg-green-500 text-white rounded-md cursor-pointer hover:scale-110 transition-transform duration-300"
                      onClick={() =>
                        navigate(
                          `/admin/matches/${match.matchId}/start-selling-ticket`
                        )
                      }
                    >
                      Mở bán
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ListHomeMatch;
