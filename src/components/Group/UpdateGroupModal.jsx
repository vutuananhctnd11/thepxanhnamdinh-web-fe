import { useEffect, useState } from "react";
import { Users, PlusIcon } from "lucide-react";
import { Button, Form, Modal, Switch, Upload } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { message } from "antd";
import { Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";

const UpdateGroupModal = ({ isModalOpen, setIsModalOpen, groupInfo }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [fileList, setFileList] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();

  //load old data
  useEffect(() => {
    if (groupInfo) {
      // console.log(groupInfo);
      form.setFieldsValue({
        groupName: groupInfo.groupName,
        description: groupInfo.description,
        type: groupInfo.type,
        censorPost: groupInfo.censorPost,
        censorMember: groupInfo.censorMember,
      });

      if (groupInfo.avatarImage) {
        setImageUrl(groupInfo.avatarImage);
        setFileList([
          {
            uid: "-1",
            name: "avatar.png",
            status: "done",
            url: groupInfo.avatarImage,
          },
        ]);
      }
    }
  }, [groupInfo]);

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

  //remove image
  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImageUrl(null);
    setFileList([]);
    form.setFieldsValue({ avatar: null });
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);

      let avatarImage = groupInfo.avatarImage;

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
        avatarImage = fileResponse.data;
      }

      // Format data
      const combinedData = {
        ...values,
        groupId: groupInfo.groupId,
        avatarImage: avatarImage,
      };

      console.log("RESPONSE: ", JSON.stringify(combinedData));

      // call api update group
      const updateRes = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/groups`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(combinedData),
      });

      const updateResponse = await updateRes.json();

      if (updateResponse.status === "success") {
        if (form.getFieldValue("type") == "2") {
          messageApi.info({
            content: "Đã gửi yêu cầu đến CLB chờ phê duyệt!",
            duration: 3,
          });
        } else {
          messageApi.success({
            content: "Sửa thông tin thành công!",
            duration: 3,
          });
        }

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
        content: "Lỗi khi cập nhật nhóm: " + error.message,
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {contextHolder}
      <Modal
        className="custom-dark-modal"
        open={isModalOpen}
        onCancel={handleCancel}
        width={"50%"}
        centered={true}
        footer={null}
        getContainer={false}
      >
        <div className="w-full rounded-lg">
          <div className="mb-6 flex justify-center items-center">
            <Users size={24} className="text-blue-400 mr-2" />
            <h1 className="text-2xl font-bold text-white">Tạo nhóm mới</h1>
          </div>

          <Form form={form} onFinish={onFinish}>
            <div className="">
              <div className="flex">
                <div className="text-white mb-2 w-[40%]">
                  Ảnh đại diện nhóm:
                </div>
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

              <div className="flex w-full mb-2">
                <Form.Item
                  label="Tên nhóm"
                  name="groupName"
                  rules={[
                    {
                      required: true,
                      min: 6,
                      max: 100,
                      message: "Tên nhóm phải có độ dài 6 - 100 ký tự!",
                    },
                  ]}
                  className="w-full"
                >
                  <Input
                    placeholder="Nhập tên nhóm hiển thị công khai"
                    className="bg-white/10 text-white placeholder-white/60 rounded-xl border-none"
                  />
                </Form.Item>
              </div>
              <div className="flex w-full items-start">
                <Form.Item
                  label="Mô tả ngắn"
                  name="description"
                  className="w-full"
                >
                  <TextArea
                    placeholder="Mô tả ngắn gọn về nhóm của bạn"
                    rows={4}
                    className="bg-white/10 text-white placeholder-white/60 rounded-xl border-none"
                  />
                </Form.Item>
              </div>

              <div className="flex items-center mb-6">
                <div className="text-white w-[100px]">Loại nhóm:</div>
                <Form.Item
                  name="type"
                  className="w-full"
                  style={{ marginBottom: 0 }}
                >
                  <select className="px-5 py-2 bg-white/10 text-white rounded-xl focus:outline-none">
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
                  <div className="text-white w-[150px]">
                    Kiểm duyệt bài đăng:
                  </div>
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
                    "Lưu thay đổi"
                  )}
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default UpdateGroupModal;
