const bulkTimetableTableBody = document.getElementById("bulkTimetableTableBody");
const bulkTimetableResultBody = document.getElementById("bulkTimetableResultBody");
const bulkTimetableSearch = document.getElementById("bulkTimetableSearch");

const bulkTimetableTermHashInput = document.getElementById("bulkTimetableTermHashInput");
const bulkTimetableClassGroupHashInput = document.getElementById("bulkTimetableClassGroupHashInput");

const refreshBulkTimetableBtn = document.getElementById("refreshBulkTimetableBtn");
const addTimetableSlotBtn = document.getElementById("addTimetableSlotBtn");
const submitBulkTimetableBtn = document.getElementById("submitBulkTimetableBtn");

const bulkTimetableViewModal = document.getElementById("bulkTimetableViewModal");
const bulkTimetableViewBackdrop = document.getElementById("bulkTimetableViewBackdrop");
const closeBulkTimetableViewModalBtn = document.getElementById("closeBulkTimetableViewModalBtn");

const bulkTimetableSlotModal = document.getElementById("bulkTimetableSlotModal");
const bulkTimetableSlotBackdrop = document.getElementById("bulkTimetableSlotBackdrop");
const closeBulkTimetableSlotModalBtn = document.getElementById("closeBulkTimetableSlotModalBtn");
const cancelBulkTimetableSlotBtn = document.getElementById("cancelBulkTimetableSlotBtn");

const bulkTimetableSlotForm = document.getElementById("bulkTimetableSlotForm");
const bulkTimetableSlotModalTitle = document.getElementById("bulkTimetableSlotModalTitle");
const bulkTimetableEditIndex = document.getElementById("bulkTimetableEditIndex");

const bulkDayOfWeekInput = document.getElementById("bulkDayOfWeekInput");
const bulkPeriodNumberInput = document.getElementById("bulkPeriodNumberInput");
const bulkSectionHashInput = document.getElementById("bulkSectionHashInput");
const bulkStartTimeInput = document.getElementById("bulkStartTimeInput");
const bulkEndTimeInput = document.getElementById("bulkEndTimeInput");

const detailBulkDayOfWeek = document.getElementById("detailBulkDayOfWeek");
const detailBulkPeriodNumber = document.getElementById("detailBulkPeriodNumber");
const detailBulkSectionHash = document.getElementById("detailBulkSectionHash");
const detailBulkStartTime = document.getElementById("detailBulkStartTime");
const detailBulkEndTime = document.getElementById("detailBulkEndTime");

let bulkTimetableSlots = [];
let bulkTimetableResult = {
  created: 0,
  failed: 0,
  total: 0,
};

function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "Unknown";
  }
  return value;
}

function getToken() {
  return localStorage.getItem("token") || "";
}

function getApiBaseUrl() {
  if (window.CONFIG && window.CONFIG.API_BASE_URL) {
    return window.CONFIG.API_BASE_URL;
  }

  if (window.API_BASE_URL) {
    return window.API_BASE_URL;
  }

  return localStorage.getItem("apiBaseUrl") || "";
}

function getAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

function openModal(modal) {
  if (!modal) return;
  modal.classList.add("show");
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("show");
}

function resetBulkTimetableSlotForm() {
  if (!bulkTimetableSlotForm) return;

  bulkTimetableSlotForm.reset();
  bulkTimetableEditIndex.value = "";
  bulkTimetableSlotModalTitle.textContent = "Add Timetable Slot";
}

function setActiveSidebarLink() {
  const sidebarLinks = document.querySelectorAll("#sidebar-container .a-nav__item");

  sidebarLinks.forEach((link) => {
    link.classList.remove("active");

    const href = link.getAttribute("href") || "";
    if (href.includes("bulk-timetable.html")) {
      link.classList.add("active");
    }
  });
}

function renderBulkTimetableResult() {
  if (!bulkTimetableResultBody) return;

  bulkTimetableResultBody.innerHTML = `
    <tr>
      <td>${formatValue(bulkTimetableResult.created)}</td>
      <td>${formatValue(bulkTimetableResult.failed)}</td>
      <td>${formatValue(bulkTimetableResult.total)}</td>
    </tr>
  `;
}

function getFilteredBulkTimetableSlots() {
  const query = bulkTimetableSearch.value.trim().toLowerCase();

  if (!query) {
    return bulkTimetableSlots;
  }

  return bulkTimetableSlots.filter((slot) => {
    return (
      String(slot.day_of_week || "").toLowerCase().includes(query) ||
      String(slot.period_number || "").toLowerCase().includes(query) ||
      String(slot.section_hash || "").toLowerCase().includes(query) ||
      String(slot.start_time || "").toLowerCase().includes(query) ||
      String(slot.end_time || "").toLowerCase().includes(query)
    );
  });
}

