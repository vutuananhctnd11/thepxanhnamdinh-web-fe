export async function refreshAccessToken() {
  try {
    const res = await fetch("http://localhost:8080/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
    const response = await res.json();

    if (response.status === "success") {
      localStorage.setItem("accessToken", response.data.token);
      return response.data.token;
    }
  } catch (error) {
    console.error("có lỗi khi gọi api: " + error);
    alert("Có lỗi xảy ra hãy xem console!");
  }
}
