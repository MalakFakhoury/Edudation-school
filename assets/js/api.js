async function apiRequest(endpoint, method = "GET", data = null, token = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json"
    }
  };

  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return await response.json();
}


async function apiRequest(endpoint, method = "GET", data = null, token = null) {
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json"
    }
  };

  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return await response.json();
}