function renderBulkTimetableTable() {
  if (!bulkTimetableTableBody) return;

  const rows = getFilteredBulkTimetableSlots();

  if (!rows.length) {
    bulkTimetableTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="a-table-empty">No slots added yet.</td>
      </tr>
    `;
    return;
  }

  bulkTimetableTableBody.innerHTML = rows
    .map((slot) => {
      const realIndex = bulkTimetableSlots.findIndex((item) => {
        return (
          item.day_of_week === slot.day_of_week &&
          Number(item.period_number) === Number(slot.period_number) &&
          item.section_hash === slot.section_hash &&
          item.start_time === slot.start_time &&
          item.end_time === slot.end_time
        );
      });

      return `
        <tr>
          <td>${formatValue(slot.day_of_week)}</td>
          <td>${formatValue(slot.period_number)}</td>
          <td>${formatValue(slot.section_hash)}</td>
          <td>${formatValue(slot.start_time)}</td>
          <td>${formatValue(slot.end_time)}</td>
          <td>
            <div class="a-table-actions">
              <button class="a-action-btn view-bulk-slot-btn" type="button" data-index="${realIndex}">
                View
              </button>
              <button class="a-action-btn edit-bulk-slot-btn" type="button" data-index="${realIndex}">
                Edit
              </button>
              <button class="a-action-btn a-action-btn--danger delete-bulk-slot-btn" type="button" data-index="${realIndex}">
                Delete
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function fillBulkTimetableDetails(slot) {
  detailBulkDayOfWeek.textContent = formatValue(slot.day_of_week);
  detailBulkPeriodNumber.textContent = formatValue(slot.period_number);
  detailBulkSectionHash.textContent = formatValue(slot.section_hash);
  detailBulkStartTime.textContent = formatValue(slot.start_time);
  detailBulkEndTime.textContent = formatValue(slot.end_time);
}

function isDuplicateBulkSlot(newSlot, editingIndex = null) {
  return bulkTimetableSlots.some((slot, index) => {
    if (editingIndex !== null && index === editingIndex) {
      return false;
    }

    return (
      slot.day_of_week === newSlot.day_of_week &&
      Number(slot.period_number) === Number(newSlot.period_number) &&
      slot.section_hash === newSlot.section_hash &&
      slot.start_time === newSlot.start_time &&
      slot.end_time === newSlot.end_time
    );
  });
}

function validateBulkSlot(slot, editingIndex = null) {
  if (
    !slot.day_of_week ||
    !slot.period_number ||
    !slot.section_hash ||
    !slot.start_time ||
    !slot.end_time
  ) {
    alert("Please fill all slot fields.");
    return false;
  }

  if (Number(slot.period_number) < 1) {
    alert("Period number must be at least 1.");
    return false;
  }

  if (slot.start_time >= slot.end_time) {
    alert("Start time must be earlier than end time.");
    return false;
  }

  if (isDuplicateBulkSlot(slot, editingIndex)) {
    alert("This slot already exists.");
    return false;
  }

  return true;
}

function handleOpenAddBulkSlotModal() {
  resetBulkTimetableSlotForm();
  openModal(bulkTimetableSlotModal);
}

function handleCloseBulkSlotModal() {
  closeModal(bulkTimetableSlotModal);
  resetBulkTimetableSlotForm();
}

function handleCloseBulkViewModal() {
  closeModal(bulkTimetableViewModal);
}

function handleBulkSlotSubmit(event) {
  event.preventDefault();

  const editIndexValue = bulkTimetableEditIndex.value;
  const editingIndex = editIndexValue === "" ? null : Number(editIndexValue);

  const slot = {
    day_of_week: bulkDayOfWeekInput.value.trim(),
    period_number: Number(bulkPeriodNumberInput.value),
    section_hash: bulkSectionHashInput.value.trim(),
    start_time: bulkStartTimeInput.value,
    end_time: bulkEndTimeInput.value,
  };

  if (!validateBulkSlot(slot, editingIndex)) {
    return;
  }

  if (editingIndex !== null) {
    bulkTimetableSlots[editingIndex] = slot;
  } else {
    bulkTimetableSlots.push(slot);
  }

  renderBulkTimetableTable();
  handleCloseBulkSlotModal();
}

function handleBulkTimetableTableClick(event) {
  const viewBtn = event.target.closest(".view-bulk-slot-btn");
  const editBtn = event.target.closest(".edit-bulk-slot-btn");
  const deleteBtn = event.target.closest(".delete-bulk-slot-btn");

  if (viewBtn) {
    const index = Number(viewBtn.dataset.index);
    const slot = bulkTimetableSlots[index];
    if (!slot) return;

    fillBulkTimetableDetails(slot);
    openModal(bulkTimetableViewModal);
    return;
  }

  if (editBtn) {
    const index = Number(editBtn.dataset.index);
    const slot = bulkTimetableSlots[index];
    if (!slot) return;

    bulkTimetableEditIndex.value = index;
    bulkTimetableSlotModalTitle.textContent = "Edit Timetable Slot";

    bulkDayOfWeekInput.value = slot.day_of_week || "";
    bulkPeriodNumberInput.value = slot.period_number || "";
    bulkSectionHashInput.value = slot.section_hash || "";
    bulkStartTimeInput.value = slot.start_time || "";
    bulkEndTimeInput.value = slot.end_time || "";

    openModal(bulkTimetableSlotModal);
    return;
  }

  if (deleteBtn) {
    const index = Number(deleteBtn.dataset.index);
    const slot = bulkTimetableSlots[index];
    if (!slot) return;

    const confirmed = confirm("Are you sure you want to delete this slot?");
    if (!confirmed) return;

    bulkTimetableSlots.splice(index, 1);
    renderBulkTimetableTable();
  }
}

function handleRefreshBulkTimetable() {
  bulkTimetableSearch.value = "";
  renderBulkTimetableTable();
  renderBulkTimetableResult();
}

async function submitBulkCreateTimetable() {
  const termHash = bulkTimetableTermHashInput.value.trim();
  const classGroupHash = bulkTimetableClassGroupHashInput.value.trim();

  if (!termHash) {
    alert("Term hash is required.");
    return;
  }

  if (!classGroupHash) {
    alert("Class group hash is required.");
    return;
  }

  if (!bulkTimetableSlots.length) {
    alert("Please add at least one slot.");
    return;
  }

  const payload = {
    term_hash: termHash,
    class_group_hash: classGroupHash,
    slots: bulkTimetableSlots,
  };

  try {
    const response = await fetch(`${getApiBaseUrl()}/bulk_create_timetable`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to bulk create timetable");
    }

    const data = await response.json();

    bulkTimetableResult = {
      created: data.created ?? 0,
      failed: data.failed ?? 0,
      total: data.total ?? bulkTimetableSlots.length,
    };

    renderBulkTimetableResult();
    alert("Bulk timetable created successfully.");
  } catch (error) {
    console.warn("bulk_create_timetable fallback mock used:", error.message);

    bulkTimetableResult = {
      created: bulkTimetableSlots.length,
      failed: 0,
      total: bulkTimetableSlots.length,
    };

    renderBulkTimetableResult();
    alert("API failed. Mock result applied.");
  }
}

function seedBulkTimetableMockData() {
  bulkTimetableSlots = [
    {
      day_of_week: "Sunday",
      period_number: 1,
      section_hash: "sec_math_001",
      start_time: "08:00",
      end_time: "08:45",
    },
    {
      day_of_week: "Monday",
      period_number: 2,
      section_hash: "sec_physics_002",
      start_time: "09:00",
      end_time: "09:45",
    },
  ];
}

function bindBulkTimetableEvents() {
  if (addTimetableSlotBtn) {
    addTimetableSlotBtn.addEventListener("click", handleOpenAddBulkSlotModal);
  }

  if (refreshBulkTimetableBtn) {
    refreshBulkTimetableBtn.addEventListener("click", handleRefreshBulkTimetable);
  }

  if (submitBulkTimetableBtn) {
    submitBulkTimetableBtn.addEventListener("click", submitBulkCreateTimetable);
  }

  if (closeBulkTimetableViewModalBtn) {
    closeBulkTimetableViewModalBtn.addEventListener("click", handleCloseBulkViewModal);
  }

  if (bulkTimetableViewBackdrop) {
    bulkTimetableViewBackdrop.addEventListener("click", handleCloseBulkViewModal);
  }

  if (closeBulkTimetableSlotModalBtn) {
    closeBulkTimetableSlotModalBtn.addEventListener("click", handleCloseBulkSlotModal);
  }

  if (cancelBulkTimetableSlotBtn) {
    cancelBulkTimetableSlotBtn.addEventListener("click", handleCloseBulkSlotModal);
  }

  if (bulkTimetableSlotBackdrop) {
    bulkTimetableSlotBackdrop.addEventListener("click", handleCloseBulkSlotModal);
  }

  if (bulkTimetableSlotForm) {
    bulkTimetableSlotForm.addEventListener("submit", handleBulkSlotSubmit);
  }

  if (bulkTimetableSearch) {
    bulkTimetableSearch.addEventListener("input", renderBulkTimetableTable);
  }

  if (bulkTimetableTableBody) {
    bulkTimetableTableBody.addEventListener("click", handleBulkTimetableTableClick);
  }
}

function initBulkTimetablePage() {
  if (typeof loadSidebar === "function") {
    loadSidebar();
  }

  setTimeout(setActiveSidebarLink, 100);

  seedBulkTimetableMockData();
  renderBulkTimetableTable();
  renderBulkTimetableResult();
  bindBulkTimetableEvents();
}

document.addEventListener("DOMContentLoaded", initBulkTimetablePage);