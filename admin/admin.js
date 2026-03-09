// =========================
// Shared helper
// =========================
function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "Unknown";
  }
  return value;
}

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

// =========================
// Parents Page
// =========================
const parentsTableBody = document.getElementById("parentsTableBody");
const parentSearch = document.getElementById("parentSearch");
const refreshParentsBtn = document.getElementById("refreshParentsBtn");
const addParentBtn = document.getElementById("addParentBtn");

const parentViewModal = document.getElementById("parentViewModal");
const closeParentModalBtn = document.getElementById("closeParentModalBtn");
const parentModalBackdrop = document.getElementById("parentModalBackdrop");

const detailParentHash = document.getElementById("detailParentHash");
const detailParentName = document.getElementById("detailParentName");
const detailParentEmail = document.getElementById("detailParentEmail");
const detailParentPhone = document.getElementById("detailParentPhone");
const detailParentCreatedAt = document.getElementById("detailParentCreatedAt");

const addParentModal = document.getElementById("addParentModal");
const addParentBackdrop = document.getElementById("addParentBackdrop");
const closeAddParentBtn = document.getElementById("closeAddParentBtn");
const cancelAddParent = document.getElementById("cancelAddParent");
const addParentForm = document.getElementById("addParentForm");

const parentFormTitle = document.getElementById("parentFormTitle");
const saveParentBtn = document.getElementById("saveParentBtn");

const newParentHash = document.getElementById("newParentHash");
const newParentName = document.getElementById("newParentName");
const newParentEmail = document.getElementById("newParentEmail");
const newParentPhone = document.getElementById("newParentPhone");

let parentsData = [];
let editingParentHash = null;

const mockParents = [
  {
    parent_hash: "PAR_001",
    name: "Mohammad Ali",
    email: "m.ali@example.com",
    phone: "03 888 111",
    created_at: "2026-03-01"
  },
  {
    parent_hash: "PAR_002",
    name: "Fatima Hassan",
    email: "fatima@example.com",
    phone: "70 222 333",
    created_at: "2026-03-04"
  }
];

