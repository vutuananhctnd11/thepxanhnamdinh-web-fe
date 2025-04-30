import { fetchWithAuth } from "./FetchApiWithAuth";
import { message } from "antd";

async function ApiCheckIsMember(userId, groupId) {
  try {
    const res = await fetchWithAuth(
      `http://localhost:8080/group-members?userId=${userId}&groupId=${groupId}`,
      {
        method: "GET",
      }
    );
    const response = await res.json();

    if (response.status === "success") {
      return response.data;
    }
  } catch (error) {
    message.error({
      content: "Lỗi khi kiểm tra user: " + error,
      duration: 3,
    });
  }
}
export default ApiCheckIsMember;
