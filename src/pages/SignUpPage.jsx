import { Input } from "@/components/ui/input";
import useNagivateLoading from "@/hooks/useNagivateLoading";
import ModalNotification from "@/parts/ModalNotification";
import { Form, Modal } from "antd";
import { useState } from "react";

const SignUpPage = () => {
  const navigate = useNagivateLoading();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [signUpSuccess, setSignUpSuccess] = useState(true);

  const onFinish = async (values) => {
    if (values.password != values.confirmPassword) {
      setSignUpSuccess(false);
      setModalTitle("Đăng ký thất bại");
      setModalMessage("Xác nhận mật khẩu không trùng khớp!");
      setIsModalOpen(true);
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const response = await res.json();

      if (response.status == "success") {
        setSignUpSuccess(true);
        setModalTitle("Thành công");
        setModalMessage("Đăng ký thành công vui lòng đăng nhập");
      } else {
        setSignUpSuccess(false);
        setModalTitle("Đăng ký thất bại");
        setModalMessage(response.message);
      }
      setIsModalOpen(true);
    } catch (error) {
      console.error("có lỗi khi gọi api: " + error);
      alert("Có lỗi xảy ra hayx xem console!");
    }
  };

  return (
    <div className="w-full h-screen relative">
      <img
        src="/signupbg.png"
        className="w-full h-full object-cover absolute opacity-80"
      />
      <div className="w-full h-full flex flex-col justify-center items-center z-5 absolute">
        {/* Tiêu đề */}
        <div className="h-[20%] space-y-2 flex items-center justify-center">
          <img
            src="logo.png"
            className="h-[100px] drop-shadow-[0_10px_20px_rgba(0,139,208,0.8)]"
          />
          <div className="ml-3">
            <div className="text-4xl lg:text-5xl font-extrabold text-[#0897df] flex justify-center">
              TXND FanZone
            </div>
            <div
              className="text-lg md:text-3xl font-bold text-[#0897df] flex justify-center"
              style={{ fontFamily: "Smooch Sans" }}
            >
              Nơi kết nối các cổ động viên
            </div>
          </div>
        </div>
        <div className="h-[80%] w-[90%] sm:w-[60%] lg:w-[40%] mb-10 ">
          <div className="w-full bg-black/50 rounded-xl text-white p-6 flex flex-col items-center">
            <div className="text-2xl uppercase font-bold">
              đăng ký tài khoản
            </div>
            <div className="w-[90%] mt-5">
              <Form name="sign-up-form" layout="vertical" onFinish={onFinish}>
                <div className="flex gap-5 w-full">
                  <Form.Item
                    className="w-[40%]"
                    label={
                      <span className="text-md text-white">Tên đăng nhập</span>
                    }
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên đăng nhập!",
                      },
                      {
                        min: 5,
                        max: 12,
                        message: "Mật khẩu phải có độ dài 5 - 12 ký tự!",
                      },
                    ]}
                  >
                    <Input type="text" className="text-white" />
                  </Form.Item>
                  <Form.Item
                    className="w-[55%]"
                    label={<span className="text-md text-white">Email</span>}
                    name="emailAddress"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập địa chỉ email!",
                      },
                    ]}
                  >
                    <Input type="email" className="text-white" />
                  </Form.Item>
                </div>
                <div className="flex gap-5">
                  <Form.Item
                    className="w-[50%]"
                    label={
                      <span className="text-md text-white">Họ tên đệm</span>
                    }
                    name="firstName"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập họ tên đệm!",
                      },
                    ]}
                  >
                    <Input type="text" className="text-white" />
                  </Form.Item>
                  <Form.Item
                    className="w-[50%]"
                    label={<span className="text-md text-white">Tên</span>}
                    name="lastName"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên!",
                      },
                    ]}
                  >
                    <Input type="text" className="text-white" />
                  </Form.Item>
                </div>
                <div className="flex gap-5">
                  <Form.Item
                    className="w-[50%]"
                    label={<span className="text-md text-white">Mật khẩu</span>}
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mật khẩu!",
                      },
                      {
                        min: 6,
                        max: 18,
                        message: "Mật khẩu phải có độ dài 6 - 18 ký tự!",
                      },
                    ]}
                  >
                    <Input type="password" className="text-white" />
                  </Form.Item>
                  <Form.Item
                    className="w-[50%]"
                    label={
                      <span className="text-md text-white">
                        Xác nhận mật khẩu
                      </span>
                    }
                    name="confirmPassword"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng xác nhận lại mật khẩu!",
                      },
                      {
                        min: 6,
                        max: 18,
                        message: "Mật khẩu phải có độ dài 6 - 18 ký tự!",
                      },
                    ]}
                  >
                    <Input type="password" className="text-white" />
                  </Form.Item>
                </div>
                <button
                  htmlType="submit"
                  className="px-6 py-2 mt-3 w-full bg-blue-500/60 text-white font-semibold
               rounded-lg hover:bg-blue-700/80 transition"
                >
                  Đăng ký ngay
                </button>
              </Form>
              <div
                className="mt-4 flex text-sm justify-center hover:underline hover:cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Bạn đã có tài khoản? Hãy đăng nhập
              </div>
            </div>
            {signUpSuccess ? (
              <ModalNotification
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                modalTitle={modalTitle}
                modalMessage={modalMessage}
                type={"success"}
                buttonText={"Đăng nhập"}
                redirectPath={"/home"}
              />
            ) : (
              <ModalNotification
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                modalTitle={modalTitle}
                modalMessage={modalMessage}
                type={"error"}
                buttonText={"Thử lại"}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
