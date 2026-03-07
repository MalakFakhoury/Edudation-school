function saveAuthData(data) {
  localStorage.setItem("token", data.token || "");
  localStorage.setItem("userId", data.userId || "");
  localStorage.setItem("role", data.role || "");
}

function getToken() {
  return localStorage.getItem("token");
}

function getUserId() {
  return localStorage.getItem("userId");
}

function getRole() {
  return localStorage.getItem("role");
}

function clearAuthData() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
}