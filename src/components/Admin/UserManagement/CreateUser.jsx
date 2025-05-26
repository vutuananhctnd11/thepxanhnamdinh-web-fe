import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Row,
  Col,
  Upload,
  message,
  Checkbox,
} from "antd";
import "../LightMode.css";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { useNavigate } from "react-router-dom";
import { useWatch } from "antd/es/form/Form";
import Password from "antd/es/input/Password";

const CreateUser = () => {
  const [form] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFileList, setAvatarFileList] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const isRandom = useWatch("randomPassword", form);

  const handleAvatarChange = ({ fileList }) => {
    const file = fileList[0]?.originFileObj;
    setAvatarFileList(fileList);

    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        setAvatarPreview(base64);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  };

  const handleRemoveAvatar = (e) => {
    e.stopPropagation();
    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatarFileList([]);
    form.setFieldsValue({ avatar: null });
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);

    //upload file
    try {
      let image = null;
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        const fileRes = await fetchWithAuth(
          `${import.meta.env.VITE_API_URL}/cloudinary`,
          {
            method: "POST",
            body: formData,
          }
        );
        const fileResponse = await fileRes.json();
        image = fileResponse.data;
      }

      //format to api request
      const combinedData = {
        ...values,
        password: values.randomPassword == true ? null : values.password,
        image: image,
      };
      delete combinedData.randomPassword;
      console.log("RESPONSE: ", combinedData);

      //call api create user
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/users/admin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(combinedData),
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        messageApi.success({
          content:
            "Tạo tài khoản thành công! Bạn sẽ được chuyển hướng đến danh sách người dùng!",
          duration: 3,
        });
        messageApi.success({
          content: "Đã gửi email đến " + response.data.emailAddress + "!",
          duration: 3,
        });
        setTimeout(() => {
          navigate("/admin/users");
        }, 3000);
      } else {
        messageApi.error({
          content: response.message,
          duration: 3,
        });
      }
    } catch (error) {
      console.error("ERORR: ", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="light-mode">
      {contextHolder}
      <Card
        title="Tạo tài khoản hệ thống"
        style={{
          maxWidth: 900,
          margin: "2rem auto",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          background: "red",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ goal: 0, assist: 0 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="Tên đăng nhập"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên đăng nhập của tài khoản",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <div className="flex justify-between gap-2">
                <Form.Item
                  name="firstName"
                  label="Họ tên đệm"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ tên đệm" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="lastName"
                  label="Tên"
                  rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                >
                  <Input />
                </Form.Item>
              </div>
              <Form.Item
                name="emailAddress"
                label="Email"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập email",
                  },
                  {
                    type: "email",
                    message: "Email không đúng định dạng!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="roleId"
                label="Vai trò của tài khoản"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập vai trò tài khoản",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn vai trò"
                  popupClassName="light-mode-dropdown"
                  className="light-mode"
                >
                  <Option key={1} value={1}>
                    Admin hệ thống
                  </Option>
                  <Option key={2} value={2}>
                    Người kiểm duyệt
                  </Option>
                  <Option key={3} value={3}>
                    Người dùng
                  </Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={
                  !isRandom
                    ? [
                        {
                          required: true,
                          message:
                            "Vui lòng nhập mật khẩu nếu không tạo ngẫu nhiên",
                        },
                      ]
                    : []
                }
              >
                <Input.Password disabled={isRandom} />
              </Form.Item>
              <Form.Item
                name="randomPassword"
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <Checkbox>Tạo mật khẩu ngẫu nhiên</Checkbox>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Ảnh đại diện" name={"avatar"}>
                <Upload
                  accept="image/.png"
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={handleAvatarChange}
                  fileList={avatarFileList}
                  className="flex justify-center"
                >
                  {avatarPreview ? (
                    <div className="relative w-60 h-60 flex justify-center bg-blue-200 rounded-[50%]">
                      <img
                        src={avatarPreview}
                        alt="full body"
                        className="w-full h-full object-cover rounded-[50%]"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        title="Xoá ảnh"
                      >
                        <CloseOutlined style={{ color: "white" }} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full flex justify-center">
                      <div className="w-60 h-60 rounded-[50%] flex flex-col items-center justify-center bg-gray-100 cursor-pointer">
                        <PlusOutlined
                          style={{ fontSize: 24, color: "#1890ff" }}
                        />
                        <div className="mt-2 text-sm">Chọn ảnh</div>
                      </div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: "right" }}>
            <Button
              type="primary"
              htmlType="submit"
              className={`px-4 py-2 bg-blue-500/80 hover:bg-blue-500 rounded-lg text-white flex items-center ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                  Đang xử lý...
                </div>
              ) : (
                "Tạo tài khoản"
              )}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateUser;
