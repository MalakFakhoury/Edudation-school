const schoolSectionsTableBody = document.getElementById("schoolSectionsTableBody");
const schoolSectionsSearch = document.getElementById("schoolSectionsSearch");

const refreshSchoolSectionsBtn = document.getElementById("refreshSchoolSectionsBtn");
const addSchoolSectionBtn = document.getElementById("addSchoolSectionBtn");

const addSchoolSectionModal = document.getElementById("addSchoolSectionModal");
const addSchoolSectionBackdrop = document.getElementById("addSchoolSectionBackdrop");
const closeSchoolSectionModalBtn = document.getElementById("closeSchoolSectionModalBtn");
const cancelSchoolSectionBtn = document.getElementById("cancelSchoolSectionBtn");

const schoolSectionForm = document.getElementById("schoolSectionForm");
const schoolSectionLevelHashInput = document.getElementById("schoolSectionLevelHashInput");
const schoolSectionNameInput = document.getElementById("schoolSectionNameInput");

let schoolSectionsGrouped = [];
let schoolSectionsRows = [];

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

function resetSchoolSectionForm() {
  if (!schoolSectionForm) return;
  schoolSectionForm.reset();
}

function setActiveSidebarLink() {
  const sidebarLinks = document.querySelectorAll("#sidebar-container .a-nav__item");

  sidebarLinks.forEach((link) => {
    link.classList.remove("active");

    const href = link.getAttribute("href") || "";
    if (href.includes("school-sections.html")) {
      link.classList.add("active");
    }
  });
}

function flattenSchoolSections(data) {
  const rows = [];

  data.forEach((group) => {
    const gradeHash = group.grade_hash || group.level_hash || "";
    const gradeName = group.grade_name || group.level_name || group.name || "";
    const sections = Array.isArray(group.sections) ? group.sections : [];

    sections.forEach((section) => {
      rows.push({
        grade_hash: gradeHash,
        grade_name: gradeName,
        section_hash: section.section_hash || section.hash || "",
        section_name: section.section_name || section.name || "",
      });
    });
  });

  return rows;
}

function getFilteredRows() {
  const query = schoolSectionsSearch.value.trim().toLowerCase();

  if (!query) {
    return schoolSectionsRows;
  }

  return schoolSectionsRows.filter((row) => {
    return (
      String(row.grade_hash || "").toLowerCase().includes(query) ||
      String(row.grade_name || "").toLowerCase().includes(query) ||
      String(row.section_hash || "").toLowerCase().includes(query) ||
      String(row.section_name || "").toLowerCase().includes(query)
    );
  });
}

