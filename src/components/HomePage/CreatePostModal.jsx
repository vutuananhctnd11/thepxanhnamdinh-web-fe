/* eslint-disable no-unused-vars */
import { Button, Form, Modal, Select, Upload } from "antd";
import React, { useState } from "react";
import { Avatar } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Textarea } from "../ui/textarea";
import { UploadOutlined } from "@ant-design/icons";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { useParams } from "react-router-dom";

const CreateNewsFeed = ({
  isModalOpen,
  setIsModalOpen,
  setIsUploading,
  setModalNotiProps,
  setIsModalNotiOpen,
}) => {
  const [form] = Form.useForm();
  const fileList = Form.useWatch("medias", form) || [];
  const { groupId } = useParams();

  const userLogin = JSON.parse(localStorage.getItem("userLogin"));

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleStatusChange = (value) => {
    form.setFieldsValue({ status: value });
  };

  const handleFileChange = ({ fileList }) => {
    form.setFieldsValue({ medias: fileList });
    fileList;
  };

  const handleFinish = async (values) => {
    const medias = form.getFieldValue("medias");
    setIsUploading(true);
    setIsModalOpen(false);

    //upload file
    try {
      const formData = new FormData();
      medias.forEach((fileWrapper) => {
        formData.append("files", fileWrapper.originFileObj);
      });
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
        groupId: groupId,
        medias: listUploadMedias.map((media) => ({
          linkCloud: media.linkCloud,
          type: media.type,
        })),
      };
      console.log("RESPONSE: ", JSON.stringify(combinedData));

      //call api create post

      const createPostRes = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(combinedData),
      });
      const createPostResponse = await createPostRes.json();

      if (createPostResponse.status === "success") {
        setModalNotiProps({
          modalTitle: "Thành công!",
          modalMessage: "Đã đăng bài thành công!",
          type: "success",
          buttonText: "Xác nhận",
        });
        setIsModalNotiOpen(true);
      }

      setIsUploading(false);
    } catch (error) {
      console.log("ERROR", error);
      setIsUploading(false);
    }
  };

  return (
    <>
      <Modal
        className="custom-dark-modal"
        open={isModalOpen}
        onCancel={handleCancel}
        width={"45%"}
        footer={null}
      >
        <Form form={form} onFinish={handleFinish}>
          <div>
            <div className="text-white text-lg w-full flex flex-col items-center mb-3">
              Tạo bài viết mới
            </div>
            <div className="flex mb-2 h-10 items-center">
              <Avatar className={"scale-120 mx-2"}>
                <AvatarImage
                  src={userLogin?.avatar || "/defaultavt.png"}
                  className={"object-cover"}
                />
              </Avatar>
              <div className="ml-2 w-full flex space-x-5">
                <div className="flex items-center text-white">
                  {userLogin?.firstName + " " + userLogin?.lastName}
                </div>
                <div className="flex items-center">
                  <Form.Item name="type" initialValue={groupId ? "1" : "0"}>
                    <input type="hidden" />
                  </Form.Item>
                  <Form.Item
                    name="status"
                    initialValue="1"
                    style={{ marginBottom: 0 }}
                  >
                    <Select
                      defaultValue="1"
                      style={{
                        width: 120,
                      }}
                      onChange={handleStatusChange}
                      options={[
                        { value: "1", label: "Công khai" },
                        { value: "0", label: "Bạn bè" },
                      ]}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className="m-1 my-5">
              <Form.Item name="content">
                <Textarea
                  placeholder="Bạn đang nghĩ gì."
                  className="text-white border-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none"
                />
              </Form.Item>
            </div>
            <div className=" bg-white/10 p-1 rounded-sm flex items-center justify-center">
              <Form.Item
                name="medias"
                valuePropName="fileList"
                getValueFromEvent={() => fileList}
                style={{ marginBottom: 0 }}
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  beforeUpload={() => false}
                  onChange={handleFileChange}
                >
                  <UploadOutlined style={{ color: "white", scale: "1.3" }} />
                </Upload>
              </Form.Item>
            </div>
            <div className="flex w-full mt-5">
              <Button type="primary" className="w-full " htmlType="submit">
                Tạo bài viết
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default CreateNewsFeed;
