import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;
const { Option } = Select;

const positions = [
  "Thủ môn (GK)",
  "Hậu vệ trái (LB)",
  "Hậu vệ phải (RB)",
  "Hậu vệ trung tâm (CB)",
  "Tiền vệ phòng ngự (CDM)",
  "Tiền vệ trung tâm (CM)",
  "Tiền vệ công (CAM)",
  "Tiền vệ cánh trái (LM)",
  "Tiền vệ cánh phải (RM)",
  "Tiền đạo cánh trái (LW)",
  "Tiền đạo cánh phải (RW)",
  "Tiền đạo (ST)",
];

const CreatePlayerForm = () => {
  const [form] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFileList, setAvatarFileList] = useState([]);

  const [fullBodyFile, setFullBodyFile] = useState(null);
  const [fullBodyPreview, setFullBodyPreview] = useState(null);
  const [fullBodyFileList, setFullBodyFileList] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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

  const handleFullBodyChange = ({ fileList }) => {
    const file = fileList[0]?.originFileObj;
    setFullBodyFileList(fileList);

    if (file) {
      setFullBodyFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        setFullBodyPreview(base64);
      };
      reader.readAsDataURL(file);
    } else {
      setFullBodyFile(null);
      setFullBodyPreview(null);
    }
  };

  const handleRemoveAvatar = (e) => {
    e.stopPropagation();
    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatarFileList([]);
    form.setFieldsValue({ avatar: null });
  };

  const handleRemoveFullBody = (e) => {
    e.stopPropagation();
    setFullBodyFile(null);
    setFullBodyPreview(null);
    setFullBodyFileList([]);
    form.setFieldsValue({ fullBody: null });
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    const formattedValues = {
      ...values,
      dateOfBirth: values.dateOfBirth?.format("YYYY-MM-DD"),
    };
    console.log("DATA: ", formattedValues);

    //upload file
    try {
      const formData = new FormData();
      formData.append("files", avatarFile);
      formData.append("files", fullBodyFile);
      const fileRes = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/cloudinary/list-file`,
        {
          method: "POST",
          body: formData,
        }
      );
      const fileResponse = await fileRes.json();
      const listUploadMedias = fileResponse.data;

      //format to api request
      const combinedData = {
        ...values,
        avatarImage: listUploadMedias[0].linkCloud || null,
        fullBodyImage: listUploadMedias[1].linkCloud || null,
      };
      console.log("RESPONSE: ", combinedData);

      //call api create player
      const createPostRes = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/players`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(combinedData),
        }
      );
      const response = await createPostRes.json();

      if (response.status === "success") {
        messageApi.success({
          content:
            "Tạo cầu thủ thành công! Bạn sẽ được chuyển hướng đến danh sách cầu thủ!",
          duration: 3,
        });
        setTimeout(() => {
          navigate("/admin/players");
        }, 3000);
      } else {
        messageApi.error({
          content: "Có lỗi xảy ra: " + response.message,
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
        title="Thêm mới cầu thủ trong CLB"
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
                name="nameInShirt"
                label="Tên trên áo đấu"
                rules={[
                  { required: true, message: "Vui lòng nhập tên trên áo đấu" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="shirtNumber"
                label="Số áo thi đấu"
                rules={[
                  { required: true, message: "Vui lòng nhập số áo thi đấu" },
                ]}
              >
                <InputNumber min={1} max={99} style={{ width: "100%" }} />
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
                label="Vị trí thi đấu"
                rules={[
                  { required: true, message: "Vui lòng chọn vị trí thi đấu" },
                ]}
              >
                <Select
                  placeholder="Chọn vị trí thi đấu"
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
                name="nationality"
                label="Quốc tịch"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập quốc tịch của cầu thủ",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <div className="flex justify-between">
                <Form.Item name="height" label="Chiều cao (m)">
                  <InputNumber min={0} max={2.5} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item name="weight" label="Cân nặng (kg)">
                  <InputNumber min={0} max={120} style={{ width: "100%" }} />
                </Form.Item>
              </div>

              <div className="flex justify-between">
                <Form.Item name="goal" label="Số bàn thắng">
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item name="assist" label="Số kiến tạo">
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </div>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Ảnh đại diện"
                name={"avatarImage"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ảnh đại diện của cầu thủ",
                  },
                ]}
              >
                <div className="flex justify-center gap-4">
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={handleAvatarChange}
                    fileList={avatarFileList}
                  >
                    <div
                      className={`w-40 h-40 relative ${
                        avatarPreview ? "bg-blue-300" : "bg-gray-100"
                      } rounded-[50%] flex items-center justify-center cursor-pointer`}
                    >
                      {avatarPreview ? (
                        <>
                          <img
                            src={avatarPreview}
                            alt="avatar"
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
                        </>
                      ) : (
                        <>
                          <PlusOutlined
                            style={{ fontSize: 24, color: "#1890ff" }}
                          />
                          <div className="text-sm mt-1">Chọn ảnh</div>
                        </>
                      )}
                    </div>
                  </Upload>
                </div>
              </Form.Item>

              <Form.Item
                label="Ảnh toàn thân"
                name={"fullBodyImage"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ảnh toàn thân của cầu thủ",
                  },
                ]}
              >
                <Upload
                  accept="image/.png"
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={handleFullBodyChange}
                  fileList={fullBodyFileList}
                  className="flex justify-center"
                >
                  {fullBodyPreview ? (
                    <div className="relative w-60 h-100 flex justify-center bg-blue-200 rounded-lg overflow-hidden">
                      <img
                        src={fullBodyPreview}
                        alt="full body"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveFullBody}
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
              placeholder="Nhập giới thiệu ngắn về cầu thủ"
            />
          </Form.Item>

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
                "Thêm cầu thủ"
              )}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreatePlayerForm;
