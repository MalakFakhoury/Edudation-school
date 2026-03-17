const gradeScaleTableBody = document.getElementById("gradeScaleTableBody");
const gradeScaleSearch = document.getElementById("gradeScaleSearch");

const refreshGradeScaleBtn = document.getElementById("refreshGradeScaleBtn");
const openGradeScaleModalBtn = document.getElementById("openGradeScaleModalBtn");

const gradeScaleModal = document.getElementById("gradeScaleModal");
const gradeScaleBackdrop = document.getElementById("gradeScaleBackdrop");
const closeGradeScaleModalBtn = document.getElementById("closeGradeScaleModalBtn");
const cancelGradeScaleBtn = document.getElementById("cancelGradeScaleBtn");

const gradeScaleForm = document.getElementById("gradeScaleForm");
const gradeScaleNameInput = document.getElementById("gradeScaleNameInput");

let gradeScales = [];

function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "Unknown";
  }
  return value;
}

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

function openModal(modal) {
  if (!modal) return;
  modal.classList.add("show");
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("show");
}

function resetGradeScaleForm() {
  if (!gradeScaleForm) return;
  gradeScaleForm.reset();
}

function setActiveSidebarLink() {
  const sidebarLinks = document.querySelectorAll("#sidebar-container .a-nav__item");

  sidebarLinks.forEach((link) => {
    link.classList.remove("active");

    const href = link.getAttribute("href") || "";
    if (href.includes("generate-grade-scale.html")) {
      link.classList.add("active");
    }
  });
}

function getFilteredGradeScales() {
  const query = gradeScaleSearch.value.trim().toLowerCase();

  if (!query) {
    return gradeScales;
  }

  return gradeScales.filter((item) =>
    String(item.name || "").toLowerCase().includes(query)
  );
}

function renderGradeScaleTable() {
  const rows = getFilteredGradeScales();

  if (!rows.length) {
    gradeScaleTableBody.innerHTML = `
      <tr>
        <td colspan="2" class="a-table-empty">No grade scales yet.</td>
      </tr>
    `;
    return;
  }

  gradeScaleTableBody.innerHTML = rows
    .map((item) => {
      return `
        <tr>
          <td>${formatValue(item.name)}</td>
          <td>${formatValue(item.source)}</td>
        </tr>
      `;
    })
    .join("");
}

function seedMockGradeScales() {
  gradeScales = [
    { name: "Standard Scale", source: "mock" },
    { name: "Secondary Scale", source: "mock" },
  ];
}

async function handleCreateGradeScale(event) {
  event.preventDefault();

  const payload = {
    name: gradeScaleNameInput.value.trim(),
  };

  if (!payload.name) {
    alert("Grade scale name is required.");
    return;
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/generate_grade_scale`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to create grade scale");
    }

    gradeScales.unshift({
      name: payload.name,
      source: "api",
    });

    renderGradeScaleTable();
    closeModal(gradeScaleModal);
    resetGradeScaleForm();
    alert("Grade scale created successfully.");
  } catch (error) {
    console.warn("generate_grade_scale mock fallback used:", error.message);

    gradeScales.unshift({
      name: payload.name,
      source: "mock",
    });

    renderGradeScaleTable();
    closeModal(gradeScaleModal);
    resetGradeScaleForm();
    alert("API failed. Mock grade scale added.");
  }
}

function bindGradeScaleEvents() {
  if (refreshGradeScaleBtn) {
    refreshGradeScaleBtn.addEventListener("click", renderGradeScaleTable);
  }

  if (openGradeScaleModalBtn) {
    openGradeScaleModalBtn.addEventListener("click", () => {
      resetGradeScaleForm();
      openModal(gradeScaleModal);
    });
  }

  if (closeGradeScaleModalBtn) {
    closeGradeScaleModalBtn.addEventListener("click", () => {
      closeModal(gradeScaleModal);
      resetGradeScaleForm();
    });
  }

  if (cancelGradeScaleBtn) {
    cancelGradeScaleBtn.addEventListener("click", () => {
      closeModal(gradeScaleModal);
      resetGradeScaleForm();
    });
  }

  if (gradeScaleBackdrop) {
    gradeScaleBackdrop.addEventListener("click", () => {
      closeModal(gradeScaleModal);
      resetGradeScaleForm();
    });
  }

  if (gradeScaleForm) {
    gradeScaleForm.addEventListener("submit", handleCreateGradeScale);
  }

  if (gradeScaleSearch) {
    gradeScaleSearch.addEventListener("input", renderGradeScaleTable);
  }
}

function initGradeScalePage() {
  if (typeof loadSidebar === "function") {
    loadSidebar();
  }

  setTimeout(setActiveSidebarLink, 100);

  seedMockGradeScales();
  renderGradeScaleTable();
  bindGradeScaleEvents();
}

document.addEventListener("DOMContentLoaded", initGradeScalePage);