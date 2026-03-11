/*
Students Page
renderStudents
fetchStudents
filterStudents
viewStudent
openAddStudentModal
editStudent
deleteStudent
*/


// =========================
// Students Page
// =========================
const studentsTableBody = document.getElementById("studentsTableBody");
const studentSearch = document.getElementById("studentSearch");
const refreshStudentsBtn = document.getElementById("refreshStudentsBtn");
const addStudentBtn = document.getElementById("addStudentBtn");

const studentViewModal = document.getElementById("studentViewModal");
const closeStudentModalBtn = document.getElementById("closeStudentModalBtn");
const studentModalBackdrop = document.getElementById("studentModalBackdrop");

const detailStudentHash = document.getElementById("detailStudentHash");
const detailStudentName = document.getElementById("detailStudentName");
const detailStudentEmail = document.getElementById("detailStudentEmail");
const detailStudentLevel = document.getElementById("detailStudentLevel");
const detailStudentClass = document.getElementById("detailStudentClass");
const detailStudentParent = document.getElementById("detailStudentParent");
const detailStudentCreatedAt = document.getElementById("detailStudentCreatedAt");

const addStudentModal = document.getElementById("addStudentModal");
const addStudentBackdrop = document.getElementById("addStudentBackdrop");
const closeAddStudentBtn = document.getElementById("closeAddStudentBtn");
const cancelAddStudent = document.getElementById("cancelAddStudent");
const addStudentForm = document.getElementById("addStudentForm");

const studentFormTitle = document.getElementById("studentFormTitle");
const saveStudentBtn = document.getElementById("saveStudentBtn");

const newStudentHash = document.getElementById("newStudentHash");
const newStudentName = document.getElementById("newStudentName");
const newStudentEmail = document.getElementById("newStudentEmail");
const newStudentLevel = document.getElementById("newStudentLevel");
const newStudentClass = document.getElementById("newStudentClass");
const newStudentParent = document.getElementById("newStudentParent");

let studentsData = [];
let editingStudentHash = null;

const mockStudents = [
  {
    student_hash: "STU_001",
    name: "Ahmad Ali",
    email: "ahmad@example.com",
    created_at: "2026-03-01",
    level_name: "Grade 9",
    class_name: "A",
    parent_name: "Ali Ahmad"
  },
  {
    student_hash: "STU_002",
    name: "Lina Hassan",
    email: "lina@example.com",
    created_at: "2026-03-03",
    level_name: "Grade 10",
    class_name: "B",
    parent_name: "Hassan Lina"
  }
];

