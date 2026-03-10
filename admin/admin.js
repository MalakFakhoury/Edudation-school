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
// =========================
// Sections Page
// =========================
const sectionsTableBody = document.getElementById("sectionsTableBody");
const sectionSearch = document.getElementById("sectionSearch");
const refreshSectionsBtn = document.getElementById("refreshSectionsBtn");
const addSectionBtn = document.getElementById("addSectionBtn");

const sectionViewModal = document.getElementById("sectionViewModal");
const closeSectionModalBtn = document.getElementById("closeSectionModalBtn");
const sectionModalBackdrop = document.getElementById("sectionModalBackdrop");

const detailSectionHash = document.getElementById("detailSectionHash");
const detailOfferingHash = document.getElementById("detailOfferingHash");
const detailSectionCode = document.getElementById("detailSectionCode");
const detailSectionTeacherHash = document.getElementById("detailSectionTeacherHash");
const detailSectionTeacherName = document.getElementById("detailSectionTeacherName");
const detailCapacity = document.getElementById("detailCapacity");
const detailMode = document.getElementById("detailMode");

const addSectionModal = document.getElementById("addSectionModal");
const addSectionBackdrop = document.getElementById("addSectionBackdrop");
const closeAddSectionBtn = document.getElementById("closeAddSectionBtn");
const cancelAddSection = document.getElementById("cancelAddSection");
const addSectionForm = document.getElementById("addSectionForm");

const sectionFormTitle = document.getElementById("sectionFormTitle");
const saveSectionBtn = document.getElementById("saveSectionBtn");

const newSectionHashInput = document.getElementById("newSectionHash");
const newSectionOfferingHashInput = document.getElementById("newOfferingHash");
const newSectionCodeInput = document.getElementById("newSectionCode");
const newSectionTeacherHashInput = document.getElementById("newSectionTeacherHash");
const newSectionCapacityInput = document.getElementById("newCapacity");
const newSectionModeInput = document.getElementById("newMode");

let sectionsData = [];
let editingSectionHash = null;

const mockSections = [
  {
    section_hash: "SEC_001",
    offering_hash: "OFF_001",
    section_code: "A",
    teacher_hash: "TCH_001",
    teacher_first_name: "Maya",
    teacher_last_name: "Haddad",
    capacity: 30,
    mode: "In Person"
  },
  {
    section_hash: "SEC_002",
    offering_hash: "OFF_002",
    section_code: "B",
    teacher_hash: "TCH_002",
    teacher_first_name: "Rami",
    teacher_last_name: "Saleh",
    capacity: 25,
    mode: "Online"
  }
];

