/* eslint-disable no-unused-vars */
import useNagivateLoading from "@/hooks/useNagivateLoading";
import Modal from "antd/es/modal/Modal";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

const iconMap = {
  success: <CheckCircle className="text-green-500 w-14 h-14 mb-4" />,
  error: <XCircle className="text-red-500 w-14 h-14 mb-4" />,
  warning: <AlertTriangle className="text-yellow-500 w-14 h-14 mb-4" />,
  info: <Info className="text-blue-500 w-14 h-14 mb-4" />,
};

const ModalNotification = ({
  isModalOpen,
  setIsModalOpen,
  modalTitle,
  modalMessage,
  type = "info",
  buttonText,
  redirectPath = null,
  cancelButtonText,
  onConfirm,
}) => {
  const navigate = useNagivateLoading();

  const handleButtonClick = () => {
    if (redirectPath) {
      navigate(redirectPath);
    } else {
      setIsModalOpen(false);
      if (onConfirm) onConfirm();
    }
  };

  const handleCancelClick = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      open={isModalOpen}
      centered
      closable={false}
      footer={null}
      className="w-auto"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center p-4"
      >
        {iconMap[type]}
        <p className="text-xl font-bold mb-2">{modalTitle}</p>
        <p className="text-base text-gray-600 mb-6 text-center">
          {modalMessage}
        </p>
        {cancelButtonText ? (
          <div className="space-x-6">
            <button
              onClick={handleCancelClick}
              className="px-6 py-2 rounded-xl text-gray-700 bg-gray-200 hover:bg-gray-300"
            >
              {cancelButtonText}
            </button>
            <button
              onClick={handleButtonClick}
              className={`px-6 py-2 rounded-xl text-white shadow-lg transition-all
                ${
                  type === "success"
                    ? "bg-green-500 hover:bg-green-600"
                    : type === "error"
                    ? "bg-red-500 hover:bg-red-600"
                    : type === "warning"
                    ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                    : "bg-blue-500 hover:bg-blue-600"
                }
              `}
            >
              {buttonText}
            </button>
          </div>
        ) : (
          <button
            onClick={handleButtonClick}
            className={`px-6 py-2 rounded-xl text-white shadow-lg transition-all
              ${
                type === "success"
                  ? "bg-green-500 hover:bg-green-600"
                  : type === "error"
                  ? "bg-red-500 hover:bg-red-600"
                  : type === "warning"
                  ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                  : "bg-blue-500 hover:bg-blue-600"
              }
            `}
          >
            {buttonText}
          </button>
        )}
      </motion.div>
    </Modal>
  );
};

export default ModalNotification;