function renderStudents(data) {
  if (!studentsTableBody) return;

  if (!data || data.length === 0) {
    studentsTableBody.innerHTML = `
      <tr>
        <td colspan="8" class="a-table-empty">No students found.</td>
      </tr>
    `;
    return;
  }

  studentsTableBody.innerHTML = data.map((student) => `
    <tr>
      <td>${formatValue(student.student_hash)}</td>
      <td>${formatValue(student.name)}</td>
      <td>${formatValue(student.email)}</td>
      <td>${formatValue(student.level_name)}</td>
      <td>${formatValue(student.class_name)}</td>
      <td>${formatValue(student.parent_name)}</td>
      <td>${formatValue(student.created_at)}</td>
      <td>
        <div class="a-table-actions">
          <button class="a-action-btn" onclick="viewStudent('${student.student_hash || ""}')">View</button>
          <button class="a-action-btn" onclick="editStudent('${student.student_hash || ""}')">Edit</button>
          <button class="a-action-btn a-action-btn--danger" onclick="deleteStudent('${student.student_hash || ""}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function fetchStudents() {
  if (!studentsTableBody) return;

  studentsTableBody.innerHTML = `
    <tr>
      <td colspan="8" class="a-table-empty">Loading students...</td>
    </tr>
  `;

  try {
    const token = typeof getToken === "function" ? getToken() : localStorage.getItem("token");
    const response = await apiRequest("/get_students", "GET", null, token);

    if (Array.isArray(response) && response.length > 0) {
      studentsData = response.map((student) => ({
        student_hash: student.student_hash || "Unknown",
        name: student.name || "Unknown",
        email: student.email || "Unknown",
        created_at: student.created_at || "Unknown",
        level_name: student.level_name || "Unknown",
        class_name: student.class_name || "Unknown",
        parent_name: student.parent_name || "Unknown"
      }));
    } else {
      studentsData = mockStudents;
    }

    renderStudents(studentsData);
  } catch (error) {
    console.error("Error fetching students:", error);
    studentsData = mockStudents;
    renderStudents(studentsData);
  }
}

function filterStudents() {
  if (!studentSearch) return;

  const query = studentSearch.value.trim().toLowerCase();

  const filtered = studentsData.filter((student) =>
    String(student.student_hash).toLowerCase().includes(query) ||
    String(student.name).toLowerCase().includes(query) ||
    String(student.email).toLowerCase().includes(query)
  );

  renderStudents(filtered);
}

function viewStudent(studentHash) {
  const student = studentsData.find((item) => item.student_hash === studentHash);
  if (!student || !studentViewModal) return;

  detailStudentHash.textContent = formatValue(student.student_hash);
  detailStudentName.textContent = formatValue(student.name);
  detailStudentEmail.textContent = formatValue(student.email);
  detailStudentLevel.textContent = formatValue(student.level_name);
  detailStudentClass.textContent = formatValue(student.class_name);
  detailStudentParent.textContent = formatValue(student.parent_name);
  detailStudentCreatedAt.textContent = formatValue(student.created_at);

  studentViewModal.classList.add("show");
}

function closeStudentModal() {
  if (!studentViewModal) return;
  studentViewModal.classList.remove("show");
}

function openAddStudentModal() {
  if (!addStudentModal) return;

  editingStudentHash = null;

  if (studentFormTitle) studentFormTitle.textContent = "Add Student";
  if (saveStudentBtn) saveStudentBtn.textContent = "Save Student";
  if (addStudentForm) addStudentForm.reset();
  if (newStudentHash) newStudentHash.disabled = false;

  addStudentModal.classList.add("show");
}

function closeAddStudentModal() {
  if (!addStudentModal) return;

  addStudentModal.classList.remove("show");
  editingStudentHash = null;

  if (addStudentForm) addStudentForm.reset();
  if (newStudentHash) newStudentHash.disabled = false;
  if (studentFormTitle) studentFormTitle.textContent = "Add Student";
  if (saveStudentBtn) saveStudentBtn.textContent = "Save Student";
}

function editStudent(studentHash) {
  const student = studentsData.find((item) => item.student_hash === studentHash);
  if (!student || !addStudentModal) return;

  editingStudentHash = studentHash;

  if (studentFormTitle) studentFormTitle.textContent = "Edit Student";
  if (saveStudentBtn) saveStudentBtn.textContent = "Update Student";

  newStudentHash.value = student.student_hash || "";
  newStudentName.value = student.name || "";
  newStudentEmail.value = student.email || "";
  newStudentLevel.value = student.level_name || "";
  newStudentClass.value = student.class_name || "";
  newStudentParent.value = student.parent_name || "";

  if (newStudentHash) newStudentHash.disabled = true;

  addStudentModal.classList.add("show");
}

function deleteStudent(studentHash) {
  const confirmed = confirm(`Are you sure you want to delete student ${studentHash}?`);
  if (!confirmed) return;

  studentsData = studentsData.filter((student) => student.student_hash !== studentHash);
  renderStudents(studentsData);
}

if (studentsTableBody) {
  fetchStudents();

  if (studentSearch) studentSearch.addEventListener("input", filterStudents);
  if (refreshStudentsBtn) refreshStudentsBtn.addEventListener("click", fetchStudents);
  if (addStudentBtn) addStudentBtn.addEventListener("click", openAddStudentModal);
  if (closeStudentModalBtn) closeStudentModalBtn.addEventListener("click", closeStudentModal);
  if (studentModalBackdrop) studentModalBackdrop.addEventListener("click", closeStudentModal);
  if (closeAddStudentBtn) closeAddStudentBtn.addEventListener("click", closeAddStudentModal);
  if (cancelAddStudent) cancelAddStudent.addEventListener("click", closeAddStudentModal);
  if (addStudentBackdrop) addStudentBackdrop.addEventListener("click", closeAddStudentModal);

  if (addStudentForm) {
    addStudentForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const studentPayload = {
        student_hash: newStudentHash.value,
        name: newStudentName.value,
        email: newStudentEmail.value,
        level_name: newStudentLevel.value || "Unknown",
        class_name: newStudentClass.value || "Unknown",
        parent_name: newStudentParent.value || "Unknown"
      };

      if (editingStudentHash) {
        studentsData = studentsData.map((student) => {
          if (student.student_hash === editingStudentHash) {
            return { ...student, ...studentPayload };
          }
          return student;
        });
      } else {
        studentsData.push({
          ...studentPayload,
          created_at: new Date().toISOString().split("T")[0]
        });
      }

      renderStudents(studentsData);
      closeAddStudentModal();
    });
  }
}