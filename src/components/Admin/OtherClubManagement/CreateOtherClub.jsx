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

const CreateOtherClub = () => {
  const [form] = Form.useForm();
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFileList, setLogoFileList] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogoChange = ({ fileList }) => {
    const file = fileList[0]?.originFileObj;
    setLogoFileList(fileList);

    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        setLogoPreview(base64);
      };
      reader.readAsDataURL(file);
    } else {
      setLogoFile(null);
      setLogoPreview(null);
    }
  };

  const handleRemoveLogo = (e) => {
    e.stopPropagation();
    setLogoFile(null);
    setLogoPreview(null);
    setLogoFileList([]);
    form.setFieldsValue({ avatar: null });
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);

    //upload file
    try {
      const formData = new FormData();
      formData.append("file", logoFile);
      const fileRes = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/cloudinary`,
        {
          method: "POST",
          body: formData,
        }
      );
      const fileResponse = await fileRes.json();
      const logo = fileResponse.data;

      //format to api request
      const combinedData = {
        ...values,
        logo: logo,
      };
      console.log("RESPONSE: ", combinedData);

      //call api create club
      const createPostRes = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/clubs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(combinedData),
        }
      );
      const createPostResponse = await createPostRes.json();

      if (createPostResponse.status === "success") {
        messageApi.success({
          content:
            "Tạo CLB thành công! Bạn sẽ được chuyển hướng đến danh sách CLB!",
          duration: 3,
        });
        setTimeout(() => {
          navigate("/admin/other-clubs");
        }, 3000);
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
        title="Thêm mới CLB đối thủ"
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
                name="clubName"
                label="Tên đôi bóng"
                rules={[
                  { required: true, message: "Vui lòng nhập tên đội bóng" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="stadium"
                label="Sân vận động (Sân nhà)"
                rules={[
                  { required: true, message: "Vui lòng nhập Sân vận động" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Logo đội bóng"
                name={"avatarImage"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn logo không nền (đuôi file .png)",
                  },
                ]}
              >
                <div className="flex justify-center gap-4">
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={handleLogoChange}
                    fileList={logoFileList}
                  >
                    <div
                      className={`w-40 h-40 relative ${
                        logoPreview ? "border-2" : "bg-gray-100"
                      } flex items-center justify-center cursor-pointer`}
                    >
                      {logoPreview ? (
                        <>
                          <img
                            src={logoPreview}
                            alt="avatar"
                            className=" h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveLogo}
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
            </Col>
          </Row>

          <Form.Item
            style={{ textAlign: "right", marginTop: "20px", marginBottom: 0 }}
          >
            <Button
              type="default"
              htmlType="button"
              style={{ marginRight: "20px" }}
              onClick={() => navigate("/admin/other-clubs")}
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
                "Thêm CLB"
              )}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateOtherClub;
