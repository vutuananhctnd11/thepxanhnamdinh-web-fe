export async function refreshAccessToken() {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
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