function renderSections(data) {
  if (!sectionsTableBody) return;

  if (!data || data.length === 0) {
    sectionsTableBody.innerHTML = `
      <tr>
        <td colspan="8" class="a-table-empty">No sections found.</td>
      </tr>
    `;
    return;
  }

  sectionsTableBody.innerHTML = data.map((section) => `
    <tr>
      <td>${formatValue(section.section_hash)}</td>
      <td>${formatValue(section.offering_hash)}</td>
      <td>${formatValue(section.section_code)}</td>
      <td>${formatValue(section.teacher_hash)}</td>
      <td>${formatValue(`${section.teacher_first_name || "Unknown"} ${section.teacher_last_name || ""}`.trim())}</td>
      <td>${formatValue(section.capacity)}</td>
      <td>${formatValue(section.mode)}</td>
      <td>
        <div class="a-table-actions">
          <button class="a-action-btn" onclick="viewSection('${section.section_hash || ""}')">View</button>
          <button class="a-action-btn" onclick="editSection('${section.section_hash || ""}')">Edit</button>
          <button class="a-action-btn a-action-btn--danger" onclick="deleteSection('${section.section_hash || ""}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function fetchSections() {
  if (!sectionsTableBody) return;

  sectionsTableBody.innerHTML = `
    <tr>
      <td colspan="8" class="a-table-empty">Loading sections...</td>
    </tr>
  `;

  try {
    const token = typeof getToken === "function" ? getToken() : localStorage.getItem("token");
    const response = await apiRequest("/get_course_sections", "GET", null, token);

    if (Array.isArray(response) && response.length > 0) {
      sectionsData = response.map((section) => ({
        section_hash: section.section_hash || "Unknown",
        offering_hash: section.offering_hash || "Unknown",
        section_code: section.section_code || "Unknown",
        teacher_hash: section.teacher_hash || "Unknown",
        teacher_first_name: section.teacher_first_name || "Unknown",
        teacher_last_name: section.teacher_last_name || "",
        capacity: section.capacity ?? "Unknown",
        mode: section.mode || "Unknown"
      }));
    } else {
      sectionsData = mockSections;
    }

    renderSections(sectionsData);
  } catch (error) {
    console.error("Error fetching sections:", error);
    sectionsData = mockSections;
    renderSections(sectionsData);
  }
}

function filterSections() {
  if (!sectionSearch) return;

  const query = sectionSearch.value.trim().toLowerCase();

  const filtered = sectionsData.filter((section) =>
    String(section.section_hash).toLowerCase().includes(query) ||
    String(section.section_code).toLowerCase().includes(query) ||
    String(section.teacher_hash).toLowerCase().includes(query) ||
    String(section.teacher_first_name).toLowerCase().includes(query) ||
    String(section.teacher_last_name).toLowerCase().includes(query)
  );

  renderSections(filtered);
}

function viewSection(sectionHash) {
  const section = sectionsData.find((item) => item.section_hash === sectionHash);
  if (!section || !sectionViewModal) return;

  detailSectionHash.textContent = formatValue(section.section_hash);
  detailOfferingHash.textContent = formatValue(section.offering_hash);
  detailSectionCode.textContent = formatValue(section.section_code);
  detailSectionTeacherHash.textContent = formatValue(section.teacher_hash);
  detailSectionTeacherName.textContent = formatValue(
    `${section.teacher_first_name || "Unknown"} ${section.teacher_last_name || ""}`.trim()
  );
  detailCapacity.textContent = formatValue(section.capacity);
  detailMode.textContent = formatValue(section.mode);

  sectionViewModal.classList.add("show");
}

function closeSectionModal() {
  if (!sectionViewModal) return;
  sectionViewModal.classList.remove("show");
}

function openAddSectionModal() {
  if (!addSectionModal) return;

  editingSectionHash = null;

  if (sectionFormTitle) sectionFormTitle.textContent = "Add Section";
  if (saveSectionBtn) saveSectionBtn.textContent = "Save Section";
  if (addSectionForm) addSectionForm.reset();

  if (newSectionHashInput) {
    newSectionHashInput.disabled = false;
  }

  addSectionModal.classList.add("show");
}

function closeAddSectionModal() {
  if (!addSectionModal) return;

  addSectionModal.classList.remove("show");
  editingSectionHash = null;

  if (addSectionForm) addSectionForm.reset();

  if (newSectionHashInput) {
    newSectionHashInput.disabled = false;
  }

  if (sectionFormTitle) sectionFormTitle.textContent = "Add Section";
  if (saveSectionBtn) saveSectionBtn.textContent = "Save Section";
}

function editSection(sectionHash) {
  const section = sectionsData.find((item) => item.section_hash === sectionHash);
  if (!section || !addSectionModal) return;

  editingSectionHash = sectionHash;

  if (sectionFormTitle) sectionFormTitle.textContent = "Edit Section";
  if (saveSectionBtn) saveSectionBtn.textContent = "Update Section";

  newSectionHashInput.value = section.section_hash || "";
  newSectionOfferingHashInput.value = section.offering_hash || "";
  newSectionCodeInput.value = section.section_code || "";
  newSectionTeacherHashInput.value = section.teacher_hash || "";
  newSectionCapacityInput.value = section.capacity || "";
  newSectionModeInput.value = section.mode || "";

  if (newSectionHashInput) {
    newSectionHashInput.disabled = true;
  }

  addSectionModal.classList.add("show");
}

function deleteSection(sectionHash) {
  const confirmed = confirm(`Are you sure you want to delete section ${sectionHash}?`);
  if (!confirmed) return;

  sectionsData = sectionsData.filter((section) => section.section_hash !== sectionHash);
  renderSections(sectionsData);
}

if (sectionsTableBody) {
  fetchSections();

  if (sectionSearch) sectionSearch.addEventListener("input", filterSections);
  if (refreshSectionsBtn) refreshSectionsBtn.addEventListener("click", fetchSections);
  if (addSectionBtn) addSectionBtn.addEventListener("click", openAddSectionModal);

  if (closeSectionModalBtn) {
    closeSectionModalBtn.addEventListener("click", closeSectionModal);
  }

  if (sectionModalBackdrop) {
    sectionModalBackdrop.addEventListener("click", closeSectionModal);
  }

  if (closeAddSectionBtn) {
    closeAddSectionBtn.addEventListener("click", closeAddSectionModal);
  }

  if (cancelAddSection) {
    cancelAddSection.addEventListener("click", closeAddSectionModal);
  }

  if (addSectionBackdrop) {
    addSectionBackdrop.addEventListener("click", closeAddSectionModal);
  }

  if (addSectionForm) {
    addSectionForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const sectionPayload = {
        section_hash: newSectionHashInput.value,
        offering_hash: newSectionOfferingHashInput.value || "Unknown",
        section_code: newSectionCodeInput.value || "Unknown",
        teacher_hash: newSectionTeacherHashInput.value || "Unknown",
        teacher_first_name: "Unknown",
        teacher_last_name: "",
        capacity: newSectionCapacityInput.value || "Unknown",
        mode: newSectionModeInput.value || "Unknown"
      };

      if (editingSectionHash) {
        sectionsData = sectionsData.map((section) => {
          if (section.section_hash === editingSectionHash) {
            return {
              ...section,
              ...sectionPayload
            };
          }
          return section;
        });
      } else {
        sectionsData.push(sectionPayload);
      }

      renderSections(sectionsData);
      closeAddSectionModal();
    });
  }
}

// =========================
// Levels Page
// =========================
const levelsTableBody = document.getElementById("levelsTableBody");
const levelSearch = document.getElementById("levelSearch");
const refreshLevelsBtn = document.getElementById("refreshLevelsBtn");
const addLevelBtn = document.getElementById("addLevelBtn");

const levelViewModal = document.getElementById("levelViewModal");
const closeLevelModalBtn = document.getElementById("closeLevelModalBtn");
const levelModalBackdrop = document.getElementById("levelModalBackdrop");

const detailLevelHash = document.getElementById("detailLevelHash");
const detailLevelName = document.getElementById("detailLevelName");

const addLevelModal = document.getElementById("addLevelModal");
const addLevelBackdrop = document.getElementById("addLevelBackdrop");
const closeAddLevelBtn = document.getElementById("closeAddLevelBtn");
const cancelAddLevel = document.getElementById("cancelAddLevel");
const addLevelForm = document.getElementById("addLevelForm");

const levelFormTitle = document.getElementById("levelFormTitle");
const saveLevelBtn = document.getElementById("saveLevelBtn");

const newLevelHash = document.getElementById("newLevelHash");
const newLevelName = document.getElementById("newLevelName");

let levelsData = [];
let editingLevelHash = null;

const mockLevels = [
  {
    grade_hash: "GRD_001",
    name: "Grade 9"
  },
  {
    grade_hash: "GRD_002",
    name: "Grade 10"
  }
];

function renderLevels(data) {
  if (!levelsTableBody) return;

  if (!data || data.length === 0) {
    levelsTableBody.innerHTML = `
      <tr>
        <td colspan="3" class="a-table-empty">No levels found.</td>
      </tr>
    `;
    return;
  }

  levelsTableBody.innerHTML = data.map((level) => `
    <tr>
      <td>${formatValue(level.grade_hash)}</td>
      <td>${formatValue(level.name)}</td>
      <td>
        <div class="a-table-actions">
          <button class="a-action-btn" onclick="viewLevel('${level.grade_hash || ""}')">View</button>
          <button class="a-action-btn" onclick="editLevel('${level.grade_hash || ""}')">Edit</button>
          <button class="a-action-btn a-action-btn--danger" onclick="deleteLevel('${level.grade_hash || ""}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function fetchLevels() {
  if (!levelsTableBody) return;

  levelsTableBody.innerHTML = `
    <tr>
      <td colspan="3" class="a-table-empty">Loading levels...</td>
    </tr>
  `;

  try {
    const token = typeof getToken === "function" ? getToken() : localStorage.getItem("token");
    const response = await apiRequest("/get_levels", "GET", null, token);

    if (Array.isArray(response) && response.length > 0) {
      levelsData = response.map((level) => ({
        grade_hash: level.grade_hash || "Unknown",
        name: level.name || "Unknown"
      }));
    } else {
      levelsData = mockLevels;
    }

    renderLevels(levelsData);
  } catch (error) {
    console.error("Error fetching levels:", error);
    levelsData = mockLevels;
    renderLevels(levelsData);
  }
}

function filterLevels() {
  if (!levelSearch) return;

  const query = levelSearch.value.trim().toLowerCase();

  const filtered = levelsData.filter((level) =>
    String(level.grade_hash).toLowerCase().includes(query) ||
    String(level.name).toLowerCase().includes(query)
  );

  renderLevels(filtered);
}

function viewLevel(levelHash) {
  const level = levelsData.find((item) => item.grade_hash === levelHash);
  if (!level || !levelViewModal) return;

  detailLevelHash.textContent = formatValue(level.grade_hash);
  detailLevelName.textContent = formatValue(level.name);

  levelViewModal.classList.add("show");
}

function closeLevelModal() {
  if (!levelViewModal) return;
  levelViewModal.classList.remove("show");
}

function openAddLevelModal() {
  if (!addLevelModal) return;

  editingLevelHash = null;

  if (levelFormTitle) levelFormTitle.textContent = "Add Level";
  if (saveLevelBtn) saveLevelBtn.textContent = "Save Level";
  if (addLevelForm) addLevelForm.reset();

  if (newLevelHash) {
    newLevelHash.disabled = false;
  }

  addLevelModal.classList.add("show");
}

function closeAddLevelModal() {
  if (!addLevelModal) return;

  addLevelModal.classList.remove("show");
  editingLevelHash = null;

  if (addLevelForm) addLevelForm.reset();

  if (newLevelHash) {
    newLevelHash.disabled = false;
  }

  if (levelFormTitle) levelFormTitle.textContent = "Add Level";
  if (saveLevelBtn) saveLevelBtn.textContent = "Save Level";
}

function editLevel(levelHash) {
  const level = levelsData.find((item) => item.grade_hash === levelHash);
  if (!level || !addLevelModal) return;

  editingLevelHash = levelHash;

  if (levelFormTitle) levelFormTitle.textContent = "Edit Level";
  if (saveLevelBtn) saveLevelBtn.textContent = "Update Level";

  newLevelHash.value = level.grade_hash || "";
  newLevelName.value = level.name || "";

  if (newLevelHash) {
    newLevelHash.disabled = true;
  }

  addLevelModal.classList.add("show");
}

function deleteLevel(levelHash) {
  const confirmed = confirm(`Are you sure you want to delete level ${levelHash}?`);
  if (!confirmed) return;

  levelsData = levelsData.filter((level) => level.grade_hash !== levelHash);
  renderLevels(levelsData);
}

if (levelsTableBody) {
  fetchLevels();

  if (levelSearch) levelSearch.addEventListener("input", filterLevels);
  if (refreshLevelsBtn) refreshLevelsBtn.addEventListener("click", fetchLevels);
  if (addLevelBtn) addLevelBtn.addEventListener("click", openAddLevelModal);

  if (closeLevelModalBtn) {
    closeLevelModalBtn.addEventListener("click", closeLevelModal);
  }

  if (levelModalBackdrop) {
    levelModalBackdrop.addEventListener("click", closeLevelModal);
  }

  if (closeAddLevelBtn) {
    closeAddLevelBtn.addEventListener("click", closeAddLevelModal);
  }

  if (cancelAddLevel) {
    cancelAddLevel.addEventListener("click", closeAddLevelModal);
  }

  if (addLevelBackdrop) {
    addLevelBackdrop.addEventListener("click", closeAddLevelModal);
  }

  if (addLevelForm) {
    addLevelForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const levelPayload = {
        grade_hash: newLevelHash.value,
        name: newLevelName.value
      };

      if (editingLevelHash) {
        levelsData = levelsData.map((level) => {
          if (level.grade_hash === editingLevelHash) {
            return {
              ...level,
              ...levelPayload
            };
          }
          return level;
        });
      } else {
        levelsData.push(levelPayload);
      }

      renderLevels(levelsData);
      closeAddLevelModal();
    });
  }
}

