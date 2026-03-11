// Parents Page
// renderParents
// fetchParents
// filterParents
// viewParent
// openAddParentModal
// editParent
// deleteParent

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
