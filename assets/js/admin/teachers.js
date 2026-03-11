/*
Teachers Page
renderTeachers
fetchTeachers
filterTeachers
viewTeacher
openAddTeacherModal
editTeacher
deleteTeacher
*/

// =========================
// Teachers Page
// =========================
const teachersTableBody = document.getElementById("teachersTableBody");
const teacherSearch = document.getElementById("teacherSearch");
const refreshTeachersBtn = document.getElementById("refreshTeachersBtn");
const addTeacherBtn = document.getElementById("addTeacherBtn");

const teacherViewModal = document.getElementById("teacherViewModal");
const closeTeacherModalBtn = document.getElementById("closeTeacherModalBtn");
const teacherModalBackdrop = document.getElementById("teacherModalBackdrop");

const detailTeacherHash = document.getElementById("detailTeacherHash");
const detailTeacherName = document.getElementById("detailTeacherName");
const detailTeacherEmail = document.getElementById("detailTeacherEmail");
const detailTeacherDepartment = document.getElementById("detailTeacherDepartment");
const detailTeacherPhone = document.getElementById("detailTeacherPhone");
const detailTeacherCreatedAt = document.getElementById("detailTeacherCreatedAt");

const addTeacherModal = document.getElementById("addTeacherModal");
const addTeacherBackdrop = document.getElementById("addTeacherBackdrop");
const closeAddTeacherBtn = document.getElementById("closeAddTeacherBtn");
const cancelAddTeacher = document.getElementById("cancelAddTeacher");
const addTeacherForm = document.getElementById("addTeacherForm");

const teacherFormTitle = document.getElementById("teacherFormTitle");
const saveTeacherBtn = document.getElementById("saveTeacherBtn");

const newTeacherHash = document.getElementById("newTeacherHash");
const newTeacherName = document.getElementById("newTeacherName");
const newTeacherEmail = document.getElementById("newTeacherEmail");
const newTeacherDepartment = document.getElementById("newTeacherDepartment");
const newTeacherPhone = document.getElementById("newTeacherPhone");

let teachersData = [];
let editingTeacherHash = null;

const mockTeachers = [
  {
    teacher_hash: "TCH_001",
    name: "Maya Haddad",
    email: "maya@example.com",
    department: "Math",
    phone: "03 111 222",
    created_at: "2026-03-02"
  },
  {
    teacher_hash: "TCH_002",
    name: "Rami Saleh",
    email: "rami@example.com",
    department: "Physics",
    phone: "70 555 666",
    created_at: "2026-03-04"
  }
];

