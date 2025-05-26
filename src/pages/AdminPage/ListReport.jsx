import PostReport from "@/components/Admin/ReportManagement/PostReport";
import PostInfo from "@/components/Post/PostInfo";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { message, Pagination } from "antd";
import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 1,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 2,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const ListReport = () => {
  const [listReport, setListReport] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const limit = 6;

  const [messageApi, contextHolder] = message.useMessage();

  const fetchListReports = async () => {
    try {
      const res = await fetchWithAuth(
        `${
          import.meta.env.VITE_API_URL
        }/reports/list?page=${page}&limit=${limit}`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        setListReport(response.data.listResults);
        setTotalPage(response.data.totalPage);
      }
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  const handlePageChange = async (pageNumber) => {
    setPage(pageNumber);
  };

  useEffect(() => {
    fetchListReports();
  }, [page]);

  return (
    <div className="light-mode h-[600px]">
      {contextHolder}
      <Carousel responsive={responsive} className="custom-carousel pl-10">
        {listReport.map((report, index) => (
          <div className="w-[550px] p-4" key={index}>
            <div className="px-4 py-2 bg-white rounded-lg shadow-xl mb-4">
              <div className="flex justify-center font-medium mb-1">
                Thông tin tố cáo
              </div>
              <div className="flex">
                <div className="w-[30%]">
                  <div>Tên đăng nhập: </div>
                  <div>Họ và tên:</div>
                  <div>Lý do:</div>
                </div>
                <div>
                  <div>{report.reporterUsername}</div>
                  <div>{report.reporterFullName}</div>
                  <div>{report.reason}</div>
                </div>
              </div>
            </div>
            <div className="w-full h-full">
              <PostReport
                report={report}
                setListReport={setListReport}
                listReport={listReport}
                messageApi={messageApi}
              />
            </div>
          </div>
        ))}
      </Carousel>
      <Pagination
        defaultCurrent={1}
        total={totalPage * limit}
        pageSize={limit}
        align="end"
        onChange={handlePageChange}
      />
      <br />
    </div>
  );
};

export default ListReport;