function renderSchoolSectionsTable() {
  const rows = getFilteredRows();

  if (!rows.length) {
    schoolSectionsTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="a-table-empty">No school sections found.</td>
      </tr>
    `;
    return;
  }

  schoolSectionsTableBody.innerHTML = rows
    .map((row) => {
      return `
        <tr>
          <td>${formatValue(row.grade_hash)}</td>
          <td>${formatValue(row.grade_name)}</td>
          <td>${formatValue(row.section_hash)}</td>
          <td>${formatValue(row.section_name)}</td>
          <td>
            <div class="a-table-actions">
              <button
                class="a-action-btn a-action-btn--danger delete-school-section-btn"
                type="button"
                data-level-hash="${row.grade_hash}"
                data-section-hash="${row.section_hash}"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

async function fetchSchoolSections() {
  try {
    const response = await fetch(`${getApiBaseUrl()}/get_school_sections_grouped`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch school sections");
    }

    const data = await response.json();
    schoolSectionsGrouped = Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.warn("get_school_sections_grouped mock fallback used:", error.message);

    schoolSectionsGrouped = [
      {
        grade_hash: "grade_001",
        grade_name: "Grade 10",
        sections: [
          { section_hash: "sec_001", section_name: "A" },
          { section_hash: "sec_002", section_name: "B" },
        ],
      },
      {
        grade_hash: "grade_002",
        grade_name: "Grade 11",
        sections: [
          { section_hash: "sec_003", section_name: "A" },
        ],
      },
    ];
  }

  schoolSectionsRows = flattenSchoolSections(schoolSectionsGrouped);
  renderSchoolSectionsTable();
}

async function handleAddSchoolSection(event) {
  event.preventDefault();

  const payload = {
    level_hash: schoolSectionLevelHashInput.value.trim(),
    name: schoolSectionNameInput.value.trim(),
  };

  if (!payload.level_hash || !payload.name) {
    alert("Please fill all required fields.");
    return;
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/add_school_section`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to add school section");
    }

    await fetchSchoolSections();
    closeModal(addSchoolSectionModal);
    resetSchoolSectionForm();
    alert("School section added successfully.");
  } catch (error) {
    console.warn("add_school_section mock fallback used:", error.message);

    const existingGroup = schoolSectionsGrouped.find(
      (group) => (group.grade_hash || group.level_hash) === payload.level_hash
    );

    if (existingGroup) {
      existingGroup.sections = Array.isArray(existingGroup.sections) ? existingGroup.sections : [];
      existingGroup.sections.push({
        section_hash: `mock_${Date.now()}`,
        section_name: payload.name,
      });
    } else {
      schoolSectionsGrouped.push({
        grade_hash: payload.level_hash,
        grade_name: payload.level_hash,
        sections: [
          {
            section_hash: `mock_${Date.now()}`,
            section_name: payload.name,
          },
        ],
      });
    }

    schoolSectionsRows = flattenSchoolSections(schoolSectionsGrouped);
    renderSchoolSectionsTable();
    closeModal(addSchoolSectionModal);
    resetSchoolSectionForm();
    alert("API failed. Mock section added.");
  }
}

async function handleSchoolSectionsTableClick(event) {
  const deleteBtn = event.target.closest(".delete-school-section-btn");
  if (!deleteBtn) return;

  const levelHash = deleteBtn.dataset.levelHash;
  const sectionHash = deleteBtn.dataset.sectionHash;

  if (!levelHash || !sectionHash) return;

  const confirmed = confirm("Are you sure you want to delete this school section?");
  if (!confirmed) return;

  const payload = {
    level_hash: levelHash,
    section_hash: sectionHash,
  };

  try {
    const response = await fetch(`${getApiBaseUrl()}/remove_school_section`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to remove school section");
    }

    await fetchSchoolSections();
    alert("School section removed successfully.");
  } catch (error) {
    console.warn("remove_school_section mock fallback used:", error.message);

    schoolSectionsGrouped = schoolSectionsGrouped
      .map((group) => {
        const groupHash = group.grade_hash || group.level_hash;

        if (groupHash !== levelHash) {
          return group;
        }

        return {
          ...group,
          sections: (group.sections || []).filter(
            (section) => (section.section_hash || section.hash) !== sectionHash
          ),
        };
      })
      .filter((group) => (group.sections || []).length > 0);

    schoolSectionsRows = flattenSchoolSections(schoolSectionsGrouped);
    renderSchoolSectionsTable();
    alert("API failed. Mock delete applied.");
  }
}

function bindSchoolSectionsEvents() {
  if (refreshSchoolSectionsBtn) {
    refreshSchoolSectionsBtn.addEventListener("click", fetchSchoolSections);
  }

  if (addSchoolSectionBtn) {
    addSchoolSectionBtn.addEventListener("click", () => {
      resetSchoolSectionForm();
      openModal(addSchoolSectionModal);
    });
  }

  if (closeSchoolSectionModalBtn) {
    closeSchoolSectionModalBtn.addEventListener("click", () => {
      closeModal(addSchoolSectionModal);
      resetSchoolSectionForm();
    });
  }

  if (cancelSchoolSectionBtn) {
    cancelSchoolSectionBtn.addEventListener("click", () => {
      closeModal(addSchoolSectionModal);
      resetSchoolSectionForm();
    });
  }

  if (addSchoolSectionBackdrop) {
    addSchoolSectionBackdrop.addEventListener("click", () => {
      closeModal(addSchoolSectionModal);
      resetSchoolSectionForm();
    });
  }

  if (schoolSectionForm) {
    schoolSectionForm.addEventListener("submit", handleAddSchoolSection);
  }

  if (schoolSectionsSearch) {
    schoolSectionsSearch.addEventListener("input", renderSchoolSectionsTable);
  }

  if (schoolSectionsTableBody) {
    schoolSectionsTableBody.addEventListener("click", handleSchoolSectionsTableClick);
  }
}

function initSchoolSectionsPage() {
  if (typeof loadSidebar === "function") {
    loadSidebar();
  }

  setTimeout(setActiveSidebarLink, 100);

  bindSchoolSectionsEvents();
  fetchSchoolSections();
}

document.addEventListener("DOMContentLoaded", initSchoolSectionsPage);