// renderCourses
// fetchCourses
// filterCourses

const classesTableBody = document.getElementById("classesTableBody");
const classSearch = document.getElementById("classSearch");
const refreshClassesBtn = document.getElementById("refreshClassesBtn");
const addClassBtn = document.getElementById("addClassBtn");

const classViewModal = document.getElementById("classViewModal");
const closeClassModalBtn = document.getElementById("closeClassModalBtn");
const classModalBackdrop = document.getElementById("classModalBackdrop");

const detailClassHash = document.getElementById("detailClassHash");
const detailClassGradeHash = document.getElementById("detailClassGradeHash");
const detailClassSectionHash = document.getElementById("detailClassSectionHash");

const addClassModal = document.getElementById("addClassModal");
const addClassBackdrop = document.getElementById("addClassBackdrop");
const closeAddClassBtn = document.getElementById("closeAddClassBtn");
const cancelAddClass = document.getElementById("cancelAddClass");
const addClassForm = document.getElementById("addClassForm");

const classFormTitle = document.getElementById("classFormTitle");
const saveClassBtn = document.getElementById("saveClassBtn");

const newClassHash = document.getElementById("newClassHash");
const newClassGradeHash = document.getElementById("newClassGradeHash");
const newClassSectionHash = document.getElementById("newClassSectionHash");

let classesData = [];
let editingClassHash = null;

const mockClasses = [
  {
    class_hash: "CLS_001",
    grade_hash: "GRD_001",
    section_hash: "SEC_001"
  },
  {
    class_hash: "CLS_002",
    grade_hash: "GRD_002",
    section_hash: "SEC_002"
  }
];

function renderClasses(data) {
  if (!classesTableBody) return;

  if (!data || data.length === 0) {
    classesTableBody.innerHTML = `
      <tr>
        <td colspan="4" class="a-table-empty">No classes found.</td>
      </tr>
    `;
    return;
  }

  classesTableBody.innerHTML = data.map((item) => `
    <tr>
      <td>${formatValue(item.class_hash)}</td>
      <td>${formatValue(item.grade_hash)}</td>
      <td>${formatValue(item.section_hash)}</td>
      <td>
        <div class="a-table-actions">
          <button class="a-action-btn" onclick="viewClassItem('${item.class_hash || ""}')">View</button>
          <button class="a-action-btn" onclick="editClassItem('${item.class_hash || ""}')">Edit</button>
          <button class="a-action-btn a-action-btn--danger" onclick="deleteClassItem('${item.class_hash || ""}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function fetchClasses() {
  if (!classesTableBody) return;

  classesTableBody.innerHTML = `
    <tr>
      <td colspan="4" class="a-table-empty">Loading classes...</td>
    </tr>
  `;

  try {
    const token = typeof getToken === "function" ? getToken() : localStorage.getItem("token");
    const response = await apiRequest("/get_classes", "GET", null, token);

    if (Array.isArray(response) && response.length > 0) {
      classesData = response.map((item) => ({
        class_hash: item.class_hash || "Unknown",
        grade_hash: item.grade_hash || "Unknown",
        section_hash: item.section_hash || "Unknown"
      }));
    } else {
      classesData = mockClasses;
    }

    renderClasses(classesData);
  } catch (error) {
    console.error("Error fetching classes:", error);
    classesData = mockClasses;
    renderClasses(classesData);
  }
}

function filterClasses() {
  if (!classSearch) return;

  const query = classSearch.value.trim().toLowerCase();

  const filtered = classesData.filter((item) =>
    String(item.class_hash).toLowerCase().includes(query) ||
    String(item.grade_hash).toLowerCase().includes(query) ||
    String(item.section_hash).toLowerCase().includes(query)
  );

  renderClasses(filtered);
}

function viewClassItem(classHash) {
  const item = classesData.find((entry) => entry.class_hash === classHash);
  if (!item || !classViewModal) return;

  detailClassHash.textContent = formatValue(item.class_hash);
  detailClassGradeHash.textContent = formatValue(item.grade_hash);
  detailClassSectionHash.textContent = formatValue(item.section_hash);

  classViewModal.classList.add("show");
}

function closeClassModal() {
  if (!classViewModal) return;
  classViewModal.classList.remove("show");
}

function openAddClassModal() {
  if (!addClassModal) return;

  editingClassHash = null;

  if (classFormTitle) classFormTitle.textContent = "Add Class";
  if (saveClassBtn) saveClassBtn.textContent = "Save Class";
  if (addClassForm) addClassForm.reset();

  if (newClassHash) {
    newClassHash.disabled = false;
  }

  addClassModal.classList.add("show");
}

function closeAddClassModal() {
  if (!addClassModal) return;

  addClassModal.classList.remove("show");
  editingClassHash = null;

  if (addClassForm) addClassForm.reset();

  if (newClassHash) {
    newClassHash.disabled = false;
  }

  if (classFormTitle) classFormTitle.textContent = "Add Class";
  if (saveClassBtn) saveClassBtn.textContent = "Save Class";
}

function editClassItem(classHash) {
  const item = classesData.find((entry) => entry.class_hash === classHash);
  if (!item || !addClassModal) return;

  editingClassHash = classHash;

  if (classFormTitle) classFormTitle.textContent = "Edit Class";
  if (saveClassBtn) saveClassBtn.textContent = "Update Class";

  newClassHash.value = item.class_hash || "";
  newClassGradeHash.value = item.grade_hash || "";
  newClassSectionHash.value = item.section_hash || "";

  if (newClassHash) {
    newClassHash.disabled = true;
  }

  addClassModal.classList.add("show");
}

function deleteClassItem(classHash) {
  const confirmed = confirm(`Are you sure you want to delete class ${classHash}?`);
  if (!confirmed) return;

  classesData = classesData.filter((item) => item.class_hash !== classHash);
  renderClasses(classesData);
}

if (classesTableBody) {
  fetchClasses();

  if (classSearch) classSearch.addEventListener("input", filterClasses);
  if (refreshClassesBtn) refreshClassesBtn.addEventListener("click", fetchClasses);
  if (addClassBtn) addClassBtn.addEventListener("click", openAddClassModal);

  if (closeClassModalBtn) {
    closeClassModalBtn.addEventListener("click", closeClassModal);
  }

  if (classModalBackdrop) {
    classModalBackdrop.addEventListener("click", closeClassModal);
  }

  if (closeAddClassBtn) {
    closeAddClassBtn.addEventListener("click", closeAddClassModal);
  }

  if (cancelAddClass) {
    cancelAddClass.addEventListener("click", closeAddClassModal);
  }

  if (addClassBackdrop) {
    addClassBackdrop.addEventListener("click", closeAddClassModal);
  }

  if (addClassForm) {
    addClassForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const classPayload = {
        class_hash: newClassHash.value,
        grade_hash: newClassGradeHash.value || "Unknown",
        section_hash: newClassSectionHash.value || "Unknown"
      };

      if (editingClassHash) {
        classesData = classesData.map((item) => {
          if (item.class_hash === editingClassHash) {
            return {
              ...item,
              ...classPayload
            };
          }
          return item;
        });
      } else {
        classesData.push(classPayload);
      }

      renderClasses(classesData);
      closeAddClassModal();
    });
  }
}
