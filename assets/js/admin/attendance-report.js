const attendanceReportTableBody = document.getElementById("attendanceReportTableBody");
const termHashInput = document.getElementById("termHashInput");
const loadAttendanceReportBtn = document.getElementById("loadAttendanceReportBtn");
const refreshAttendanceReportBtn = document.getElementById("refreshAttendanceReportBtn");
const attendanceReportSearch = document.getElementById("attendanceReportSearch");

const attendanceReportViewModal = document.getElementById("attendanceReportViewModal");
const attendanceReportBackdrop = document.getElementById("attendanceReportBackdrop");
const closeAttendanceReportModalBtn = document.getElementById("closeAttendanceReportModalBtn");

const detailReportStudentHash = document.getElementById("detailReportStudentHash");
const detailReportUsername = document.getElementById("detailReportUsername");
const detailReportFirstName = document.getElementById("detailReportFirstName");
const detailReportLastName = document.getElementById("detailReportLastName");
const detailReportRangeFrom = document.getElementById("detailReportRangeFrom");
const detailReportRangeTo = document.getElementById("detailReportRangeTo");
const detailReportTotalDays = document.getElementById("detailReportTotalDays");
const detailReportPresentDays = document.getElementById("detailReportPresentDays");
const detailReportAbsentDays = document.getElementById("detailReportAbsentDays");
const detailReportLateDays = document.getElementById("detailReportLateDays");
const detailReportExcusedDays = document.getElementById("detailReportExcusedDays");
const detailReportAttendancePercent = document.getElementById("detailReportAttendancePercent");

let attendanceReportData = [];

const mockAttendanceReport = [
  {
    student_hash: "STU_001",
    username: "ahmad.ali",
    first_name: "Ahmad",
    last_name: "Ali",
    range: { from: "2026-09-01", to: "2026-12-20" },
    total_days: 50,
    present_days: 45,
    absent_days: 2,
    late_days: 2,
    excused_days: 1,
    attendance_percent: 90
  },
  {
    student_hash: "STU_002",
    username: "lina.hassan",
    first_name: "Lina",
    last_name: "Hassan",
    range: { from: "2026-09-01", to: "2026-12-20" },
    total_days: 50,
    present_days: 47,
    absent_days: 1,
    late_days: 1,
    excused_days: 1,
    attendance_percent: 94
  }
];

function renderAttendanceReport(data) {
  if (!attendanceReportTableBody) return;

  if (!data || data.length === 0) {
    attendanceReportTableBody.innerHTML = `
      <tr>
        <td colspan="11" class="a-table-empty">No attendance report records found.</td>
      </tr>
    `;
    return;
  }

  attendanceReportTableBody.innerHTML = data.map((item) => `
    <tr>
      <td>${formatValue(item.student_hash)}</td>
      <td>${formatValue(item.username)}</td>
      <td>${formatValue(item.first_name)}</td>
      <td>${formatValue(item.last_name)}</td>
      <td>${formatValue(item.total_days)}</td>
      <td>${formatValue(item.present_days)}</td>
      <td>${formatValue(item.absent_days)}</td>
      <td>${formatValue(item.late_days)}</td>
      <td>${formatValue(item.excused_days)}</td>
      <td>${formatValue(item.attendance_percent)}%</td>
      <td>
        <div class="a-table-actions">
          <button class="a-action-btn" onclick="viewAttendanceReport('${item.student_hash || ""}')">View</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function fetchAttendanceReport() {
  if (!attendanceReportTableBody) return;

  const termHash = termHashInput ? termHashInput.value.trim() : "";

  if (!termHash) {
    attendanceReportTableBody.innerHTML = `
      <tr>
        <td colspan="11" class="a-table-empty">Please enter a term hash first.</td>
      </tr>
    `;
    return;
  }

  attendanceReportTableBody.innerHTML = `
    <tr>
      <td colspan="11" class="a-table-empty">Loading attendance report...</td>
    </tr>
  `;

  try {
    const token =
      typeof getToken === "function"
        ? getToken()
        : localStorage.getItem("token");

    const response = await apiRequest(
      "/get_daily_attendance_report",
      "POST",
      { term_hash: termHash },
      token
    );

    if (Array.isArray(response) && response.length > 0) {
      attendanceReportData = response.map((item) => ({
        student_hash: item.student_hash || "Unknown",
        username: item.username || "Unknown",
        first_name: item.first_name || "Unknown",
        last_name: item.last_name || "Unknown",
        range: item.range || { from: "Unknown", to: "Unknown" },
        total_days: item.total_days ?? 0,
        present_days: item.present_days ?? 0,
        absent_days: item.absent_days ?? 0,
        late_days: item.late_days ?? 0,
        excused_days: item.excused_days ?? 0,
        attendance_percent: item.attendance_percent ?? 0
      }));
    } else {
      attendanceReportData = mockAttendanceReport;
    }

    renderAttendanceReport(attendanceReportData);
  } catch (error) {
    console.error("Error fetching attendance report:", error);
    attendanceReportData = mockAttendanceReport;
    renderAttendanceReport(attendanceReportData);
  }
}

function filterAttendanceReport() {
  if (!attendanceReportSearch) return;

  const query = attendanceReportSearch.value.trim().toLowerCase();

  const filtered = attendanceReportData.filter((item) =>
    String(item.student_hash).toLowerCase().includes(query) ||
    String(item.username).toLowerCase().includes(query) ||
    String(item.first_name).toLowerCase().includes(query) ||
    String(item.last_name).toLowerCase().includes(query)
  );

  renderAttendanceReport(filtered);
}

function viewAttendanceReport(studentHash) {
  const item = attendanceReportData.find((entry) => entry.student_hash === studentHash);
  if (!item || !attendanceReportViewModal) return;

  detailReportStudentHash.textContent = formatValue(item.student_hash);
  detailReportUsername.textContent = formatValue(item.username);
  detailReportFirstName.textContent = formatValue(item.first_name);
  detailReportLastName.textContent = formatValue(item.last_name);
  detailReportRangeFrom.textContent = formatValue(item.range?.from);
  detailReportRangeTo.textContent = formatValue(item.range?.to);
  detailReportTotalDays.textContent = formatValue(item.total_days);
  detailReportPresentDays.textContent = formatValue(item.present_days);
  detailReportAbsentDays.textContent = formatValue(item.absent_days);
  detailReportLateDays.textContent = formatValue(item.late_days);
  detailReportExcusedDays.textContent = formatValue(item.excused_days);
  detailReportAttendancePercent.textContent = `${formatValue(item.attendance_percent)}%`;

  attendanceReportViewModal.classList.add("show");
}

function closeAttendanceReportModal() {
  if (!attendanceReportViewModal) return;
  attendanceReportViewModal.classList.remove("show");
}

if (attendanceReportTableBody) {
  if (loadAttendanceReportBtn) {
    loadAttendanceReportBtn.addEventListener("click", fetchAttendanceReport);
  }

  if (refreshAttendanceReportBtn) {
    refreshAttendanceReportBtn.addEventListener("click", fetchAttendanceReport);
  }

  if (attendanceReportSearch) {
    attendanceReportSearch.addEventListener("input", filterAttendanceReport);
  }

  if (closeAttendanceReportModalBtn) {
    closeAttendanceReportModalBtn.addEventListener("click", closeAttendanceReportModal);
  }

  if (attendanceReportBackdrop) {
    attendanceReportBackdrop.addEventListener("click", closeAttendanceReportModal);
  }
}