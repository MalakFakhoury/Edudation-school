// renderTerms
// fetchTerms
// filterTerms

const teacherTimetableTableBody = document.getElementById("teacherTimetableTableBody");
const teacherTimetableSearch = document.getElementById("teacherTimetableSearch");
const refreshTeacherTimetableBtn = document.getElementById("refreshTeacherTimetableBtn");

const teacherTimetableViewModal = document.getElementById("teacherTimetableViewModal");
const teacherTimetableBackdrop = document.getElementById("teacherTimetableBackdrop");
const closeTeacherTimetableModalBtn = document.getElementById("closeTeacherTimetableModalBtn");

const detailTeacherTimetableHash = document.getElementById("detailTeacherTimetableHash");
const detailTeacherClassGroupHash = document.getElementById("detailTeacherClassGroupHash");
const detailTeacherTimetableDay = document.getElementById("detailTeacherTimetableDay");
const detailTeacherTimetablePeriod = document.getElementById("detailTeacherTimetablePeriod");
const detailTeacherTimetableSectionHash = document.getElementById("detailTeacherTimetableSectionHash");
const detailTeacherTimetableStart = document.getElementById("detailTeacherTimetableStart");
const detailTeacherTimetableEnd = document.getElementById("detailTeacherTimetableEnd");

let teacherTimetableData = [];

const mockTeacherTimetable = [
  {
    timetable_hash: "TT_001",
    class_group_hash: "CG_001",
    day_of_week: "Monday",
    period_number: 1,
    section_hash: "SEC_001",
    start_time: "08:00",
    end_time: "08:45"
  },
  {
    timetable_hash: "TT_002",
    class_group_hash: "CG_002",
    day_of_week: "Tuesday",
    period_number: 3,
    section_hash: "SEC_002",
    start_time: "10:00",
    end_time: "10:45"
  }
];

function renderTeacherTimetable(data) {
  if (!teacherTimetableTableBody) return;

  if (!data || data.length === 0) {
    teacherTimetableTableBody.innerHTML = `
      <tr>
        <td colspan="8" class="a-table-empty">No timetable slots found.</td>
      </tr>
    `;
    return;
  }

  teacherTimetableTableBody.innerHTML = data.map((item) => `
    <tr>
      <td>${formatValue(item.timetable_hash)}</td>
      <td>${formatValue(item.class_group_hash)}</td>
      <td>${formatValue(item.day_of_week)}</td>
      <td>${formatValue(item.period_number)}</td>
      <td>${formatValue(item.section_hash)}</td>
      <td>${formatValue(item.start_time)}</td>
      <td>${formatValue(item.end_time)}</td>
      <td>
        <div class="a-table-actions">
          <button class="a-action-btn" onclick="viewTeacherTimetableSlot('${item.timetable_hash || ""}')">View</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function fetchTeacherTimetable() {
  if (!teacherTimetableTableBody) return;

  teacherTimetableTableBody.innerHTML = `
    <tr>
      <td colspan="8" class="a-table-empty">Loading timetable...</td>
    </tr>
  `;

  try {
    const token = typeof getToken === "function" ? getToken() : localStorage.getItem("token");
    const response = await apiRequest("/get_teacher_timetable", "GET", null, token);

    if (Array.isArray(response) && response.length > 0) {
      teacherTimetableData = response.map((item) => ({
        timetable_hash: item.timetable_hash || "Unknown",
        class_group_hash: item.class_group_hash || "Unknown",
        day_of_week: item.day_of_week || "Unknown",
        period_number: item.period_number ?? "Unknown",
        section_hash: item.section_hash || "Unknown",
        start_time: item.start_time || "Unknown",
        end_time: item.end_time || "Unknown"
      }));
    } else {
      teacherTimetableData = mockTeacherTimetable;
    }

    renderTeacherTimetable(teacherTimetableData);
  } catch (error) {
    console.error("Error fetching teacher timetable:", error);
    teacherTimetableData = mockTeacherTimetable;
    renderTeacherTimetable(teacherTimetableData);
  }
}

function filterTeacherTimetable() {
  if (!teacherTimetableSearch) return;

  const query = teacherTimetableSearch.value.trim().toLowerCase();

  const filtered = teacherTimetableData.filter((item) =>
    String(item.timetable_hash).toLowerCase().includes(query) ||
    String(item.class_group_hash).toLowerCase().includes(query) ||
    String(item.day_of_week).toLowerCase().includes(query) ||
    String(item.section_hash).toLowerCase().includes(query)
  );

  renderTeacherTimetable(filtered);
}

function viewTeacherTimetableSlot(timetableHash) {
  const item = teacherTimetableData.find((entry) => entry.timetable_hash === timetableHash);
  if (!item || !teacherTimetableViewModal) return;

  detailTeacherTimetableHash.textContent = formatValue(item.timetable_hash);
  detailTeacherClassGroupHash.textContent = formatValue(item.class_group_hash);
  detailTeacherTimetableDay.textContent = formatValue(item.day_of_week);
  detailTeacherTimetablePeriod.textContent = formatValue(item.period_number);
  detailTeacherTimetableSectionHash.textContent = formatValue(item.section_hash);
  detailTeacherTimetableStart.textContent = formatValue(item.start_time);
  detailTeacherTimetableEnd.textContent = formatValue(item.end_time);

  teacherTimetableViewModal.classList.add("show");
}

function closeTeacherTimetableModal() {
  if (!teacherTimetableViewModal) return;
  teacherTimetableViewModal.classList.remove("show");
}

if (teacherTimetableTableBody) {
  fetchTeacherTimetable();

  if (teacherTimetableSearch) {
    teacherTimetableSearch.addEventListener("input", filterTeacherTimetable);
  }

  if (refreshTeacherTimetableBtn) {
    refreshTeacherTimetableBtn.addEventListener("click", fetchTeacherTimetable);
  }

  if (closeTeacherTimetableModalBtn) {
    closeTeacherTimetableModalBtn.addEventListener("click", closeTeacherTimetableModal);
  }

  if (teacherTimetableBackdrop) {
    teacherTimetableBackdrop.addEventListener("click", closeTeacherTimetableModal);
  }
}