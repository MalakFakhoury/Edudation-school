// Sections Page
// renderSections
// fetchSections
// viewSection
// openAddSectionModal
// closeAddSectionModal

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