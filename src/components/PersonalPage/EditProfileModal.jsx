import React, { useEffect } from "react";
import { useState } from "react";
import { Users, PlusIcon, User2 } from "lucide-react";
import { Button, DatePicker, Form, Input, Modal, Switch, Upload } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { message } from "antd";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";

const EditProfileModal = ({
  isModalOpen,
  setIsModalOpen,
  user,
  setIsLoadUser,
}) => {
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [fileList, setFileList] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    const file = newFileList[0]?.originFileObj;
    setFileList(newFileList);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        setImageUrl(base64);
        form.setFieldsValue({ avatar: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImageUrl(null);
    setFileList([]);
    form.setFieldsValue({ avatar: null });
  };

  //get old user profile
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth
          ? dayjs(user.dateOfBirth, "DD/MM/YYYY")
          : null,
        phoneNumber: user.phoneNumber,
        emailAddress: user.emailAddress,
        address: user.address,
      });
      if (user.avatar) {
        setImageUrl(user.avatar);
        setFileList([
          {
            uid: "-1",
            name: "avatar.png",
            status: "done",
            url: user.avatar,
          },
        ]);
      }
    }
  }, [user, isModalOpen]);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      let avatar = "";

      if (fileList.length > 0 && fileList[0].originFileObj) {
        const formData = new FormData();
        formData.append("file", fileList[0].originFileObj);

        const fileRes = await fetchWithAuth(
          `${import.meta.env.VITE_API_URL}/cloudinary`,
          {
            method: "POST",
            body: formData,
          }
        );

        const fileResponse = await fileRes.json();
        avatar = fileResponse.data;
      }

      // Format data
      const combinedData = {
        ...values,
        avatar: avatar,
      };

      console.log("RESPONSE: ", JSON.stringify(combinedData));

      // call api update group
      const updateRes = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(combinedData),
        }
      );

      const updateResponse = await updateRes.json();

      if (updateResponse.status === "success") {
        messageApi.info({
          content: "Sửa thông tin thành công!",
          duration: 3,
        });

        setTimeout(() => {
          setIsModalOpen(false);
        }, 1000);
      } else {
        messageApi.error({
          content: updateResponse.message || "Cập nhật thất bại",
          duration: 3,
        });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật nhóm:", error);
      messageApi.error({
        content: "Lỗi khi cập nhật thông tin người dùng: " + error,
        duration: 2,
      });
    } finally {
      setLoading(false);
      setIsLoadUser(true);
    }
  };

  return (
    <Modal
      className="custom-dark-modal"
      open={isModalOpen}
      onCancel={handleCancel}
      width={"50%"}
      centered={true}
      footer={null}
    >
      {contextHolder}
      <div className="w-full rounded-lg">
        <div className="mb-6 flex justify-center items-center">
          <User2 size={24} className="text-blue-400 mr-2" />
          <h1 className="text-2xl font-bold text-white">
            Chỉnh sửa thông tin của bạn
          </h1>
        </div>

        <Form form={form} onFinish={onFinish}>
          <div className="">
            <div className="flex">
              <div className="text-white mb-2 w-[40%]">Ảnh đại diện:</div>
              <Form.Item name="avatar">
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={handleFileChange}
                  fileList={fileList}
                >
                  {imageUrl ? (
                    <div className="relative w-40 h-40">
                      <img
                        src={imageUrl}
                        alt="Avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        <CloseOutlined />
                      </button>
                    </div>
                  ) : (
                    <div className="w-40 h-40 flex flex-col items-center justify-center bg-white/10 rounded-full cursor-pointer">
                      <PlusIcon className="text-white text-2xl" />
                      <div className="mt-2 text-white text-sm">Chọn ảnh</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </div>

            {/* name */}
            <div className="flex gap-5">
              <Form.Item
                name={"firstName"}
                label={"Họ, tên đệm: "}
                style={{ width: "60%" }}
                rules={[
                  {
                    required: true,
                    message: (
                      <div className="my-1 ml-[100px]">
                        Vui lòng nhập Họ, tên đệm của bạn!
                      </div>
                    ),
                  },
                ]}
              >
                <input
                  type="text"
                  placeholder="Họ, tên đệm"
                  className="w-full px-3 py-2 bg-white/10 rounded-2xl pl-4 pr-4 mr-2 outline-none placeholder-white/60 text-white"
                />
              </Form.Item>
              <Form.Item
                name={"lastName"}
                label={"Tên: "}
                style={{ width: "50%" }}
                rules={[
                  {
                    required: true,
                    message: (
                      <div className="my-1 ml-[100px]">
                        Vui lòng nhập Tên của bạn!
                      </div>
                    ),
                  },
                ]}
              >
                <input
                  type="text"
                  placeholder="Tên của bạn"
                  className="w-full px-3 py-2 bg-white/10 rounded-2xl pl-4 pr-4 mr-2 outline-none placeholder-white/60 text-white"
                />
              </Form.Item>
            </div>

            {/* date of birth, phone number */}
            <div className="flex gap-5">
              <Form.Item
                name="dateOfBirth"
                label="Ngày sinh"
                style={{ width: "50%" }}
                rules={[
                  {
                    required: true,
                    message: (
                      <div className="my-1 ml-[100px]">
                        Vui lòng chọn ngày sinh của bạn!
                      </div>
                    ),
                  },
                ]}
                className=""
              >
                <DatePicker
                  placeholder="Chọn ngày sinh"
                  format="DD/MM/YYYY"
                  className="w-full custom-dark-datepicker"
                  popupClassName="dark-datepicker-popup"
                  allowClear={false}
                />
              </Form.Item>
              <Form.Item
                name={"phoneNumber"}
                label={"SĐT: "}
                style={{ width: "50%" }}
              >
                <input
                  type="text"
                  placeholder="Số điện thoại của bạn"
                  className="w-full px-3 py-2 bg-white/10 rounded-2xl pl-4 pr-4 mr-2 outline-none placeholder-white/60 text-white"
                />
              </Form.Item>
            </div>

            {/* email */}
            <Form.Item
              name={"emailAddress"}
              label={"Email: "}
              rules={[
                {
                  required: true,
                  message: (
                    <div className="my-1 ml-[100px]">
                      Vui lòng nhập Email của bạn!
                    </div>
                  ),
                },
              ]}
            >
              <input
                type="text"
                placeholder="Địa chỉ email của bạn"
                className="w-full px-3 py-2 bg-white/10 rounded-2xl pl-4 pr-4 mr-2 outline-none placeholder-white/60 text-white"
              />
            </Form.Item>

            {/* address */}
            <Form.Item
              name={"address"}
              label={"Địa chỉ: "}
              style={{ marginLeft: "5px" }}
            >
              <input
                type="text"
                placeholder="Địa chỉ của bạn"
                className="w-full px-3 py-2 bg-white/10 rounded-2xl pl-4 pr-4 mr-2 outline-none placeholder-white/60 text-white"
              />
            </Form.Item>

            <div className="flex justify-end mt-8 space-x-4">
              <button
                type="reset"
                className="px-4 py-2 bg-white/10 hover:bg-white/30 rounded-md text-white"
              >
                Hủy
              </button>
              <Button
                type="primary"
                htmlType="submit"
                className={`px-4 py-2 bg-blue-500/80 hover:bg-blue-500 rounded-lg text-white flex items-center ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                    Đang xử lý...
                  </div>
                ) : (
                  "Lưu"
                )}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