// =========================
// Terms Page
// =========================
const termsTableBody = document.getElementById("termsTableBody");
const termSearch = document.getElementById("termSearch");
const refreshTermsBtn = document.getElementById("refreshTermsBtn");
const addTermBtn = document.getElementById("addTermBtn");

const termViewModal = document.getElementById("termViewModal");
const closeTermModalBtn = document.getElementById("closeTermModalBtn");
const termModalBackdrop = document.getElementById("termModalBackdrop");

const detailTermHash = document.getElementById("detailTermHash");
const detailTermName = document.getElementById("detailTermName");
const detailTermStartDate = document.getElementById("detailTermStartDate");
const detailTermEndDate = document.getElementById("detailTermEndDate");
const detailTermCreatedAt = document.getElementById("detailTermCreatedAt");

const addTermModal = document.getElementById("addTermModal");
const addTermBackdrop = document.getElementById("addTermBackdrop");
const closeAddTermBtn = document.getElementById("closeAddTermBtn");
const cancelAddTerm = document.getElementById("cancelAddTerm");
const addTermForm = document.getElementById("addTermForm");

const termFormTitle = document.getElementById("termFormTitle");
const saveTermBtn = document.getElementById("saveTermBtn");

const newTermHash = document.getElementById("newTermHash");
const newTermName = document.getElementById("newTermName");
const newTermStartDate = document.getElementById("newTermStartDate");
const newTermEndDate = document.getElementById("newTermEndDate");

