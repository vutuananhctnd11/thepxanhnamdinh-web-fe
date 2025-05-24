import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { Modal } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

const UserInfoModal = ({ openInfoModal, setOpenInfoModal, userId }) => {
  const [user, setUser] = useState(null);

  const calculateAge = (dob) => {
    return dayjs().diff(dayjs(dob), "year");
  };

  const fetchUserInfor = async () => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/users?userId=${userId}`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        setUser(response.data);
      }
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  useEffect(() => {
    fetchUserInfor();
  }, [userId]);

  return (
    <div>
      <Modal
        open={openInfoModal}
        onCancel={() => setOpenInfoModal(false)}
        width={"50%"}
        centered={true}
        footer={null}
      >
        <div className="w-full h-full relative pl-8 py-3 overflow-hidden">
          <div className="w-full">
            <p className=" font-bold uppercase text-[30px] mb-3">
              {user?.firstName + " " + user?.lastName}
            </p>
            <div className="w-[120px] mb-2">
              {user?.roleId == 3 && (
                <div className="py-1 px-2 flex justify-center bg-blue-200 rounded-2xl">
                  Người dùng
                </div>
              )}
              {user?.roleId == 2 && (
                <div className="py-1 px-2 flex justify-center bg-green-200 rounded-2xl">
                  Người kiểm duyệt
                </div>
              )}
              {user?.roleId == 1 && (
                <div className="py-1 px-2 flex justify-center bg-red-200 rounded-2xl">
                  Admin hệ thống
                </div>
              )}
            </div>
            <div className="w-[60%] text-[15px]">
              <div className="space-y-1.5">
                <p>Tuổi: {calculateAge(user?.dateOfBirth)}</p>
                <p>Ngày sinh: {user?.dateOfBirth}</p>
                <p>Email: {user?.emailAddress}</p>
                <p>SĐT: {user?.phoneNumber}</p>
                <p>Địa chỉ: {user?.address}</p>
              </div>
            </div>
          </div>
          <div className="w-[40%] h-[60%] absolute bottom-0 right-0">
            <img
              src={user?.avatar || "/defaultavt.png"}
              className=" h-full object-cover opacity-90 drop-shadow-[0px_00px_10px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserInfoModal;
