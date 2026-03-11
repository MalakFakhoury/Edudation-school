// Teachers Page
// renderTeachers
// fetchTeachers
// filterTeachers
// viewTeacher
// openAddTeacherModal
// editTeacher
// deleteTeacher

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