let termsData = [];
let editingTermHash = null;

const mockTerms = [
  {
    term_hash: "TERM_001",
    name: "Fall 2026",
    start_date: "2026-09-01",
    end_date: "2026-12-20",
    created_at: "2026-03-01"
  },
  {
    term_hash: "TERM_002",
    name: "Spring 2027",
    start_date: "2027-01-10",
    end_date: "2027-05-25",
    created_at: "2026-03-02"
  }
];

function renderTerms(data) {
  if (!termsTableBody) return;

  if (!data || data.length === 0) {
    termsTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="a-table-empty">No terms found.</td>
      </tr>
    `;
    return;
  }

  termsTableBody.innerHTML = data.map((term) => `
    <tr>
      <td>${formatValue(term.term_hash)}</td>
      <td>${formatValue(term.name)}</td>
      <td>${formatValue(term.start_date)}</td>
      <td>${formatValue(term.end_date)}</td>
      <td>${formatValue(term.created_at)}</td>
      <td>
        <div class="a-table-actions">
          <button class="a-action-btn" onclick="viewTerm('${term.term_hash || ""}')">View</button>
          <button class="a-action-btn" onclick="editTerm('${term.term_hash || ""}')">Edit</button>
          <button class="a-action-btn a-action-btn--danger" onclick="deleteTerm('${term.term_hash || ""}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function fetchTerms() {
  if (!termsTableBody) return;

  termsTableBody.innerHTML = `
    <tr>
      <td colspan="6" class="a-table-empty">Loading terms...</td>
    </tr>
  `;

  try {
    const token = typeof getToken === "function" ? getToken() : localStorage.getItem("token");
    const response = await apiRequest("/get_terms", "GET", null, token);

    if (Array.isArray(response) && response.length > 0) {
      termsData = response.map((term) => ({
        term_hash: term.term_hash || "Unknown",
        name: term.name || "Unknown",
        start_date: term.start_date || "Unknown",
        end_date: term.end_date || "Unknown",
        created_at: term.created_at || "Unknown"
      }));
    } else {
      termsData = mockTerms;
    }

    renderTerms(termsData);
  } catch (error) {
    console.error("Error fetching terms:", error);
    termsData = mockTerms;
    renderTerms(termsData);
  }
}

function filterTerms() {
  if (!termSearch) return;

  const query = termSearch.value.trim().toLowerCase();

  const filtered = termsData.filter((term) =>
    String(term.term_hash).toLowerCase().includes(query) ||
    String(term.name).toLowerCase().includes(query)
  );

  renderTerms(filtered);
}

function viewTerm(termHash) {
  const term = termsData.find((item) => item.term_hash === termHash);
  if (!term || !termViewModal) return;

  detailTermHash.textContent = formatValue(term.term_hash);
  detailTermName.textContent = formatValue(term.name);
  detailTermStartDate.textContent = formatValue(term.start_date);
  detailTermEndDate.textContent = formatValue(term.end_date);
  detailTermCreatedAt.textContent = formatValue(term.created_at);

  termViewModal.classList.add("show");
}

function closeTermModal() {
  if (!termViewModal) return;
  termViewModal.classList.remove("show");
}

function openAddTermModal() {
  if (!addTermModal) return;

  editingTermHash = null;

  if (termFormTitle) termFormTitle.textContent = "Add Term";
  if (saveTermBtn) saveTermBtn.textContent = "Save Term";
  if (addTermForm) addTermForm.reset();

  if (newTermHash) {
    newTermHash.disabled = false;
  }

  addTermModal.classList.add("show");
}

function closeAddTermModal() {
  if (!addTermModal) return;

  addTermModal.classList.remove("show");
  editingTermHash = null;

  if (addTermForm) addTermForm.reset();

  if (newTermHash) {
    newTermHash.disabled = false;
  }

  if (termFormTitle) termFormTitle.textContent = "Add Term";
  if (saveTermBtn) saveTermBtn.textContent = "Save Term";
}

function editTerm(termHash) {
  const term = termsData.find((item) => item.term_hash === termHash);
  if (!term || !addTermModal) return;

  editingTermHash = termHash;

  if (termFormTitle) termFormTitle.textContent = "Edit Term";
  if (saveTermBtn) saveTermBtn.textContent = "Update Term";

  newTermHash.value = term.term_hash || "";
  newTermName.value = term.name || "";
  newTermStartDate.value = term.start_date || "";
  newTermEndDate.value = term.end_date || "";

  if (newTermHash) {
    newTermHash.disabled = true;
  }

  addTermModal.classList.add("show");
}

function deleteTerm(termHash) {
  const confirmed = confirm(`Are you sure you want to delete term ${termHash}?`);
  if (!confirmed) return;

  termsData = termsData.filter((term) => term.term_hash !== termHash);
  renderTerms(termsData);
}

if (termsTableBody) {
  fetchTerms();

  if (termSearch) termSearch.addEventListener("input", filterTerms);
  if (refreshTermsBtn) refreshTermsBtn.addEventListener("click", fetchTerms);
  if (addTermBtn) addTermBtn.addEventListener("click", openAddTermModal);

  if (closeTermModalBtn) {
    closeTermModalBtn.addEventListener("click", closeTermModal);
  }

  if (termModalBackdrop) {
    termModalBackdrop.addEventListener("click", closeTermModal);
  }

  if (closeAddTermBtn) {
    closeAddTermBtn.addEventListener("click", closeAddTermModal);
  }

  if (cancelAddTerm) {
    cancelAddTerm.addEventListener("click", closeAddTermModal);
  }

  if (addTermBackdrop) {
    addTermBackdrop.addEventListener("click", closeAddTermModal);
  }

  if (addTermForm) {
    addTermForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const termPayload = {
        term_hash: newTermHash.value,
        name: newTermName.value,
        start_date: newTermStartDate.value || "Unknown",
        end_date: newTermEndDate.value || "Unknown"
      };

      if (editingTermHash) {
        termsData = termsData.map((term) => {
          if (term.term_hash === editingTermHash) {
            return {
              ...term,
              ...termPayload
            };
          }
          return term;
        });
      } else {
        termsData.push({
          ...termPayload,
          created_at: new Date().toISOString().split("T")[0]
        });
      }

      renderTerms(termsData);
      closeAddTermModal();
    });
  }
}

