/* eslint-disable no-unused-vars */
import { fetchWithAuth } from "@/parts/FetchApiWithAuth";

const handleFriendAction = async ({
  url,
  method = "GET",
  body = null,
  onSuccess,
  successMessage,
  errorMessage,
  messageApi,
}) => {
  try {
    const res = await fetchWithAuth(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : null,
    });
    const response = await res.json();

    if (response.status === "success") {
      if (onSuccess) onSuccess();
      messageApi.success({ content: successMessage, duration: 3 });
    } else {
      messageApi.error({
        content: errorMessage + ": " + response.message,
        duration: 3,
      });
    }
  } catch (error) {
    console.error("Có lỗi khi gọi API:", error);
    messageApi.error({
      content: "Lỗi khi gọi API: " + error.message,
      duration: 2,
    });
  }
};

export { handleFriendAction };
