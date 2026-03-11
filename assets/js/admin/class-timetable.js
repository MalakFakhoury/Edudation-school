// renderTeacherTimetable
// fetchTeacherTimetable
// viewTeacherTimetable

const classTimetableTableBody = document.getElementById("classTimetableTableBody");
const classTimetableSearch = document.getElementById("classTimetableSearch");
const refreshClassTimetableBtn = document.getElementById("refreshClassTimetableBtn");

const classTimetableViewModal = document.getElementById("classTimetableViewModal");
const classTimetableBackdrop = document.getElementById("classTimetableBackdrop");
const closeClassTimetableModalBtn = document.getElementById("closeClassTimetableModalBtn");

const detailClassTimetableHash = document.getElementById("detailClassTimetableHash");
const detailClassTimetableDay = document.getElementById("detailClassTimetableDay");
const detailClassTimetablePeriod = document.getElementById("detailClassTimetablePeriod");
const detailClassTimetableSectionHash = document.getElementById("detailClassTimetableSectionHash");
const detailClassTimetableStart = document.getElementById("detailClassTimetableStart");
const detailClassTimetableEnd = document.getElementById("detailClassTimetableEnd");

let classTimetableData = [];

const mockClassTimetable = [
  {
    timetable_hash: "CTT_001",
    day_of_week: 1,
    period_number: 1,
    section_hash: "SEC_001",
    start_time: "08:00",
    end_time: "08:45",
    created_at: "2026-03-01",
    updated_at: "2026-03-01"
  },
  {
    timetable_hash: "CTT_002",
    day_of_week: 3,
    period_number: 2,
    section_hash: "SEC_002",
    start_time: "09:00",
    end_time: "09:45",
    created_at: "2026-03-02",
    updated_at: "2026-03-02"
  }
];

function formatDayOfWeek(value) {
  const dayMap = {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    7: "Sunday"
  };

  if (dayMap[value]) return dayMap[value];
  return formatValue(value);
}

function renderClassTimetable(data) {
  if (!classTimetableTableBody) return;

  if (!data || data.length === 0) {
    classTimetableTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="a-table-empty">No timetable slots found.</td>
      </tr>
    `;
    return;
  }

  classTimetableTableBody.innerHTML = data.map((item) => `
    <tr>
      <td>${formatValue(item.timetable_hash)}</td>
      <td>${formatDayOfWeek(item.day_of_week)}</td>
      <td>${formatValue(item.period_number)}</td>
      <td>${formatValue(item.section_hash)}</td>
      <td>${formatValue(item.start_time)}</td>
      <td>${formatValue(item.end_time)}</td>
      <td>
        <div class="a-table-actions">
          <button
            class="a-action-btn"
            onclick="viewClassTimetable('${item.timetable_hash || ""}')"
          >
            View
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function fetchClassTimetable() {
  if (!classTimetableTableBody) return;

  classTimetableTableBody.innerHTML = `
    <tr>
      <td colspan="7" class="a-table-empty">Loading timetable...</td>
    </tr>
  `;

  try {
    const token =
      typeof getToken === "function"
        ? getToken()
        : localStorage.getItem("token");

    const response = await apiRequest("/get_class_timetable", "GET", null, token);

    console.log("get_class_timetable response:", response);

    if (Array.isArray(response) && response.length > 0) {
      classTimetableData = response.map((item) => ({
        timetable_hash: item.timetable_hash || "Unknown",
        day_of_week: item.day_of_week ?? "Unknown",
        period_number: item.period_number ?? "Unknown",
        section_hash: item.section_hash || "Unknown",
        start_time: item.start_time || "Unknown",
        end_time: item.end_time || "Unknown",
        created_at: item.created_at || "Unknown",
        updated_at: item.updated_at || "Unknown"
      }));
    } else if (response && Array.isArray(response.data) && response.data.length > 0) {
      classTimetableData = response.data.map((item) => ({
        timetable_hash: item.timetable_hash || "Unknown",
        day_of_week: item.day_of_week ?? "Unknown",
        period_number: item.period_number ?? "Unknown",
        section_hash: item.section_hash || "Unknown",
        start_time: item.start_time || "Unknown",
        end_time: item.end_time || "Unknown",
        created_at: item.created_at || "Unknown",
        updated_at: item.updated_at || "Unknown"
      }));
    } else {
      classTimetableData = mockClassTimetable;
    }

    renderClassTimetable(classTimetableData);
  } catch (error) {
    console.error("Error fetching class timetable:", error);
    classTimetableData = mockClassTimetable;
    renderClassTimetable(classTimetableData);
  }
}

function filterClassTimetable() {
  if (!classTimetableSearch) return;

  const query = classTimetableSearch.value.trim().toLowerCase();

  const filtered = classTimetableData.filter((item) =>
    String(item.timetable_hash).toLowerCase().includes(query) ||
    String(item.section_hash).toLowerCase().includes(query) ||
    String(item.day_of_week).toLowerCase().includes(query) ||
    formatDayOfWeek(item.day_of_week).toLowerCase().includes(query)
  );

  renderClassTimetable(filtered);
}

function viewClassTimetable(timetableHash) {
  const item = classTimetableData.find((entry) => entry.timetable_hash === timetableHash);
  if (!item || !classTimetableViewModal) return;

  detailClassTimetableHash.textContent = formatValue(item.timetable_hash);
  detailClassTimetableDay.textContent = formatDayOfWeek(item.day_of_week);
  detailClassTimetablePeriod.textContent = formatValue(item.period_number);
  detailClassTimetableSectionHash.textContent = formatValue(item.section_hash);
  detailClassTimetableStart.textContent = formatValue(item.start_time);
  detailClassTimetableEnd.textContent = formatValue(item.end_time);

  classTimetableViewModal.classList.add("show");
}

function closeClassTimetableModal() {
  if (!classTimetableViewModal) return;
  classTimetableViewModal.classList.remove("show");
}

if (classTimetableTableBody) {
  fetchClassTimetable();

  if (classTimetableSearch) {
    classTimetableSearch.addEventListener("input", filterClassTimetable);
  }

  if (refreshClassTimetableBtn) {
    refreshClassTimetableBtn.addEventListener("click", fetchClassTimetable);
  }

  if (closeClassTimetableModalBtn) {
    closeClassTimetableModalBtn.addEventListener("click", closeClassTimetableModal);
  }

  if (classTimetableBackdrop) {
    classTimetableBackdrop.addEventListener("click", closeClassTimetableModal);
  }
}