// =========================
// Courses Page
// =========================
const coursesTableBody = document.getElementById("coursesTableBody");
const courseSearch = document.getElementById("courseSearch");
const refreshCoursesBtn = document.getElementById("refreshCoursesBtn");
const addCourseBtn = document.getElementById("addCourseBtn");

const courseViewModal = document.getElementById("courseViewModal");
const closeCourseModalBtn = document.getElementById("closeCourseModalBtn");
const courseModalBackdrop = document.getElementById("courseModalBackdrop");

const detailCourseHash = document.getElementById("detailCourseHash");
const detailCourseCode = document.getElementById("detailCourseCode");
const detailCourseTitle = document.getElementById("detailCourseTitle");
const detailCourseDescription = document.getElementById("detailCourseDescription");
const detailCourseCredits = document.getElementById("detailCourseCredits");
const detailCourseCreatedAt = document.getElementById("detailCourseCreatedAt");
const detailCourseUpdatedAt = document.getElementById("detailCourseUpdatedAt");

const addCourseModal = document.getElementById("addCourseModal");
const addCourseBackdrop = document.getElementById("addCourseBackdrop");
const closeAddCourseBtn = document.getElementById("closeAddCourseBtn");
const cancelAddCourse = document.getElementById("cancelAddCourse");
const addCourseForm = document.getElementById("addCourseForm");

