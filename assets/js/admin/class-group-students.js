const classGroupStudentsTableBody = document.getElementById("classGroupStudentsTableBody");
const classHashInput = document.getElementById("classHashInput");
const loadClassGroupStudentsBtn = document.getElementById("loadClassGroupStudentsBtn");
const refreshClassGroupStudentsBtn = document.getElementById("refreshClassGroupStudentsBtn");
const classGroupStudentsSearch = document.getElementById("classGroupStudentsSearch");
const assignStudentBtn = document.getElementById("assignStudentBtn");

const classGroupStudentViewModal = document.getElementById("classGroupStudentViewModal");
const classGroupStudentBackdrop = document.getElementById("classGroupStudentBackdrop");
const closeClassGroupStudentModalBtn = document.getElementById("closeClassGroupStudentModalBtn");

const detailClassStudentHash = document.getElementById("detailClassStudentHash");
const detailClassUsername = document.getElementById("detailClassUsername");
const detailClassFirstName = document.getElementById("detailClassFirstName");
const detailClassLastName = document.getElementById("detailClassLastName");
const detailClassEmail = document.getElementById("detailClassEmail");
const detailClassPhone = document.getElementById("detailClassPhone");
const detailClassCreatedAt = document.getElementById("detailClassCreatedAt");

const assignStudentModal = document.getElementById("assignStudentModal");
const assignStudentBackdrop = document.getElementById("assignStudentBackdrop");
const closeAssignStudentBtn = document.getElementById("closeAssignStudentBtn");
const cancelAssignStudent = document.getElementById("cancelAssignStudent");
const assignStudentForm = document.getElementById("assignStudentForm");

const assignStudentHashInput = document.getElementById("assignStudentHashInput");
const assignClassHashInput = document.getElementById("assignClassHashInput");
const assignTermHashInput = document.getElementById("assignTermHashInput");

let classGroupStudentsData = [];

const mockClassGroupStudents = [
  {
    student_hash: "STU_001",
    username: "ahmad.ali",
    first_name: "Ahmad",
    last_name: "Ali",
    email: "ahmad@example.com",
    phone: "03 111 222",
    created_at: "2026-03-01"
  },
  {
    student_hash: "STU_002",
    username: "lina.hassan",
    first_name: "Lina",
    last_name: "Hassan",
    email: "lina@example.com",
    phone: "70 222 333",
    created_at: "2026-03-02"
  }
];

