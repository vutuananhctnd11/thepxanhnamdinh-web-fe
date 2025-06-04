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
import { Form, InputNumber, message } from "antd";
import dayjs from "dayjs";
import { Check, X } from "lucide-react";

const RequestUpdateMatch = () => {
  const [listMatches, setListMatches] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  const fetchListMatch = async () => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/matches/update-result-request`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        const matches = response.data;
        setListMatches(matches);
      }
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  useEffect(() => {
    fetchListMatch();
  }, []);

  const handleExternalSubmit = (match) => {
    handleUpdateResultMatch(match);
  };

  const handleUpdateResultMatch = async (match) => {
    const values = form.getFieldsValue();
    const payLoad = { ...values, matchId: match.matchId };
    if (values.homeScore == null || values.awayScore == null) {
      messageApi.error("Bạn chưa nhập tỉ số trận đấu!");
    }

    console.log("PAYLOAD: ", JSON.stringify(payLoad));
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/matches/update-result`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payLoad),
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        messageApi.success({
          content: `Cập nhật trận đấu ${match.homeName} VS ${match.awayName} thành công!`,
          duration: 3,
        });
        fetchListMatch();
      }
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  return (
    <div className="px-10 py-3">
      {contextHolder}
      <div className="flex justify-between mb-2">
        <div className=" text-2xl font-medium m-2 w-[70%]">
          Các trận đấu cần cập nhật kết quả
        </div>
      </div>
      <Table className="rounded-xl shadow-xl overflow-hidden bg-white/80 border-1">
        <TableHeader className="bg-white backdrop-blur-md">
          <TableRow>
            <TableHead className="w-[3%] text-center">STT</TableHead>
            <TableHead className="w-[15%] text-center">Đội nhà</TableHead>
            <TableHead
              className={`${isUpdate ? "w-[15%]" : "w-[2%]"} text-center`}
            ></TableHead>
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
              <TableRow key={match.matchId}>
                <TableCell className="text-center">{index + 1}</TableCell>

                <TableCell className="font-medium text-center">
                  <div className="flex flex-col items-center">
                    <img src={match.homeLogo} className="h-15 object-cover" />
                    <div>{match.homeName}</div>
                  </div>
                </TableCell>

                <TableCell className="text-center text-lg">
                  {isUpdate ? (
                    <Form
                      form={form}
                      layout="inline"
                      initialValues={{
                        homeScore: 0,
                        awayScore: 0,
                      }}
                    >
                      <div className="flex">
                        <Form.Item
                          name={"homeScore"}
                          rules={[{ required: true, message: "Nhập tỷ số" }]}
                        >
                          <InputNumber
                            size="large"
                            min={0}
                            defaultValue={0}
                            style={{ width: "60px", fontSize: "18px" }}
                          />
                        </Form.Item>
                        <div className="mx-5 font-bold text-2xl">-</div>
                        <Form.Item
                          name={"awayScore"}
                          rules={[{ required: true, message: "Nhập tỷ số" }]}
                        >
                          <InputNumber
                            size="large"
                            min={0}
                            defaultValue={0}
                            style={{ width: "60px", fontSize: "18px" }}
                          />
                        </Form.Item>
                      </div>
                    </Form>
                  ) : (
                    <span>
                      {match.homeScore} - {match.awayScore}
                    </span>
                  )}
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
                  {timeFormatted} <br /> {dateFormatted}
                </TableCell>
                <TableCell className="text-center">{match.stadium}</TableCell>

                <TableCell className="text-center space-x-5">
                  <div className="w-full flex justify-center">
                    {isUpdate ? (
                      <div className="flex space-x-3">
                        <div
                          className="py-1.5 px-3 bg-green-500 flex justify-center items-center rounded-lg cursor-pointer text-white font-medium hover:bg-green-600"
                          onClick={() => handleExternalSubmit(match)}
                        >
                          <Check className="scale-80" /> Lưu
                        </div>
                        <div
                          className="py-1.5 px-3 bg-red-400 flex justify-center items-center rounded-lg cursor-pointer text-white font-medium hover:bg-red-500"
                          onClick={() => setIsUpdate(false)}
                        >
                          <X className="scale-80" /> Hủy
                        </div>
                      </div>
                    ) : (
                      <div
                        className="py-2 px-3 bg-blue-500/80 rounded-lg cursor-pointer text-white font-medium hover:bg-blue-500"
                        onClick={() => setIsUpdate(true)}
                      >
                        Cập nhật
                      </div>
                    )}
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

export default RequestUpdateMatch;
