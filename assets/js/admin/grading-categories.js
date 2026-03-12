const gradingCategoriesTableBody = document.getElementById("gradingCategoriesTableBody");
const gradingCategorySearch = document.getElementById("gradingCategorySearch");
const refreshGradingCategoriesBtn = document.getElementById("refreshGradingCategoriesBtn");
const addGradingCategoryBtn = document.getElementById("addGradingCategoryBtn");

const gradingCategoryViewModal = document.getElementById("gradingCategoryViewModal");
const gradingCategoryBackdrop = document.getElementById("gradingCategoryBackdrop");
const closeGradingCategoryModalBtn = document.getElementById("closeGradingCategoryModalBtn");

const detailCategoryHash = document.getElementById("detailCategoryHash");
const detailCategoryName = document.getElementById("detailCategoryName");
const detailCategoryWeight = document.getElementById("detailCategoryWeight");
const detailCategoryCreatedAt = document.getElementById("detailCategoryCreatedAt");

const addGradingCategoryModal = document.getElementById("addGradingCategoryModal");
const addGradingCategoryBackdrop = document.getElementById("addGradingCategoryBackdrop");
const closeAddGradingCategoryBtn = document.getElementById("closeAddGradingCategoryBtn");
const cancelAddGradingCategory = document.getElementById("cancelAddGradingCategory");
const addGradingCategoryForm = document.getElementById("addGradingCategoryForm");

const gradingCategoryFormTitle = document.getElementById("gradingCategoryFormTitle");
const saveGradingCategoryBtn = document.getElementById("saveGradingCategoryBtn");

const gradingCategorySectionHash = document.getElementById("gradingCategorySectionHash");
const gradingCategoryNameInput = document.getElementById("gradingCategoryNameInput");
const gradingCategoryWeightInput = document.getElementById("gradingCategoryWeightInput");

let gradingCategoriesData = [];
let editingCategoryHash = null;

const mockGradingCategories = [
  {
    category_hash: "CAT_001",
    name: "Homework",
    weight_percent: 20,
    created_at: "2026-03-01"
  },
  {
    category_hash: "CAT_002",
    name: "Quiz",
    weight_percent: 30,
    created_at: "2026-03-02"
  }
];

