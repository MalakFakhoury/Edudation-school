function showMessage(message) {
  alert(message);
}

function handleLogout() {
  localStorage.clear();
  window.location.href = "../login/index.html";
}