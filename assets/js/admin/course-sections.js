const tableBody = document.getElementById("courseSectionsTableBody");
const searchInput = document.getElementById("courseSectionsSearch");

const addBtn = document.getElementById("addCourseSectionBtn");
const refreshBtn = document.getElementById("refreshCourseSectionsBtn");

const modal = document.getElementById("courseSectionModal");
const backdrop = document.getElementById("courseSectionBackdrop");
const closeBtn = document.getElementById("closeCourseSectionModalBtn");
const cancelBtn = document.getElementById("cancelCourseSectionBtn");

const form = document.getElementById("courseSectionForm");

const offeringInput = document.getElementById("offeringHashInput");
const sectionCodeInput = document.getElementById("sectionCodeInput");
const teacherInput = document.getElementById("teacherHashInput");
const capacityInput = document.getElementById("capacityInput");
const modeInput = document.getElementById("modeInput");

let data = [];

function openModal() {
  modal.classList.add("show");
}

function closeModal() {
  modal.classList.remove("show");
  form.reset();
}

function getApiBaseUrl() {
  return window.CONFIG?.API_BASE_URL || "";
}

function getHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : ""
  };
}

function renderTable() {
  const query = searchInput.value.toLowerCase();

  const filtered = data.filter(item =>
    JSON.stringify(item).toLowerCase().includes(query)
  );

  if (!filtered.length) {
    tableBody.innerHTML = `<tr><td colspan="6" class="a-table-empty">No data</td></tr>`;
    return;
  }

  tableBody.innerHTML = filtered.map(item => `
    <tr>
      <td>${item.section_code || "-"}</td>
      <td>${item.offering_hash || "-"}</td>
      <td>${item.teacher_hash || "-"}</td>
      <td>${item.capacity || "-"}</td>
      <td>${item.mode || "-"}</td>
      <td>
        <div class="a-table-actions">
          <button class="a-action-btn a-action-btn--danger delete-btn" data-id="${item.course_section_hash}">
            Delete
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function fetchData() {
  try {
    const res = await fetch(`${getApiBaseUrl()}/get_course_sections`, {
      headers: getHeaders()
    });

    const json = await res.json();
    data = Array.isArray(json) ? json : json.data || [];
  } catch (e) {
    console.warn("Mock fallback");
    data = [
      {
        course_section_hash: "1",
        section_code: "A1",
        offering_hash: "OFF1",
        teacher_hash: "T1",
        capacity: 30,
        mode: "offline"
      }
    ];
  }

  renderTable();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    offering_hash: offeringInput.value,
    section_code: sectionCodeInput.value,
    teacher_hash: teacherInput.value || null,
    capacity: capacityInput.value ? Number(capacityInput.value) : null,
    mode: modeInput.value || null
  };

  try {
    await fetch(`${getApiBaseUrl()}/add_course_section`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });

    fetchData();
    closeModal();
  } catch {
    alert("Mock add");
    data.push({ ...payload, course_section_hash: Date.now() });
    renderTable();
    closeModal();
  }
});

tableBody.addEventListener("click", async (e) => {
  const btn = e.target.closest(".delete-btn");
  if (!btn) return;

  const id = btn.dataset.id;

  if (!confirm("Delete?")) return;

  try {
    await fetch(`${getApiBaseUrl()}/remove_course_section`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ course_section_hash: id })
    });

    data = data.filter(i => i.course_section_hash !== id);
    renderTable();
  } catch {
    data = data.filter(i => i.course_section_hash !== id);
    renderTable();
  }
});

addBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);
backdrop.addEventListener("click", closeModal);
searchInput.addEventListener("input", renderTable);
refreshBtn.addEventListener("click", fetchData);

function init() {
  loadSidebar();
  setTimeout(() => {
    document.querySelectorAll(".a-nav__item").forEach(link => {
      if (link.href.includes("course-sections")) {
        link.classList.add("active");
      }
    });
  }, 100);

  fetchData();
}

document.addEventListener("DOMContentLoaded", init);