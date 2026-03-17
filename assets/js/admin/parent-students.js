const parentStudentsTableBody = document.getElementById("parentStudentsTableBody");
const parentHashInput = document.getElementById("parentHashInput");
const loadParentStudentsBtn = document.getElementById("loadParentStudentsBtn");
const refreshParentStudentsBtn = document.getElementById("refreshParentStudentsBtn");
const parentStudentsSearch = document.getElementById("parentStudentsSearch");
const addParentStudentBtn = document.getElementById("addParentStudentBtn");

const parentStudentViewModal = document.getElementById("parentStudentViewModal");
const parentStudentBackdrop = document.getElementById("parentStudentBackdrop");
const closeParentStudentModalBtn = document.getElementById("closeParentStudentModalBtn");

const detailLinkHash = document.getElementById("detailLinkHash");
const detailLinkRelation = document.getElementById("detailLinkRelation");
const detailLinkedAt = document.getElementById("detailLinkedAt");
const detailLinkedStudentHash = document.getElementById("detailLinkedStudentHash");
const detailLinkedUsername = document.getElementById("detailLinkedUsername");
const detailLinkedFirstName = document.getElementById("detailLinkedFirstName");
const detailLinkedLastName = document.getElementById("detailLinkedLastName");
const detailLinkedEmail = document.getElementById("detailLinkedEmail");

const linkParentStudentModal = document.getElementById("linkParentStudentModal");
const linkParentStudentBackdrop = document.getElementById("linkParentStudentBackdrop");
const closeLinkParentStudentBtn = document.getElementById("closeLinkParentStudentBtn");
const cancelLinkParentStudent = document.getElementById("cancelLinkParentStudent");
const linkParentStudentForm = document.getElementById("linkParentStudentForm");

const linkParentHashInput = document.getElementById("linkParentHashInput");
const linkStudentHashInput = document.getElementById("linkStudentHashInput");
const linkRelationInput = document.getElementById("linkRelationInput");

let parentStudentsData = [];

const mockParentStudents = [
  {
    link_hash: "LINK_001",
    relation: "father",
    linked_at: "2026-03-01",
    student_hash: "STU_001",
    username: "ahmad.ali",
    first_name: "Ahmad",
    last_name: "Ali",
    email: "ahmad@example.com"
  },
  {
    link_hash: "LINK_002",
    relation: "mother",
    linked_at: "2026-03-02",
    student_hash: "STU_002",
    username: "lina.hassan",
    first_name: "Lina",
    last_name: "Hassan",
    email: "lina@example.com"
  }
];

