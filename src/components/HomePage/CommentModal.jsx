import { fetchWithAuth } from "@/parts/FetchApiWithAuth";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Client } from "@stomp/stompjs";
import { Button, Form, Modal } from "antd";
import { SendHorizonalIcon, SettingsIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import ModalNotification from "@/parts/ModalNotification";

const CommentModal = ({
  userLogin,
  userPostFullName,
  postId,
  isCmtModalOpen,
  setIsCmtModalOpen,
}) => {
  const [form] = Form.useForm();
  const [listComments, setListComments] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 5;
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const stompRef = useRef(null);
  const [isTop, setIsTop] = useState(false);
  const containerRef = useRef(null);

  const [modalNotiProps, setModalNotiProps] = useState({});
  const [isModalNotiOpen, setIsModalNotiOpen] = useState(false);

  const accessToken = localStorage.getItem("accessToken");

  const handleCancel = () => {
    setIsCmtModalOpen(false);
    setPage(1);
    setHasMore(true);
    setEditingCommentId(null);
  };

  //get list comment
  const fetchListComments = async () => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/comments?postId=${postId}&page=${page}&limit=${limit}`,
        {
          method: "GET",
        }
      );
      const response = await res.json();

      if (response.status === "success") {
        const listCmt = response.data;

        if (listCmt.length < limit) {
          setHasMore(false);
        } else {
          setPage((prev) => prev + 1);
        }
        setListComments((prev) => [...prev, ...listCmt]);
      }
    } catch (error) {
      console.log("Có lỗi khi gọi api: ", error);
    }
  };

  useEffect(() => {
    if (isCmtModalOpen) {
      setListComments([]);
      setPage(1);
      setHasMore(true);
      fetchListComments();
    }
  }, [isCmtModalOpen]);

  //check scroll
  const handleScroll = () => {
    const div = containerRef.current;
    if (!div) return;

    if (div.scrollTop <= 10) {
      setIsTop(true);
    } else {
      setIsTop(false);
    }
  };

  //loading data
  const handleLoadMore = async () => {
    fetchListComments();
  };

  //web socket
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
          setListComments((prev) => {
            const exists = prev.some(
              (c) => c.commentId === newComment.commentId
            );
            if (exists) {
              return prev.map((c) =>
                c.commentId === newComment.commentId ? newComment : c
              );
            } else {
              return [newComment, ...prev];
            }
          });
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

  // send comment
  const handleSubmit = (values) => {
    const content = values.content?.trim();
    if (!content) return;

    const payload = {
      postId,
      content,
    };

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

  //update comment
  const handleEditClick = (cmt) => {
    setEditingCommentId(cmt.commentId);
    setEditingContent(cmt.content);
  };

  const handleSaveUpdate = (commentId) => {
    const stompClient = stompRef.current;

    if (!stompClient || !stompClient.connected) {
      console.warn("Chưa kết nối STOMP WebSocket.");
      return;
    }

    stompClient.publish({
      destination: "/app/comment.update",
      body: JSON.stringify({
        commentId,
        content: editingContent,
      }),
    });
    setEditingCommentId(null);
  };

  //delete comment
  const handleDeleteCmt = (commentId) => {
    setModalNotiProps({
      modalTitle: "Xác nhận!",
      modalMessage: "Bạn có chắc chắn muốn xóa bình luận này!",
      type: "warning",
      buttonText: "Xác nhận",
      cancelButtonText: "Hủy",
      onConfirm: () => handleConfirmDeleteCmt(commentId),
    });
    setIsModalNotiOpen(true);
  };

  const handleConfirmDeleteCmt = (commentId) => {
    const stompClient = stompRef.current;

    if (!stompClient || !stompClient.connected) {
      console.warn("Chưa kết nối STOMP WebSocket.");
      return;
    }

    stompClient.publish({
      destination: "/app/comment.delete",
      body: JSON.stringify({ commentId }),
    });

    setModalNotiProps({
      modalTitle: "Thành công!",
      modalMessage: "Xóa bình luận thành công!",
      type: "success",
      buttonText: "Xác nhận",
    });
    setIsModalNotiOpen(true);
  };

  useEffect(() => {
    const stompClient = stompRef.current;

    if (stompClient && stompClient.connected) {
      const subscription = stompClient.subscribe(
        "/topic/comment.deleted",
        (message) => {
          const deletedCommentId = JSON.parse(message.body);

          console.log("Nhận được tin nhắn xóa comment id:", deletedCommentId);

          setListComments((prevComments) =>
            prevComments.filter((c) => c.commentId !== deletedCommentId)
          );
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [stompRef.current?.connected]);

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
            Bài viết của {userPostFullName}
          </div>
        </div>
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="my-4 px-4 max-h-[300px] overflow-y-auto flex flex-col-reverse custom-scroll-bar"
        >
          {/* get list comment */}
          {listComments.map((cmt) => (
            <div key={cmt.commentId}>
              {editingCommentId === cmt.commentId ? (
                <div className="flex items-center my-2 space-x-1">
                  <input
                    type="text"
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="w-full py-2 bg-white/10 rounded-2xl pl-4 pr-4 mr-2 outline-none text-white"
                  />
                  <button
                    className="px-3 py-1 bg-blue-500 rounded-md hover:cursor-pointer scale-80"
                    onClick={() => handleSaveUpdate(cmt.commentId)}
                  >
                    Lưu
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 rounded-md hover:cursor-pointer scale-80"
                    onClick={() => setEditingCommentId(null)}
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                <div className="flex items-center px-4 py-2 mb-3 bg-white/10 rounded-2xl">
                  <Avatar className={"scale-120"}>
                    <AvatarImage
                      src={cmt.avatar || "/defaultavt.png"}
                      className={"object-cover"}
                    />
                  </Avatar>
                  <div className="ml-3 w-full">
                    <div className="w-full flex justify-between">
                      <div className="flex items-end w-full">
                        <div className="font-semibold hover:underline hover:cursor-pointer">
                          {cmt.userFullName}
                        </div>
                        <div className="ml-2 text-white/50 text-[11px]">
                          {cmt.createdAt}
                        </div>
                        {cmt.isUpdate && (
                          <div className="ml-4 text-white/50 text-[11px] underline">
                            Đã chỉnh sửa
                          </div>
                        )}
                      </div>
                      {userLogin.userId === cmt.userId ? (
                        <div className=" flex space-x-2">
                          <SettingsIcon
                            className="scale-60"
                            onClick={() => handleEditClick(cmt)}
                          />
                          <DeleteOutlined
                            onClick={() => handleDeleteCmt(cmt.commentId)}
                          />
                        </div>
                      ) : null}
                    </div>
                    <div className="text-white">{cmt.content}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {isTop && hasMore ? (
            <div
              onClick={handleLoadMore}
              className="text-white/70 hover:text-white underline flex justify-center mb-4 "
            >
              <div> Xem thêm bình luận </div>
            </div>
          ) : null}
        </div>

        {/* create comment */}
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
      <ModalNotification
        isModalOpen={isModalNotiOpen}
        setIsModalOpen={setIsModalNotiOpen}
        {...modalNotiProps}
      />
    </Modal>
  );
};

export default CommentModal;
