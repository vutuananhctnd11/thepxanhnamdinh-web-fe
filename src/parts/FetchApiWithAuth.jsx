import { refreshAccessToken } from "./ApiRefreshToken";

export const fetchWithAuth = async (url, options = {}) => {
  let accessToken = localStorage.getItem("accessToken");

  if (!accessToken) throw new Error("TokenExpiredError");

  let res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: "Bearer " + accessToken,
    },
  });

  if (res.status === 403) {
    console.log("Token hết hạn, đang gọi refresh...");
    const newToken = await refreshAccessToken();
    if (!newToken) {
      throw new Error("TokenExpiredError");
    } else {
      accessToken = localStorage.setItem("accessToken", newToken);
    }

    res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: "Bearer " + newToken,
      },
    });
  }

  return res;
};
