import { Avatar, AvatarImage } from "../ui/avatar";
import { Client } from "@stomp/stompjs";
import { Button, Form, Modal } from "antd";
import { SendHorizonal, SendHorizonalIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";

const CommentModal = ({
  userLogin,
  postId,
  isCmtModalOpen,
  setIsCmtModalOpen,
}) => {
  const [form] = Form.useForm();
  const [comments, setComments] = useState([]);
  const stompRef = useRef(null);
  const accessToken = localStorage.getItem("accessToken");

  const handleCancel = () => {
    setIsCmtModalOpen(false);
  };

  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("WebSocket connected");
        client.subscribe(`/topic/post/${postId}`, (message) => {
          const newComment = JSON.parse(message.body);
          setComments((prev) => [...prev, newComment]);
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    client.activate();

    stompRef.current = client;

    return () => client.deactivate();
  }, [postId]);

  const handleSubmit = (values) => {
    const content = values.content?.trim();
    console.log("content: ", content);
    if (!content) return;

    const payload = {
      postId,
      content,
    };
    console.log("payload: ", payload);

    const stompClient = stompRef.current;

    if (!stompClient || !stompClient.connected) {
      console.warn("Chưa kết nối STOMP WebSocket.");
      return;
    }

    stompClient.publish({
      destination: "/app/comment.send",
      body: JSON.stringify(payload),
    });

    form.resetFields();
  };

  return (
    <Modal
      className="custom-dark-modal"
      open={isCmtModalOpen}
      onCancel={handleCancel}
      width={"45%"}
      footer={null}
    >
      <div className="flex flex-col w-full  mt-3 mb-0">
        <div className="flex justify-center mb-4">
          <div className="text-lg font-semibold">
            Bài viết của {userLogin.lastName}
          </div>
        </div>
        {/* List comment */}
        <ul className="my-4 px-4 max-h-[500px] overflow-y-auto custom-scroll-bar space-y-3">
          {comments.map((cmt, index) => (
            <li
              key={index}
              classNam
              e="bg-white/5 rounded-xl p-3 text-white backdrop-blur-sm"
            >
              <div className="flex items-center px-4 py-2 bg-white/10 rounded-2xl">
                <Avatar className={"scale-120"}>
                  <AvatarImage
                    src={cmt.avatar || "/defaultavt.png"}
                    className={"object-cover"}
                  />
                </Avatar>
                <div className="ml-3">
                  <div className="flex items-end">
                    <div className="font-semibold underline">
                      {cmt.userFullName}
                    </div>
                    <div className="ml-2 text-white/50 text-[11px]">
                      {cmt.createdAt}
                    </div>
                  </div>

                  <div className="text-white">{cmt.content}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Form form={form} onFinish={handleSubmit} className="w-full">
          <div className="flex space-x-3 px-4">
            <Avatar className="scale-120">
              <AvatarImage
                src={userLogin?.avatar || "/defaultavt.png"}
                className="object-cover"
              />
            </Avatar>

            <Form.Item
              name="content"
              className="flex-1"
              style={{ width: "100%", marginBottom: "0" }}
            >
              <input
                type="text"
                placeholder="Nhập bình luận của bạn..."
                className="w-full h-8 bg-white/10 rounded-2xl pl-4 pr-4 mr-2 outline-none placeholder-white/30 text-white"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: "0" }}>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-blue-500 hover:bg-blue-600 scale-80"
              >
                <SendHorizonalIcon className="scale-80" />
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default CommentModal;
