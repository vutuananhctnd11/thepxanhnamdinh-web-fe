import { useState } from "react";
import { Users, PlusIcon } from "lucide-react";
import { Button, Form, Modal, Switch, Upload } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { message } from "antd";

const CreateGroupModal = ({ isModalOpen, setIsModalOpen }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [fileList, setFileList] = useState([]);

  const groupTypes = [
    { value: 0, label: "Riêng tư" },
    { value: 1, label: "Công khai" },
    { value: 2, label: "Hội cổ động viên (Cần được CLB phê duyệt)" },
  ];

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

  const onFinish = async (values) => {
    setLoading(true);
    console.log("Giá trị submit:", values);

    //upload file
    try {
      const formData = new FormData();
      fileList.forEach((fileWrapper) => {
        formData.append("file", fileWrapper.originFileObj);
      });
      const fileRes = await fetchWithAuth("http://localhost:8080/cloudinary", {
        method: "POST",
        body: formData,
      });
      const fileResponse = await fileRes.json();
      const avatarImage = fileResponse.data;

      //format to api request
      const combinedData = {
        ...values,
        avatarImage: avatarImage,
      };
      console.log("RESPONSE: ", JSON.stringify(combinedData));

      //call api create group
      const createPostRes = await fetchWithAuth(
        "http://localhost:8080/groups",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(combinedData),
        }
      );
      const createGroupResponse = await createPostRes.json();

      if (createGroupResponse.status === "success") {
        message.success({
          content: "Tạo nhóm thành công ",
          duration: 3,
        });
        setIsModalOpen(false);
      } else {
        message.error({
          content: createGroupResponse.message,
          duration: 3,
        });
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      message.error({
        content: "Lỗi khi tạo nhóm: " + error,
        duration: 3,
      });
      setLoading(false);
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
      <div className="w-full rounded-lg">
        <div className="mb-6 flex justify-center items-center">
          <Users size={24} className="text-blue-400 mr-2" />
          <h1 className="text-2xl font-bold text-white">Tạo nhóm mới</h1>
        </div>

        <Form form={form} onFinish={onFinish}>
          <div className="">
            <div className="flex">
              <div className="text-white mb-2 w-[40%]">Ảnh đại diện nhóm:</div>
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

            <Form.Item
              name={"groupName"}
              rules={[
                {
                  required: true,
                  min: 6,
                  max: 100,
                  message: (
                    <div className="my-1 ml-[100px]">
                      Tên nhóm phải có độ dài 6 - 100 ký tự!
                    </div>
                  ),
                },
              ]}
            >
              <div className="flex w-full items-center">
                <div className="text-white w-[100px]">Tên nhóm *:</div>
                <input
                  type="text"
                  placeholder="Nhập tên nhóm hiển thị công khai"
                  className="w-full px-3 py-2 bg-white/10 rounded-2xl pl-4 pr-4 mr-2 outline-none placeholder-white/60 text-white"
                />
              </div>
            </Form.Item>

            <Form.Item name={"description"}>
              <div className="flex w-full">
                <div className="text-white w-[100px]">Mô tả:</div>
                <textarea
                  placeholder="Mô tả ngắn gọn về nhóm của bạn"
                  rows={4}
                  className="w-full px-3 py-2 overflow-hidden bg-white/10 text-white rounded-xl focus:outline-none focus:ring-1 placeholder-white/60"
                />
              </div>
            </Form.Item>

            <div className="flex w-full mb-6 items-center">
              <div className="text-white w-[100px]">Loại nhóm:</div>
              <Form.Item noStyle name="status">
                <select
                  className="px-5 py-2 bg-white/10 text-white rounded-xl focus:outline-none focus:ring-1 placeholder-white/60"
                  onChange={(e) =>
                    form.setFieldsValue({ status: Number(e.target.value) })
                  }
                >
                  {groupTypes.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-black/70 text-white"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex w-full space-x-3 items-center">
                <div className="text-white w-[150px]">Kiểm duyệt bài đăng:</div>
                <Form.Item
                  name="censorPost"
                  valuePropName="checked"
                  initialValue={true}
                  noStyle
                >
                  <Switch checkedChildren="Có" unCheckedChildren="Không" />
                </Form.Item>
              </div>

              <div className="flex w-full space-x-3 items-center">
                <div className="text-white w-[150px]">
                  Kiểm duyệt thành viên:
                </div>
                <Form.Item
                  name="censorMember"
                  valuePropName="checked"
                  initialValue={true}
                  noStyle
                >
                  <Switch checkedChildren="Có" unCheckedChildren="Không" />
                </Form.Item>
              </div>
            </div>

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
                  "Tạo nhóm"
                )}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default CreateGroupModal;
