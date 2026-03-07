// ===== Students Page =====
const studentsTableBody = document.getElementById("studentsTableBody");
const studentSearch = document.getElementById("studentSearch");
const refreshStudentsBtn = document.getElementById("refreshStudentsBtn");
const addStudentBtn = document.getElementById("addStudentBtn");

let studentsData = [];

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

function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "Unknown";
  }
  return value;
}

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
    const token = getToken ? getToken() : localStorage.getItem("token");
    const response = await apiRequest("/get_students", "GET", null, token);

    if (Array.isArray(response)) {
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
      studentsData = [];
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
  alert(`View student: ${studentHash}`);
}

function editStudent(studentHash) {
  alert(`Edit student: ${studentHash}`);
}

function deleteStudent(studentHash) {
  const confirmed = confirm(`Are you sure you want to delete student ${studentHash}?`);
  if (!confirmed) return;

  alert(`Delete student: ${studentHash}`);
}

// run only on students page
if (studentsTableBody) {
  fetchStudents();

  if (studentSearch) {
    studentSearch.addEventListener("input", filterStudents);
  }

  if (refreshStudentsBtn) {
    refreshStudentsBtn.addEventListener("click", fetchStudents);
  }

  if (addStudentBtn) {
    addStudentBtn.addEventListener("click", () => {
      alert("Next step: Add Student modal/form.");
    });
  }
}