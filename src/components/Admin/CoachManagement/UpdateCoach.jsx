import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Select,
  Card,
  Row,
  Col,
  Upload,
  message,
} from "antd";
import "../LightMode.css";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { PlusIcon } from "lucide-react";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";

const positions = [
  "Huấn luyện viên trưởng",
  "Trợ lý huấn luyện viên",
  "Chủ tịch",
  "Giám đốc điều hành",
  "Giám đốc kỹ thuật",
  "Huấn luyện viên thủ môn",
  "Huấn luyện viên thể lực",
  "Giám đốc truyền thông",
];

const UpdateCoach = () => {
  const { coachId } = useParams();
  const [coach, setCoach] = useState(null);

  const [form] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFileList, setAvatarFileList] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);

  //get old info
  const fetchOldInfo = async () => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/coaches/${coachId}`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        setCoach(response.data);
      }
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  useEffect(() => {
    fetchOldInfo();
  }, []);

  useEffect(() => {
    if (coach) {
      form.setFieldsValue({
        firstName: coach.firstName,
        lastName: coach.lastName,
        dateOfBirth: dayjs(coach.dateOfBirth, "YYYY-MM-DD"),
        position: coach.position,
        address: coach.address,
        nationality: coach.nationality,
        description: coach.description,
        image: coach.image,
      });
      setAvatarPreview(coach.image);
    }
    // console.log(coach);
  }, [coach]);

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
    form.setFieldsValue({ avatarImage: null });
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);

    try {
      const formattedValues = {
        ...values,
        coachId: coachId,
        dateOfBirth: values.dateOfBirth?.format("YYYY-MM-DD"),
      };

      let image = coach.image;

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
        const linkCloud = fileResponse.data || null;

        image = linkCloud;
      }

      const requestBody = {
        ...formattedValues,
        image,
      };

      console.log("FINAL DATA TO UPDATE: ", requestBody);

      // update coach
      const updatePlayerRes = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/coaches`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const coachResponse = await updatePlayerRes.json();

      if (coachResponse.status === "success") {
        messageApi.success({
          content: `Cập nhật thông tin HLV ${
            coach?.firstName + " " + coach?.lastName
          } thành công!`,
          duration: 3,
        });
        setCoach(coachResponse.data);
      }
    } catch (error) {
      console.error("ERROR: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="light-mode">
      {contextHolder}
      <Card
        title="Thêm thành viên ban huấn luyện CLB"
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
                rules={[
                  { required: true, message: "Vui lòng nhập tên cầu thủ" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="dateOfBirth"
                label="Ngày sinh"
                rules={[{ required: true, message: "Vui lòng nhập ngày sinh" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="position"
                label="Vị trí làm việc"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập vị trí làm việc của HLV",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn vị trí làm việc"
                  popupClassName="light-mode-dropdown"
                  className="light-mode"
                >
                  {positions.map((pos) => (
                    <Option key={pos} value={pos}>
                      {pos}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập địac chỉ của HLV",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="nationality"
                label="Quốc tịch"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập quốc tịch của HLV",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Ảnh toàn thân"
                name={"image"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ảnh toàn thân của HLV",
                  },
                ]}
              >
                <Upload
                  accept="image/.png"
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={handleAvatarChange}
                  fileList={avatarFileList}
                  className="flex justify-center"
                >
                  {avatarPreview ? (
                    <div className="relative w-60 h-100 flex justify-center bg-blue-200 rounded-lg overflow-hidden">
                      <img
                        src={avatarPreview}
                        alt="full body"
                        className="w-full h-full object-cover"
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
                      <div className="w-60 h-100 flex flex-col items-center justify-center bg-gray-100 rounded-lg cursor-pointer">
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

          <Form.Item name="description" label="Giới thiệu ngắn">
            <TextArea
              rows={4}
              maxLength={320}
              placeholder="Nhập giới thiệu ngắn về HLV"
            />
          </Form.Item>

          <Form.Item style={{ textAlign: "right" }}>
            <Button
              type="default"
              htmlType="reset"
              onClick={handleRemoveAvatar}
            >
              Hủy
            </Button>
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
                "Cập nhật"
              )}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateCoach;