const courseFormTitle = document.getElementById("courseFormTitle");
const saveCourseBtn = document.getElementById("saveCourseBtn");

const newCourseHash = document.getElementById("newCourseHash");
const newCourseCode = document.getElementById("newCourseCode");
const newCourseTitle = document.getElementById("newCourseTitle");
const newCourseDescription = document.getElementById("newCourseDescription");
const newCourseCredits = document.getElementById("newCourseCredits");

let coursesData = [];
let editingCourseHash = null;

const mockCourses = [
  {
    course_hash: "CRS_001",
    code: "MATH101",
    title: "Mathematics",
    description: "Core mathematics course",
    credits: "3",
    created_at: "2026-03-01",
    updated_at: "2026-03-01"
  },
  {
    course_hash: "CRS_002",
    code: "PHY101",
    title: "Physics",
    description: "Introductory physics course",
    credits: "4",
    created_at: "2026-03-02",
    updated_at: "2026-03-02"
  }
];

function renderCourses(data) {
  if (!coursesTableBody) return;

  if (!data || data.length === 0) {
    coursesTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="a-table-empty">No courses found.</td>
      </tr>
    `;
    return;
  }

  coursesTableBody.innerHTML = data.map((course) => `
    <tr>
      <td>${formatValue(course.course_hash)}</td>
      <td>${formatValue(course.code)}</td>
      <td>${formatValue(course.title)}</td>
      <td>${formatValue(course.credits)}</td>
      <td>${formatValue(course.created_at)}</td>
      <td>${formatValue(course.updated_at)}</td>
      <td>
        <div class="a-table-actions">
          <button class="a-action-btn" onclick="viewCourse('${course.course_hash || ""}')">View</button>
          <button class="a-action-btn" onclick="editCourse('${course.course_hash || ""}')">Edit</button>
          <button class="a-action-btn a-action-btn--danger" onclick="deleteCourse('${course.course_hash || ""}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function fetchCourses() {
  if (!coursesTableBody) return;

  coursesTableBody.innerHTML = `
    <tr>
      <td colspan="7" class="a-table-empty">Loading courses...</td>
    </tr>
  `;

  try {
    const token = typeof getToken === "function" ? getToken() : localStorage.getItem("token");
    const response = await apiRequest("/get_courses", "GET", null, token);

    if (Array.isArray(response) && response.length > 0) {
      coursesData = response.map((course) => ({
        course_hash: course.course_hash || "Unknown",
        code: course.code || "Unknown",
        title: course.title || "Unknown",
        description: course.description || "Unknown",
        credits: course.credits || "Unknown",
        created_at: course.created_at || "Unknown",
        updated_at: course.updated_at || "Unknown"
      }));
    } else {
      coursesData = mockCourses;
    }

    renderCourses(coursesData);
  } catch (error) {
    console.error("Error fetching courses:", error);
    coursesData = mockCourses;
    renderCourses(coursesData);
  }
}

function filterCourses() {
  if (!courseSearch) return;

  const query = courseSearch.value.trim().toLowerCase();

  const filtered = coursesData.filter((course) =>
    String(course.course_hash).toLowerCase().includes(query) ||
    String(course.code).toLowerCase().includes(query) ||
    String(course.title).toLowerCase().includes(query)
  );

  renderCourses(filtered);
}

function viewCourse(courseHash) {
  const course = coursesData.find((item) => item.course_hash === courseHash);
  if (!course || !courseViewModal) return;

  detailCourseHash.textContent = formatValue(course.course_hash);
  detailCourseCode.textContent = formatValue(course.code);
  detailCourseTitle.textContent = formatValue(course.title);
  detailCourseDescription.textContent = formatValue(course.description);
  detailCourseCredits.textContent = formatValue(course.credits);
  detailCourseCreatedAt.textContent = formatValue(course.created_at);
  detailCourseUpdatedAt.textContent = formatValue(course.updated_at);

  courseViewModal.classList.add("show");
}

function closeCourseModal() {
  if (!courseViewModal) return;
  courseViewModal.classList.remove("show");
}

function openAddCourseModal() {
  if (!addCourseModal) return;

  editingCourseHash = null;

  if (courseFormTitle) courseFormTitle.textContent = "Add Course";
  if (saveCourseBtn) saveCourseBtn.textContent = "Save Course";
  if (addCourseForm) addCourseForm.reset();

  if (newCourseHash) {
    newCourseHash.disabled = false;
  }

  addCourseModal.classList.add("show");
}

function closeAddCourseModal() {
  if (!addCourseModal) return;

  addCourseModal.classList.remove("show");
  editingCourseHash = null;

  if (addCourseForm) addCourseForm.reset();

  if (newCourseHash) {
    newCourseHash.disabled = false;
  }

  if (courseFormTitle) courseFormTitle.textContent = "Add Course";
  if (saveCourseBtn) saveCourseBtn.textContent = "Save Course";
}

function editCourse(courseHash) {
  const course = coursesData.find((item) => item.course_hash === courseHash);
  if (!course || !addCourseModal) return;

  editingCourseHash = courseHash;

  if (courseFormTitle) courseFormTitle.textContent = "Edit Course";
  if (saveCourseBtn) saveCourseBtn.textContent = "Update Course";

  newCourseHash.value = course.course_hash || "";
  newCourseCode.value = course.code || "";
  newCourseTitle.value = course.title || "";
  newCourseDescription.value = course.description || "";
  newCourseCredits.value = course.credits || "";

  if (newCourseHash) {
    newCourseHash.disabled = true;
  }

  addCourseModal.classList.add("show");
}

function deleteCourse(courseHash) {
  const confirmed = confirm(`Are you sure you want to delete course ${courseHash}?`);
  if (!confirmed) return;

  coursesData = coursesData.filter((course) => course.course_hash !== courseHash);
  renderCourses(coursesData);
}

if (coursesTableBody) {
  fetchCourses();

  if (courseSearch) courseSearch.addEventListener("input", filterCourses);
  if (refreshCoursesBtn) refreshCoursesBtn.addEventListener("click", fetchCourses);
  if (addCourseBtn) addCourseBtn.addEventListener("click", openAddCourseModal);

  if (closeCourseModalBtn) {
    closeCourseModalBtn.addEventListener("click", closeCourseModal);
  }

  if (courseModalBackdrop) {
    courseModalBackdrop.addEventListener("click", closeCourseModal);
  }

  if (closeAddCourseBtn) {
    closeAddCourseBtn.addEventListener("click", closeAddCourseModal);
  }

  if (cancelAddCourse) {
    cancelAddCourse.addEventListener("click", closeAddCourseModal);
  }

  if (addCourseBackdrop) {
    addCourseBackdrop.addEventListener("click", closeAddCourseModal);
  }

  if (addCourseForm) {
    addCourseForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const coursePayload = {
        course_hash: newCourseHash.value,
        code: newCourseCode.value,
        title: newCourseTitle.value,
        description: newCourseDescription.value || "Unknown",
        credits: newCourseCredits.value || "Unknown",
        updated_at: new Date().toISOString().split("T")[0]
      };

      if (editingCourseHash) {
        coursesData = coursesData.map((course) => {
          if (course.course_hash === editingCourseHash) {
            return {
              ...course,
              ...coursePayload
            };
          }
          return course;
        });
      } else {
        coursesData.push({
          ...coursePayload,
          created_at: new Date().toISOString().split("T")[0]
        });
      }

      renderCourses(coursesData);
      closeAddCourseModal();
    });
  }
}