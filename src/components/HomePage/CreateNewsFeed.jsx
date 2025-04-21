/* eslint-disable no-unused-vars */
import { Button, Modal, Upload } from "antd";
import React, { useState } from "react";
import { Avatar } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadOutlined } from "@ant-design/icons";
import styled from "styled-components";

const CreateNewsFeed = ({ isModalOpen, setIsModalOpen }) => {
  const [postContent, setPostContent] = useState("");
  const [status, setStatus] = useState("public");
  const [fileList, setFileList] = useState([]);

  const userLogin = JSON.parse(localStorage.getItem("userLogin"));

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
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
        <div>
          <div className="text-white text-lg w-full flex flex-col items-center mb-3">
            Tạo bài viết mới
          </div>
          <div className="flex mb-2 h-10 items-center">
            <Avatar className={"scale-120 mx-2"}>
              <AvatarImage src={userLogin?.avatar} className={"object-cover"} />
            </Avatar>
            <div className="ml-2 w-full flex space-x-5">
              <div className="flex items-center">
                {userLogin?.firstName + " " + userLogin?.lastName}
              </div>
              <div className="text-[12px] text-white/80 flex items-center">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-[100px] h-[28px] px-2 text-[12px] border border-white/20 bg-black/20 text-white rounded-md">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>

                  <SelectContent
                    position="popper"
                    side="bottom"
                    sideOffset={4}
                    style={{ zIndex: 1000 }}
                    className="bg-[#333] text-white text-[12px] w-[120px] p-1"
                  >
                    <SelectGroup>
                      <SelectItem
                        value="public"
                        className="hover:bg-white/20 px-2 py-1 rounded text-[12px]"
                      >
                        Công khai
                      </SelectItem>
                      <SelectItem
                        value="friend"
                        className="hover:bg-white/20 px-2 py-1 rounded text-[12px]"
                      >
                        Bạn bè
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="m-1 my-5">
            <Textarea
              placeholder="Bạn đang nghĩ gì."
              className="border-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none"
            />
          </div>
          <div className=" bg-white/10 p-1 rounded-sm flex items-center justify-center">
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={() => false}
              onChange={handleChange}
            >
              <UploadOutlined style={{ color: "white", scale: "1.3" }} />
            </Upload>
          </div>
          <div className="flex w-full mt-5">
            <Button type="primary" className="w-full">
              Tạo bài viết
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateNewsFeed;

const DarkModalStyle = styled.div`
  .ant-modal-content,
  .ant-modal-header,
  .ant-input,
  .ant-select-selector {
    background-color: #333 !important;
    color: white !important;
  }

  .ant-input,
  .ant-select-selector {
    border-color: #555 !important;
  }

  .ant-modal-title {
    color: white !important;
  }

  .ant-select-selection-placeholder,
  .ant-input::placeholder {
    color: #ccc !important;
  }
`;
