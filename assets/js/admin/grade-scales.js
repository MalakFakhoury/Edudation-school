const gradeScalesTableBody = document.getElementById("gradeScalesTableBody");
const gradeScaleSearch = document.getElementById("gradeScaleSearch");
const refreshGradeScalesBtn = document.getElementById("refreshGradeScalesBtn");

const gradeScaleViewModal = document.getElementById("gradeScaleViewModal");
const gradeScaleBackdrop = document.getElementById("gradeScaleBackdrop");
const closeGradeScaleModalBtn = document.getElementById("closeGradeScaleModalBtn");

const detailScaleHash = document.getElementById("detailScaleHash");
const detailScaleName = document.getElementById("detailScaleName");
const detailScaleCreatedAt = document.getElementById("detailScaleCreatedAt");
const detailScaleSteps = document.getElementById("detailScaleSteps");

const addGradeStepModal = document.getElementById("addGradeStepModal");
const addGradeStepBackdrop = document.getElementById("addGradeStepBackdrop");
const closeAddGradeStepBtn = document.getElementById("closeAddGradeStepBtn");
const cancelAddGradeStep = document.getElementById("cancelAddGradeStep");
const addGradeStepForm = document.getElementById("addGradeStepForm");

const gradeStepScaleHash = document.getElementById("gradeStepScaleHash");
const gradeStepLetter = document.getElementById("gradeStepLetter");
const gradeStepMinPercent = document.getElementById("gradeStepMinPercent");
const gradeStepGpaPoints = document.getElementById("gradeStepGpaPoints");

let gradeScalesData = [];
let selectedScaleHash = null;

const mockGradeScales = [
  {
    scale_hash: "SCALE_001",
    name: "Standard GPA Scale",
    created_at: "2026-03-01",
    steps: ["STEP_001", "STEP_002", "STEP_003"]
  },
  {
    scale_hash: "SCALE_002",
    name: "Pass Fail Scale",
    created_at: "2026-03-02",
    steps: ["STEP_010", "STEP_011"]
  }
];

function renderGradeScales(data) {
  if (!gradeScalesTableBody) return;

  if (!data || data.length === 0) {
    gradeScalesTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="a-table-empty">No grade scales found.</td>
      </tr>
    `;
    return;
  }

  gradeScalesTableBody.innerHTML = data.map((item) => `
    <tr>
      <td>${formatValue(item.scale_hash)}</td>
      <td>${formatValue(item.name)}</td>
      <td>${formatValue(item.created_at)}</td>
      <td>${Array.isArray(item.steps) ? item.steps.length : 0}</td>
      <td>
        <div class="a-table-actions">
          <button class="a-action-btn" onclick="viewGradeScale('${item.scale_hash}')">View</button>
          <button class="a-action-btn" onclick="openAddGradeStep('${item.scale_hash}')">Add Step</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function fetchGradeScales() {
  if (!gradeScalesTableBody) return;

  gradeScalesTableBody.innerHTML = `
    <tr>
      <td colspan="5" class="a-table-empty">Loading grade scales...</td>
    </tr>
  `;

  try {
    const token =
      typeof getToken === "function"
        ? getToken()
        : localStorage.getItem("token");

    const response = await apiRequest("/get_grade_scales", "GET", null, token);

    if (Array.isArray(response) && response.length > 0) {
      gradeScalesData = response.map((item) => ({
        scale_hash: item.scale_hash || "Unknown",
        name: item.name || "Unknown",
        created_at: item.created_at || "Unknown",
        steps: Array.isArray(item.steps) ? item.steps : []
      }));
    } else {
      gradeScalesData = mockGradeScales;
    }

    renderGradeScales(gradeScalesData);
  } catch (error) {
    console.error("Error fetching grade scales:", error);
    gradeScalesData = mockGradeScales;
    renderGradeScales(gradeScalesData);
  }
}

function filterGradeScales() {
  if (!gradeScaleSearch) return;

  const query = gradeScaleSearch.value.trim().toLowerCase();

  const filtered = gradeScalesData.filter((item) =>
    String(item.scale_hash).toLowerCase().includes(query) ||
    String(item.name).toLowerCase().includes(query)
  );

  renderGradeScales(filtered);
}

function viewGradeScale(scaleHash) {
  const item = gradeScalesData.find((entry) => entry.scale_hash === scaleHash);
  if (!item || !gradeScaleViewModal) return;

  detailScaleHash.textContent = formatValue(item.scale_hash);
  detailScaleName.textContent = formatValue(item.name);
  detailScaleCreatedAt.textContent = formatValue(item.created_at);
  detailScaleSteps.textContent = Array.isArray(item.steps) && item.steps.length > 0
    ? item.steps.join(", ")
    : "No steps";

  gradeScaleViewModal.classList.add("show");
}

function closeGradeScaleModal() {
  if (!gradeScaleViewModal) return;
  gradeScaleViewModal.classList.remove("show");
}

function openAddGradeStep(scaleHash) {
  selectedScaleHash = scaleHash;

  if (gradeStepScaleHash) {
    gradeStepScaleHash.value = scaleHash;
  }

  if (addGradeStepForm) {
    addGradeStepForm.reset();
    gradeStepScaleHash.value = scaleHash;
  }

  if (addGradeStepModal) {
    addGradeStepModal.classList.add("show");
  }
}

function closeAddGradeStepModal() {
  if (!addGradeStepModal) return;

  addGradeStepModal.classList.remove("show");

  if (addGradeStepForm) {
    addGradeStepForm.reset();
  }

  selectedScaleHash = null;
}

if (gradeScalesTableBody) {
  fetchGradeScales();

  if (gradeScaleSearch) {
    gradeScaleSearch.addEventListener("input", filterGradeScales);
  }

  if (refreshGradeScalesBtn) {
    refreshGradeScalesBtn.addEventListener("click", fetchGradeScales);
  }

  if (closeGradeScaleModalBtn) {
    closeGradeScaleModalBtn.addEventListener("click", closeGradeScaleModal);
  }

  if (gradeScaleBackdrop) {
    gradeScaleBackdrop.addEventListener("click", closeGradeScaleModal);
  }

  if (closeAddGradeStepBtn) {
    closeAddGradeStepBtn.addEventListener("click", closeAddGradeStepModal);
  }

  if (cancelAddGradeStep) {
    cancelAddGradeStep.addEventListener("click", closeAddGradeStepModal);
  }

  if (addGradeStepBackdrop) {
    addGradeStepBackdrop.addEventListener("click", closeAddGradeStepModal);
  }
}

if (addGradeStepForm) {
  addGradeStepForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const payload = {
      scale_hash: gradeStepScaleHash.value,
      letter: gradeStepLetter.value,
      min_percent: Number(gradeStepMinPercent.value),
      gpa_points: gradeStepGpaPoints.value ? Number(gradeStepGpaPoints.value) : null
    };

    try {
      const token =
        typeof getToken === "function"
          ? getToken()
          : localStorage.getItem("token");

      await apiRequest("/add_grade_scale_step", "POST", payload, token);

      alert("Grade scale step saved");
      closeAddGradeStepModal();
      fetchGradeScales();
    } catch (error) {
      console.error("Error adding grade scale step:", error);
      alert("Failed to save step");
    }
  });
}