function renderTeachers(data) {
  if (!teachersTableBody) return;

  if (!data || data.length === 0) {
    teachersTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="a-table-empty">No teachers found.</td>
      </tr>
    `;
    return;
  }

  teachersTableBody.innerHTML = data.map((teacher) => `
    <tr>
      <td>${formatValue(teacher.teacher_hash)}</td>
      <td>${formatValue(teacher.name)}</td>
      <td>${formatValue(teacher.email)}</td>
      <td>${formatValue(teacher.department)}</td>
      <td>${formatValue(teacher.phone)}</td>
      <td>${formatValue(teacher.created_at)}</td>
      <td>
        <div class="a-table-actions">
          <button class="a-action-btn" onclick="viewTeacher('${teacher.teacher_hash || ""}')">View</button>
          <button class="a-action-btn" onclick="editTeacher('${teacher.teacher_hash || ""}')">Edit</button>
          <button class="a-action-btn a-action-btn--danger" onclick="deleteTeacher('${teacher.teacher_hash || ""}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function fetchTeachers() {
  if (!teachersTableBody) return;

  teachersTableBody.innerHTML = `
    <tr>
      <td colspan="7" class="a-table-empty">Loading teachers...</td>
    </tr>
  `;

  try {
    const token = typeof getToken === "function" ? getToken() : localStorage.getItem("token");
    const response = await apiRequest("/get_teachers", "GET", null, token);

    if (Array.isArray(response) && response.length > 0) {
      teachersData = response.map((teacher) => ({
        teacher_hash: teacher.teacher_hash || "Unknown",
        name: teacher.name || "Unknown",
        email: teacher.email || "Unknown",
        department: teacher.department || "Unknown",
        phone: teacher.phone || "Unknown",
        created_at: teacher.created_at || "Unknown"
      }));
    } else {
      teachersData = mockTeachers;
    }

    renderTeachers(teachersData);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    teachersData = mockTeachers;
    renderTeachers(teachersData);
  }
}

function filterTeachers() {
  if (!teacherSearch) return;

  const query = teacherSearch.value.trim().toLowerCase();

  const filtered = teachersData.filter((teacher) =>
    String(teacher.teacher_hash).toLowerCase().includes(query) ||
    String(teacher.name).toLowerCase().includes(query) ||
    String(teacher.email).toLowerCase().includes(query)
  );

  renderTeachers(filtered);
}

function viewTeacher(teacherHash) {
  const teacher = teachersData.find((item) => item.teacher_hash === teacherHash);
  if (!teacher || !teacherViewModal) return;

  detailTeacherHash.textContent = formatValue(teacher.teacher_hash);
  detailTeacherName.textContent = formatValue(teacher.name);
  detailTeacherEmail.textContent = formatValue(teacher.email);
  detailTeacherDepartment.textContent = formatValue(teacher.department);
  detailTeacherPhone.textContent = formatValue(teacher.phone);
  detailTeacherCreatedAt.textContent = formatValue(teacher.created_at);

  teacherViewModal.classList.add("show");
}

function closeTeacherModal() {
  if (!teacherViewModal) return;
  teacherViewModal.classList.remove("show");
}

function openAddTeacherModal() {
  if (!addTeacherModal) return;

  editingTeacherHash = null;

  if (teacherFormTitle) teacherFormTitle.textContent = "Add Teacher";
  if (saveTeacherBtn) saveTeacherBtn.textContent = "Save Teacher";
  if (addTeacherForm) addTeacherForm.reset();
  if (newTeacherHash) newTeacherHash.disabled = false;

  addTeacherModal.classList.add("show");
}

function closeAddTeacherModal() {
  if (!addTeacherModal) return;

  addTeacherModal.classList.remove("show");
  editingTeacherHash = null;

  if (addTeacherForm) addTeacherForm.reset();
  if (newTeacherHash) newTeacherHash.disabled = false;
  if (teacherFormTitle) teacherFormTitle.textContent = "Add Teacher";
  if (saveTeacherBtn) saveTeacherBtn.textContent = "Save Teacher";
}

function editTeacher(teacherHash) {
  const teacher = teachersData.find((item) => item.teacher_hash === teacherHash);
  if (!teacher || !addTeacherModal) return;

  editingTeacherHash = teacherHash;

  if (teacherFormTitle) teacherFormTitle.textContent = "Edit Teacher";
  if (saveTeacherBtn) saveTeacherBtn.textContent = "Update Teacher";

  newTeacherHash.value = teacher.teacher_hash || "";
  newTeacherName.value = teacher.name || "";
  newTeacherEmail.value = teacher.email || "";
  newTeacherDepartment.value = teacher.department || "";
  newTeacherPhone.value = teacher.phone || "";

  if (newTeacherHash) newTeacherHash.disabled = true;

  addTeacherModal.classList.add("show");
}

function deleteTeacher(teacherHash) {
  const confirmed = confirm(`Are you sure you want to delete teacher ${teacherHash}?`);
  if (!confirmed) return;

  teachersData = teachersData.filter((teacher) => teacher.teacher_hash !== teacherHash);
  renderTeachers(teachersData);
}

if (teachersTableBody) {
  fetchTeachers();

  if (teacherSearch) teacherSearch.addEventListener("input", filterTeachers);
  if (refreshTeachersBtn) refreshTeachersBtn.addEventListener("click", fetchTeachers);
  if (addTeacherBtn) addTeacherBtn.addEventListener("click", openAddTeacherModal);
  if (closeTeacherModalBtn) closeTeacherModalBtn.addEventListener("click", closeTeacherModal);
  if (teacherModalBackdrop) teacherModalBackdrop.addEventListener("click", closeTeacherModal);
  if (closeAddTeacherBtn) closeAddTeacherBtn.addEventListener("click", closeAddTeacherModal);
  if (cancelAddTeacher) cancelAddTeacher.addEventListener("click", closeAddTeacherModal);
  if (addTeacherBackdrop) addTeacherBackdrop.addEventListener("click", closeAddTeacherModal);

  if (addTeacherForm) {
    addTeacherForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const teacherPayload = {
        teacher_hash: newTeacherHash.value,
        name: newTeacherName.value,
        email: newTeacherEmail.value,
        department: newTeacherDepartment.value || "Unknown",
        phone: newTeacherPhone.value || "Unknown"
      };

      if (editingTeacherHash) {
        teachersData = teachersData.map((teacher) => {
          if (teacher.teacher_hash === editingTeacherHash) {
            return { ...teacher, ...teacherPayload };
          }
          return teacher;
        });
      } else {
        teachersData.push({
          ...teacherPayload,
          created_at: new Date().toISOString().split("T")[0]
        });
      }

      renderTeachers(teachersData);
      closeAddTeacherModal();
    });
  }
}