function renderClassGroupStudents(data) {
  if (!classGroupStudentsTableBody) return;

  if (!data || data.length === 0) {
    classGroupStudentsTableBody.innerHTML = `
      <tr>
        <td colspan="8" class="a-table-empty">No students found for this class.</td>
      </tr>
    `;
    return;
  }

  classGroupStudentsTableBody.innerHTML = data.map((item) => `
    <tr>
      <td>${formatValue(item.student_hash)}</td>
      <td>${formatValue(item.username)}</td>
      <td>${formatValue(item.first_name)}</td>
      <td>${formatValue(item.last_name)}</td>
      <td>${formatValue(item.email)}</td>
      <td>${formatValue(item.phone)}</td>
      <td>${formatValue(item.created_at)}</td>
      <td>
        <div class="a-table-actions">
          <button class="a-action-btn" onclick="viewClassGroupStudent('${item.student_hash}')">View</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function fetchClassGroupStudents() {
  if (!classGroupStudentsTableBody) return;

  const classHash = classHashInput ? classHashInput.value.trim() : "";

  if (!classHash) {
    classGroupStudentsTableBody.innerHTML = `
      <tr>
        <td colspan="8" class="a-table-empty">Please enter a class hash first.</td>
      </tr>
    `;
    return;
  }

  classGroupStudentsTableBody.innerHTML = `
    <tr>
      <td colspan="8" class="a-table-empty">Loading class students...</td>
    </tr>
  `;

  try {
    const token = typeof getToken === "function" ? getToken() : localStorage.getItem("token");

    const response = await apiRequest(
      "/get_class_group_students",
      "POST",
      { class_hash: classHash },
      token
    );

    if (Array.isArray(response) && response.length > 0) {
      classGroupStudentsData = response.map((item) => ({
        student_hash: item.student_hash || "Unknown",
        username: item.username || "Unknown",
        first_name: item.first_name || "Unknown",
        last_name: item.last_name || "Unknown",
        email: item.email || "Unknown",
        phone: item.phone || "Unknown",
        created_at: item.created_at || "Unknown"
      }));
    } else {
      classGroupStudentsData = mockClassGroupStudents;
    }

    renderClassGroupStudents(classGroupStudentsData);
  } catch (error) {
    console.error("Error fetching class group students:", error);
    classGroupStudentsData = mockClassGroupStudents;
    renderClassGroupStudents(classGroupStudentsData);
  }
}

function filterClassGroupStudents() {
  if (!classGroupStudentsSearch) return;

  const query = classGroupStudentsSearch.value.trim().toLowerCase();

  const filtered = classGroupStudentsData.filter((item) =>
    String(item.student_hash).toLowerCase().includes(query) ||
    String(item.username).toLowerCase().includes(query) ||
    String(item.first_name).toLowerCase().includes(query) ||
    String(item.last_name).toLowerCase().includes(query) ||
    String(item.email).toLowerCase().includes(query)
  );

  renderClassGroupStudents(filtered);
}

function viewClassGroupStudent(studentHash) {
  const item = classGroupStudentsData.find((entry) => entry.student_hash === studentHash);
  if (!item || !classGroupStudentViewModal) return;

  detailClassStudentHash.textContent = formatValue(item.student_hash);
  detailClassUsername.textContent = formatValue(item.username);
  detailClassFirstName.textContent = formatValue(item.first_name);
  detailClassLastName.textContent = formatValue(item.last_name);
  detailClassEmail.textContent = formatValue(item.email);
  detailClassPhone.textContent = formatValue(item.phone);
  detailClassCreatedAt.textContent = formatValue(item.created_at);

  classGroupStudentViewModal.classList.add("show");
}

function closeClassGroupStudentModal() {
  if (!classGroupStudentViewModal) return;
  classGroupStudentViewModal.classList.remove("show");
}

function openAssignStudentModal() {
  if (!assignStudentModal) return;

  if (assignStudentForm) assignStudentForm.reset();

  if (assignClassHashInput && classHashInput) {
    assignClassHashInput.value = classHashInput.value.trim();
  }

  assignStudentModal.classList.add("show");
}

function closeAssignStudentModal() {
  if (!assignStudentModal) return;
  assignStudentModal.classList.remove("show");

  if (assignStudentForm) {
    assignStudentForm.reset();
  }
}

if (classGroupStudentsTableBody) {
  if (loadClassGroupStudentsBtn) loadClassGroupStudentsBtn.addEventListener("click", fetchClassGroupStudents);
  if (refreshClassGroupStudentsBtn) refreshClassGroupStudentsBtn.addEventListener("click", fetchClassGroupStudents);
  if (classGroupStudentsSearch) classGroupStudentsSearch.addEventListener("input", filterClassGroupStudents);
  if (assignStudentBtn) assignStudentBtn.addEventListener("click", openAssignStudentModal);

  if (closeClassGroupStudentModalBtn) closeClassGroupStudentModalBtn.addEventListener("click", closeClassGroupStudentModal);
  if (classGroupStudentBackdrop) classGroupStudentBackdrop.addEventListener("click", closeClassGroupStudentModal);

  if (closeAssignStudentBtn) closeAssignStudentBtn.addEventListener("click", closeAssignStudentModal);
  if (cancelAssignStudent) cancelAssignStudent.addEventListener("click", closeAssignStudentModal);
  if (assignStudentBackdrop) assignStudentBackdrop.addEventListener("click", closeAssignStudentModal);
}

if (assignStudentForm) {
  assignStudentForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const payload = {
      student_hash: assignStudentHashInput.value,
      class_hash: assignClassHashInput.value,
      term_hash: assignTermHashInput.value
    };

    try {
      const token = typeof getToken === "function" ? getToken() : localStorage.getItem("token");
      await apiRequest("/assign_student_to_class_group", "POST", payload, token);

      alert("Student assigned");
      closeAssignStudentModal();
      fetchClassGroupStudents();
    } catch (error) {
      console.error("Error assigning student to class group:", error);
      alert("Failed to assign student");
    }
  });
}