function renderParents(data) {
  if (!parentsTableBody) return;

  if (!data || data.length === 0) {
    parentsTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="a-table-empty">No parents found.</td>
      </tr>
    `;
    return;
  }

  parentsTableBody.innerHTML = data.map((parent) => `
    <tr>
      <td>${formatValue(parent.parent_hash)}</td>
      <td>${formatValue(parent.name)}</td>
      <td>${formatValue(parent.email)}</td>
      <td>${formatValue(parent.phone)}</td>
      <td>${formatValue(parent.created_at)}</td>
      <td>
        <div class="a-table-actions">
          <button class="a-action-btn" onclick="viewParent('${parent.parent_hash || ""}')">View</button>
          <button class="a-action-btn" onclick="editParent('${parent.parent_hash || ""}')">Edit</button>
          <button class="a-action-btn a-action-btn--danger" onclick="deleteParent('${parent.parent_hash || ""}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function fetchParents() {
  if (!parentsTableBody) return;

  parentsTableBody.innerHTML = `
    <tr>
      <td colspan="6" class="a-table-empty">Loading parents...</td>
    </tr>
  `;

  try {
    const token = typeof getToken === "function" ? getToken() : localStorage.getItem("token");
    const response = await apiRequest("/get_parents", "GET", null, token);

    if (Array.isArray(response) && response.length > 0) {
      parentsData = response.map((parent) => ({
        parent_hash: parent.parent_hash || "Unknown",
        name: parent.name || "Unknown",
        email: parent.email || "Unknown",
        phone: parent.phone || "Unknown",
        created_at: parent.created_at || "Unknown"
      }));
    } else {
      parentsData = mockParents;
    }

    renderParents(parentsData);
  } catch (error) {
    console.error("Error fetching parents:", error);
    parentsData = mockParents;
    renderParents(parentsData);
  }
}

function filterParents() {
  if (!parentSearch) return;

  const query = parentSearch.value.trim().toLowerCase();

  const filtered = parentsData.filter((parent) =>
    String(parent.parent_hash).toLowerCase().includes(query) ||
    String(parent.name).toLowerCase().includes(query) ||
    String(parent.email).toLowerCase().includes(query)
  );

  renderParents(filtered);
}

function viewParent(parentHash) {
  const parent = parentsData.find((item) => item.parent_hash === parentHash);
  if (!parent || !parentViewModal) return;

  detailParentHash.textContent = formatValue(parent.parent_hash);
  detailParentName.textContent = formatValue(parent.name);
  detailParentEmail.textContent = formatValue(parent.email);
  detailParentPhone.textContent = formatValue(parent.phone);
  detailParentCreatedAt.textContent = formatValue(parent.created_at);

  parentViewModal.classList.add("show");
}

function closeParentModal() {
  if (!parentViewModal) return;
  parentViewModal.classList.remove("show");
}

function openAddParentModal() {
  if (!addParentModal) return;

  editingParentHash = null;

  if (parentFormTitle) parentFormTitle.textContent = "Add Parent";
  if (saveParentBtn) saveParentBtn.textContent = "Save Parent";
  if (addParentForm) addParentForm.reset();
  if (newParentHash) newParentHash.disabled = false;

  addParentModal.classList.add("show");
}

function closeAddParentModal() {
  if (!addParentModal) return;

  addParentModal.classList.remove("show");
  editingParentHash = null;

  if (addParentForm) addParentForm.reset();
  if (newParentHash) newParentHash.disabled = false;
  if (parentFormTitle) parentFormTitle.textContent = "Add Parent";
  if (saveParentBtn) saveParentBtn.textContent = "Save Parent";
}

function editParent(parentHash) {
  const parent = parentsData.find((item) => item.parent_hash === parentHash);
  if (!parent || !addParentModal) return;

  editingParentHash = parentHash;

  if (parentFormTitle) parentFormTitle.textContent = "Edit Parent";
  if (saveParentBtn) saveParentBtn.textContent = "Update Parent";

  newParentHash.value = parent.parent_hash || "";
  newParentName.value = parent.name || "";
  newParentEmail.value = parent.email || "";
  newParentPhone.value = parent.phone || "";

  if (newParentHash) newParentHash.disabled = true;

  addParentModal.classList.add("show");
}

function deleteParent(parentHash) {
  const confirmed = confirm(`Are you sure you want to delete parent ${parentHash}?`);
  if (!confirmed) return;

  parentsData = parentsData.filter((parent) => parent.parent_hash !== parentHash);
  renderParents(parentsData);
}

if (parentsTableBody) {
  fetchParents();

  if (parentSearch) parentSearch.addEventListener("input", filterParents);
  if (refreshParentsBtn) refreshParentsBtn.addEventListener("click", fetchParents);
  if (addParentBtn) addParentBtn.addEventListener("click", openAddParentModal);
  if (closeParentModalBtn) closeParentModalBtn.addEventListener("click", closeParentModal);
  if (parentModalBackdrop) parentModalBackdrop.addEventListener("click", closeParentModal);
  if (closeAddParentBtn) closeAddParentBtn.addEventListener("click", closeAddParentModal);
  if (cancelAddParent) cancelAddParent.addEventListener("click", closeAddParentModal);
  if (addParentBackdrop) addParentBackdrop.addEventListener("click", closeAddParentModal);

  if (addParentForm) {
    addParentForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const parentPayload = {
        parent_hash: newParentHash.value,
        name: newParentName.value,
        email: newParentEmail.value,
        phone: newParentPhone.value || "Unknown"
      };

      if (editingParentHash) {
        parentsData = parentsData.map((parent) => {
          if (parent.parent_hash === editingParentHash) {
            return { ...parent, ...parentPayload };
          }
          return parent;
        });
      } else {
        parentsData.push({
          ...parentPayload,
          created_at: new Date().toISOString().split("T")[0]
        });
      }

      renderParents(parentsData);
      closeAddParentModal();
    });
  }
}