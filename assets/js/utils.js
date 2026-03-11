function showMessage(message) {
  alert(message);
}

function handleLogout() {
  localStorage.clear();
  window.location.href = "../login/index.html";
}

// hyde lezem tkoun bs hon mch bkl malaf
function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "Unknown";
  }
  return value;
}