function renderParentStudents(data) {
  if (!parentStudentsTableBody) return;

  if (!data || data.length === 0) {
    parentStudentsTableBody.innerHTML = `
      <tr>
        <td colspan="9" class="a-table-empty">No linked students found.</td>
      </tr>
    `;
    return;
  }

  parentStudentsTableBody.innerHTML = data.map((item) => `
    <tr>
      <td>${formatValue(item.link_hash)}</td>
      <td>${formatValue(item.relation)}</td>
      <td>${formatValue(item.linked_at)}</td>
      <td>${formatValue(item.student_hash)}</td>
      <td>${formatValue(item.username)}</td>
      <td>${formatValue(item.first_name)}</td>
      <td>${formatValue(item.last_name)}</td>
      <td>${formatValue(item.email)}</td>
      <td>
        <div class="a-table-actions">
          <button class="a-action-btn" onclick="viewParentStudent('${item.link_hash}')">View</button>
          <button class="a-action-btn a-action-btn--danger" onclick="unlinkParentStudent('${item.student_hash}')">Unlink</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function fetchParentStudents() {
  if (!parentStudentsTableBody) return;

  const parentHash = parentHashInput ? parentHashInput.value.trim() : "";

  if (!parentHash) {
    parentStudentsTableBody.innerHTML = `
      <tr>
        <td colspan="9" class="a-table-empty">Please enter a parent hash first.</td>
      </tr>
    `;
    return;
  }

  parentStudentsTableBody.innerHTML = `
    <tr>
      <td colspan="9" class="a-table-empty">Loading linked students...</td>
    </tr>
  `;

  try {
    const token = typeof getToken === "function" ? getToken() : localStorage.getItem("token");
    const response = await apiRequest(
      "/get_parent_students",
      "POST",
      { parent_hash: parentHash },
      token
    );

    if (Array.isArray(response) && response.length > 0) {
      parentStudentsData = response.map((item) => ({
        link_hash: item.link_hash || "Unknown",
        relation: item.relation || "Unknown",
        linked_at: item.linked_at || "Unknown",
        student_hash: item.student_hash || "Unknown",
        username: item.username || "Unknown",
        first_name: item.first_name || "Unknown",
        last_name: item.last_name || "Unknown",
        email: item.email || "Unknown"
      }));
    } else {
      parentStudentsData = mockParentStudents;
    }

    renderParentStudents(parentStudentsData);
  } catch (error) {
    console.error("Error fetching parent students:", error);
    parentStudentsData = mockParentStudents;
    renderParentStudents(parentStudentsData);
  }
}

function filterParentStudents() {
  if (!parentStudentsSearch) return;

  const query = parentStudentsSearch.value.trim().toLowerCase();

  const filtered = parentStudentsData.filter((item) =>
    String(item.student_hash).toLowerCase().includes(query) ||
    String(item.username).toLowerCase().includes(query) ||
    String(item.first_name).toLowerCase().includes(query) ||
    String(item.last_name).toLowerCase().includes(query) ||
    String(item.email).toLowerCase().includes(query)
  );

  renderParentStudents(filtered);
}

function viewParentStudent(linkHash) {
  const item = parentStudentsData.find((entry) => entry.link_hash === linkHash);
  if (!item || !parentStudentViewModal) return;

  detailLinkHash.textContent = formatValue(item.link_hash);
  detailLinkRelation.textContent = formatValue(item.relation);
  detailLinkedAt.textContent = formatValue(item.linked_at);
  detailLinkedStudentHash.textContent = formatValue(item.student_hash);
  detailLinkedUsername.textContent = formatValue(item.username);
  detailLinkedFirstName.textContent = formatValue(item.first_name);
  detailLinkedLastName.textContent = formatValue(item.last_name);
  detailLinkedEmail.textContent = formatValue(item.email);

  parentStudentViewModal.classList.add("show");
}

function closeParentStudentModal() {
  if (!parentStudentViewModal) return;
  parentStudentViewModal.classList.remove("show");
}

function openLinkParentStudentModal() {
  if (!linkParentStudentModal) return;

  if (linkParentStudentForm) linkParentStudentForm.reset();

  if (linkParentHashInput && parentHashInput) {
    linkParentHashInput.value = parentHashInput.value.trim();
  }

  linkParentStudentModal.classList.add("show");
}

function closeLinkParentStudentModal() {
  if (!linkParentStudentModal) return;

  linkParentStudentModal.classList.remove("show");

  if (linkParentStudentForm) {
    linkParentStudentForm.reset();
  }
}

async function unlinkParentStudent(studentHash) {
  const parentHash = parentHashInput ? parentHashInput.value.trim() : "";

  if (!parentHash) {
    alert("Please enter a parent hash first");
    return;
  }

  const confirmed = confirm(`Unlink student ${studentHash} from parent ${parentHash}?`);
  if (!confirmed) return;

  try {
    const token = typeof getToken === "function" ? getToken() : localStorage.getItem("token");

    const payload = {
      parent_hash: parentHash,
      student_hash: studentHash,
      relation: null
    };

    await apiRequest("/admin_unlink_parent_student", "POST", payload, token);

    alert("Student unlinked");
    fetchParentStudents();
  } catch (error) {
    console.error("Error unlinking parent/student:", error);
    alert("Failed to unlink");
  }
}

if (parentStudentsTableBody) {
  if (loadParentStudentsBtn) loadParentStudentsBtn.addEventListener("click", fetchParentStudents);
  if (refreshParentStudentsBtn) refreshParentStudentsBtn.addEventListener("click", fetchParentStudents);
  if (parentStudentsSearch) parentStudentsSearch.addEventListener("input", filterParentStudents);
  if (addParentStudentBtn) addParentStudentBtn.addEventListener("click", openLinkParentStudentModal);

  if (closeParentStudentModalBtn) closeParentStudentModalBtn.addEventListener("click", closeParentStudentModal);
  if (parentStudentBackdrop) parentStudentBackdrop.addEventListener("click", closeParentStudentModal);

  if (closeLinkParentStudentBtn) closeLinkParentStudentBtn.addEventListener("click", closeLinkParentStudentModal);
  if (cancelLinkParentStudent) cancelLinkParentStudent.addEventListener("click", closeLinkParentStudentModal);
  if (linkParentStudentBackdrop) linkParentStudentBackdrop.addEventListener("click", closeLinkParentStudentModal);
}

if (linkParentStudentForm) {
  linkParentStudentForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const payload = {
      parent_hash: linkParentHashInput.value,
      student_hash: linkStudentHashInput.value,
      relation: linkRelationInput.value || null
    };

    try {
      const token = typeof getToken === "function" ? getToken() : localStorage.getItem("token");
      await apiRequest("/link_parent_student", "POST", payload, token);

      alert("Parent linked to student");
      closeLinkParentStudentModal();
      fetchParentStudents();
    } catch (error) {
      console.error("Error linking parent/student:", error);
      alert("Failed to link");
    }
  });
}