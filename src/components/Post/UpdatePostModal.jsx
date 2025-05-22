/* eslint-disable no-unused-vars */
import { Button, Form, Modal, Select, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { Avatar } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Textarea } from "../ui/textarea";
import { UploadOutlined } from "@ant-design/icons";
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { useParams } from "react-router-dom";
import { handleAuthError } from "@/parts/HandleAuthError";

const UpdatePostModal = ({
  isModalOpen,
  setIsModalOpen,
  setIsUploading,
  setModalNotiProps,
  setIsModalNotiOpen,
  post,
  setPost,
}) => {
  const [form] = Form.useForm();
  const { groupId } = useParams();

  const userLogin = JSON.parse(localStorage.getItem("userLogin"));

  //load old medias
  const initialFileList = post?.medias.map((media) => ({
    uid: media?.mediaId.toString(),
    name: media?.linkCloud,
    url: media?.linkCloud,
  }));
  const [fileList, setFileList] = useState(initialFileList);

  //load old data
  useEffect(() => {
    if (post) {
      form.setFieldsValue({
        status: post?.status,
        content: post?.content,
        medias: initialFileList,
      });

      setFileList(
        post?.medias.map((media) => ({
          uid: media.mediaId.toString(),
          name: media.linkCloud,
          status: "done",
          url: media.linkCloud,
        }))
      );
    }
  }, [post]);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleStatusChange = (value) => {
    form.setFieldsValue({ status: value });
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
    form.setFieldsValue({ medias: fileList });
  };

  const handleFinish = async (values) => {
    //filter old image
    const oldImages = fileList.filter((file) => !file.originFileObj);
    const newImages = fileList.filter((file) => file.originFileObj);

    setIsUploading(true);
    setIsModalOpen(false);

    //upload file
    let listUploadMedias = [];
    try {
      if (newImages.length !== 0) {
        const formData = new FormData();
        newImages.forEach((fileWrapper) => {
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
        listUploadMedias = fileResponse.data || [];
      }

      //format to api request
      const combinedData = {
        ...values,
        postId: post?.postId,
        groupId: groupId,
        medias: [
          ...oldImages.map((media) => ({
            mediaId: media.uid,
            linkCloud: media.url,
            type: media.type,
          })),
          ...listUploadMedias.map((media) => ({
            linkCloud: media.linkCloud,
            type: media.type,
          })),
        ],
      };
      console.log("RESPONSE: ", JSON.stringify(combinedData));

      //call api update post
      const updatePostRes = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/posts`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(combinedData),
        }
      );
      const updatePostResponse = await updatePostRes.json();

      if (updatePostResponse.status === "success") {
        setModalNotiProps({
          modalTitle: "Thành công!",
          modalMessage: "Đã sửa bài viết thành công!",
          type: "success",
          buttonText: "Xác nhận",
        });
        setIsModalNotiOpen(true);
        fetchGetPost(post?.postId);
      }

      setIsUploading(false);
    } catch (error) {
      console.log("ERROR", error);
      setIsUploading(false);
    }
  };

  //fetch get post by id
  const fetchGetPost = async (postId) => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/posts?postId=${postId}`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        setPost(response.data);
      }
    } catch (error) {
      console.log("Có lỗi khi gọi api: ", error);
      handleAuthError(error, setModalNotiProps, setIsModalNotiOpen);
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
              Chỉnh sửa bài viết
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
                  <Form.Item name="type" initialValue={groupId ? 1 : 0}>
                    <input type="hidden" />
                  </Form.Item>
                  <Form.Item
                    name="status"
                    initialValue="1"
                    style={{ marginBottom: 0 }}
                  >
                    <Select
                      style={{
                        width: 120,
                      }}
                      onChange={handleStatusChange}
                      options={[
                        { value: 1, label: "Công khai" },
                        { value: 0, label: "Bạn bè" },
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
                getValueFromEvent={(e) => e?.fileList}
                style={{ marginBottom: 0 }}
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  beforeUpload={() => false}
                  onChange={handleFileChange}
                >
                  {fileList?.length >= 8 ? null : (
                    <UploadOutlined style={{ color: "white", scale: "1.3" }} />
                  )}
                </Upload>
              </Form.Item>
            </div>
            <div className="flex w-full mt-5">
              <Button type="primary" className="w-full " htmlType="submit">
                Lưu chỉnh sửa
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default UpdatePostModal;
