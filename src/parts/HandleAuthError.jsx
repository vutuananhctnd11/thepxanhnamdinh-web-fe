export const handleAuthError = (
  error,
  setModalNotiProps,
  setIsModalNotiOpen
) => {
  console.error("Có lỗi khi gọi API: ", error);

  const accessToken = localStorage.getItem("accessToken");
  const currentPath = window.location.pathname;
  const isSocialPath = currentPath.startsWith("/social");

  if (accessToken && isSocialPath) {
    setModalNotiProps({
      modalTitle: "Phiên đăng nhập đã hết hạn",
      modalMessage: "Vui lòng đăng nhập lại!",
      type: "error",
      buttonText: "Đăng nhập",
      redirectPath: "/login",
    });
    setIsModalNotiOpen(true);
    localStorage.clear();
  } else if (isSocialPath) {
    setModalNotiProps({
      modalTitle: "Bạn chưa đăng nhập",
      modalMessage: "Vui lòng đăng nhập để sử dụng TXND FanZone!",
      buttonText: "Đăng nhập",
      redirectPath: "/login",
    });
    setIsModalNotiOpen(true);
  }
};
