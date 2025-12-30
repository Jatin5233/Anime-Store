export function getAccessToken() {
  return typeof window !== "undefined"
    ? localStorage.getItem("accessToken")
    : null;
}

export function clearAuth() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}
