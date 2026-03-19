function getToken() {
  return localStorage.getItem("token") || "";
}

function getApiBaseUrl() {
  if (window.CONFIG && window.CONFIG.API_BASE_URL) {
    return window.CONFIG.API_BASE_URL;
  }

  if (window.API_BASE_URL) {
    return window.API_BASE_URL;
  }

  return localStorage.getItem("apiBaseUrl") || "";
}

function getAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "Unknown";
  }
  return value;
}

function setActiveTeacherNav() {
  const links = document.querySelectorAll(".t-nav__item");
  const currentPage = window.location.pathname.split("/").pop();

  links.forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href") || "";
    if (href === currentPage) {
      link.classList.add("active");
    }
  });
}

function setTeacherProfile() {
  const nameEl = document.querySelector(".t-name");
  if (!nameEl) return;

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  nameEl.textContent = user.name || "Teacher Name";
}

function initTeacherLogout() {
  const logoutLink = document.querySelector('.t-nav__item[href="../login/index.html"]');
  if (!logoutLink) return;

  logoutLink.addEventListener("click", () => {
    localStorage.removeItem("token");
  });
}

function initTeacherBase() {
  setActiveTeacherNav();
  setTeacherProfile();
  initTeacherLogout();
}

document.addEventListener("DOMContentLoaded", initTeacherBase);