function renderGradingCategories(data) {
  if (!gradingCategoriesTableBody) return;

  if (!data || data.length === 0) {
    gradingCategoriesTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="a-table-empty">No grading categories found.</td>
      </tr>
    `;
    return;
  }

  gradingCategoriesTableBody.innerHTML = data.map((item) => `
    <tr>
      <td>${formatValue(item.category_hash)}</td>
      <td>${formatValue(item.name)}</td>
      <td>${formatValue(item.weight_percent)}</td>
      <td>${formatValue(item.created_at)}</td>
      <td>
        <div class="a-table-actions">
          <button class="a-action-btn" onclick="viewGradingCategory('${item.category_hash || ""}')">View</button>
          <button class="a-action-btn" onclick="editGradingCategory('${item.category_hash || ""}')">Edit</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function fetchGradingCategories() {
  if (!gradingCategoriesTableBody) return;

  gradingCategoriesTableBody.innerHTML = `
    <tr>
      <td colspan="5" class="a-table-empty">Loading grading categories...</td>
    </tr>
  `;

  try {
    const token =
      typeof getToken === "function"
        ? getToken()
        : localStorage.getItem("token");

    const response = await apiRequest("/get_grading_categories", "GET", null, token);

    if (Array.isArray(response) && response.length > 0) {
      gradingCategoriesData = response.map((item) => ({
        category_hash: item.category_hash || "Unknown",
        name: item.name || "Unknown",
        weight_percent: item.weight_percent ?? 0,
        created_at: item.created_at || "Unknown"
      }));
    } else if (response && response.category_hash) {
      gradingCategoriesData = [{
        category_hash: response.category_hash || "Unknown",
        name: response.name || "Unknown",
        weight_percent: response.weight_percent ?? 0,
        created_at: response.created_at || "Unknown"
      }];
    } else {
      gradingCategoriesData = mockGradingCategories;
    }

    renderGradingCategories(gradingCategoriesData);
  } catch (error) {
    console.error("Error fetching grading categories:", error);
    gradingCategoriesData = mockGradingCategories;
    renderGradingCategories(gradingCategoriesData);
  }
}

function filterGradingCategories() {
  if (!gradingCategorySearch) return;

  const query = gradingCategorySearch.value.trim().toLowerCase();

  const filtered = gradingCategoriesData.filter((item) =>
    String(item.category_hash).toLowerCase().includes(query) ||
    String(item.name).toLowerCase().includes(query)
  );

  renderGradingCategories(filtered);
}

function viewGradingCategory(categoryHash) {
  const item = gradingCategoriesData.find((entry) => entry.category_hash === categoryHash);
  if (!item || !gradingCategoryViewModal) return;

  detailCategoryHash.textContent = formatValue(item.category_hash);
  detailCategoryName.textContent = formatValue(item.name);
  detailCategoryWeight.textContent = formatValue(item.weight_percent);
  detailCategoryCreatedAt.textContent = formatValue(item.created_at);

  gradingCategoryViewModal.classList.add("show");
}

function closeGradingCategoryModal() {
  if (!gradingCategoryViewModal) return;
  gradingCategoryViewModal.classList.remove("show");
}

function openAddGradingCategoryModal() {
  if (!addGradingCategoryModal) return;

  editingCategoryHash = null;

  if (gradingCategoryFormTitle) gradingCategoryFormTitle.textContent = "Add Grading Category";
  if (saveGradingCategoryBtn) saveGradingCategoryBtn.textContent = "Save Category";
  if (addGradingCategoryForm) addGradingCategoryForm.reset();

  if (gradingCategorySectionHash) {
    gradingCategorySectionHash.disabled = false;
    gradingCategorySectionHash.value = "";
  }

  addGradingCategoryModal.classList.add("show");
}

function closeAddGradingCategoryModal() {
  if (!addGradingCategoryModal) return;

  addGradingCategoryModal.classList.remove("show");
  editingCategoryHash = null;

  if (addGradingCategoryForm) addGradingCategoryForm.reset();

  if (gradingCategorySectionHash) {
    gradingCategorySectionHash.disabled = false;
  }

  if (gradingCategoryFormTitle) gradingCategoryFormTitle.textContent = "Add Grading Category";
  if (saveGradingCategoryBtn) saveGradingCategoryBtn.textContent = "Save Category";
}

function editGradingCategory(categoryHash) {
  const item = gradingCategoriesData.find((entry) => entry.category_hash === categoryHash);
  if (!item || !addGradingCategoryModal) return;

  editingCategoryHash = categoryHash;

  if (gradingCategoryFormTitle) gradingCategoryFormTitle.textContent = "Edit Grading Category";
  if (saveGradingCategoryBtn) saveGradingCategoryBtn.textContent = "Update Category";

  gradingCategoryNameInput.value = item.name || "";
  gradingCategoryWeightInput.value = item.weight_percent ?? "";

  if (gradingCategorySectionHash) {
    gradingCategorySectionHash.value = "";
    gradingCategorySectionHash.disabled = true;
  }

  addGradingCategoryModal.classList.add("show");
}

if (gradingCategoriesTableBody) {
  fetchGradingCategories();

  if (gradingCategorySearch) {
    gradingCategorySearch.addEventListener("input", filterGradingCategories);
  }

  if (refreshGradingCategoriesBtn) {
    refreshGradingCategoriesBtn.addEventListener("click", fetchGradingCategories);
  }

  if (addGradingCategoryBtn) {
    addGradingCategoryBtn.addEventListener("click", openAddGradingCategoryModal);
  }

  if (closeGradingCategoryModalBtn) {
    closeGradingCategoryModalBtn.addEventListener("click", closeGradingCategoryModal);
  }

  if (gradingCategoryBackdrop) {
    gradingCategoryBackdrop.addEventListener("click", closeGradingCategoryModal);
  }

  if (closeAddGradingCategoryBtn) {
    closeAddGradingCategoryBtn.addEventListener("click", closeAddGradingCategoryModal);
  }

  if (cancelAddGradingCategory) {
    cancelAddGradingCategory.addEventListener("click", closeAddGradingCategoryModal);
  }

  if (addGradingCategoryBackdrop) {
    addGradingCategoryBackdrop.addEventListener("click", closeAddGradingCategoryModal);
  }
}

if (addGradingCategoryForm) {
  addGradingCategoryForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    try {
      const token =
        typeof getToken === "function"
          ? getToken()
          : localStorage.getItem("token");

      if (editingCategoryHash) {
        const payload = {
          category_hash: editingCategoryHash,
          name: gradingCategoryNameInput.value || null,
          weight_percent: gradingCategoryWeightInput.value
            ? Number(gradingCategoryWeightInput.value)
            : null
        };

        await apiRequest("/update_grading_category", "POST", payload, token);
        alert("Category updated");
      } else {
        const payload = {
          section_hash: gradingCategorySectionHash.value,
          name: gradingCategoryNameInput.value,
          weight_percent: Number(gradingCategoryWeightInput.value)
        };

        await apiRequest("/create_grading_category", "POST", payload, token);
        alert("Category created");
      }

      closeAddGradingCategoryModal();
      fetchGradingCategories();
    } catch (error) {
      console.error("Error saving grading category:", error);
      alert("Failed to save category");
    }
  });
}