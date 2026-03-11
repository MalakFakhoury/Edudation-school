const classAttendanceTableBody = document.getElementById("classAttendanceTableBody");
const classAttendanceSearch = document.getElementById("classAttendanceSearch");
const refreshClassAttendanceBtn = document.getElementById("refreshClassAttendanceBtn");

const classAttendanceViewModal = document.getElementById("classAttendanceViewModal");
const classAttendanceBackdrop = document.getElementById("classAttendanceBackdrop");
const closeClassAttendanceModalBtn = document.getElementById("closeClassAttendanceModalBtn");

const detailAttendanceStudentHash = document.getElementById("detailAttendanceStudentHash");
const detailAttendanceUsername = document.getElementById("detailAttendanceUsername");
const detailAttendanceFirstName = document.getElementById("detailAttendanceFirstName");
const detailAttendanceLastName = document.getElementById("detailAttendanceLastName");
const detailAttendanceDailyHash = document.getElementById("detailAttendanceDailyHash");
const detailAttendanceStatus = document.getElementById("detailAttendanceStatus");
const detailAttendanceAbsenceType = document.getElementById("detailAttendanceAbsenceType");
const detailAttendanceMinutesLate = document.getElementById("detailAttendanceMinutesLate");
const detailAttendanceNote = document.getElementById("detailAttendanceNote");

const markAttendanceModal = document.getElementById("markAttendanceModal");
const markAttendanceBackdrop = document.getElementById("markAttendanceBackdrop");
const closeMarkAttendanceBtn = document.getElementById("closeMarkAttendanceBtn");
const cancelMarkAttendance = document.getElementById("cancelMarkAttendance");
const markAttendanceForm = document.getElementById("markAttendanceForm");

let selectedStudentHash = null;
let classAttendanceData = [];

const mockClassAttendance = [
  {
    student_hash: "STU_001",
    username: "ahmad.ali",
    first_name: "Ahmad",
    last_name: "Ali",
    daily_hash: "DAY_001",
    status: "Present",
    absence_type: "Unknown",
    minutes_late: "0",
    note: "On time"
  },
  {
    student_hash: "STU_002",
    username: "lina.hassan",
    first_name: "Lina",
    last_name: "Hassan",
    daily_hash: "DAY_002",
    status: "Late",
    absence_type: "Unknown",
    minutes_late: "10",
    note: "Arrived after first bell"
  }
];

function renderClassAttendance(data) {
  if (!classAttendanceTableBody) return;

  if (!data || data.length === 0) {
    classAttendanceTableBody.innerHTML = `
      <tr>
        <td colspan="10" class="a-table-empty">No attendance records found.</td>
      </tr>
    `;
    return;
  }

  classAttendanceTableBody.innerHTML = data.map((item) => `
    <tr>
      <td>${formatValue(item.student_hash)}</td>
      <td>${formatValue(item.username)}</td>
      <td>${formatValue(item.first_name)}</td>
      <td>${formatValue(item.last_name)}</td>
      <td>${formatValue(item.daily_hash)}</td>
      <td>${formatValue(item.status)}</td>
      <td>${formatValue(item.absence_type)}</td>
      <td>${formatValue(item.minutes_late)}</td>
      <td>${formatValue(item.note)}</td>
      <td>
        <div class="a-table-actions">

<button class="a-action-btn"
onclick="viewClassAttendance('${item.daily_hash}')">
View
</button>

<button class="a-action-btn"
onclick="openMarkAttendance('${item.student_hash}')">
Mark
</button>

<button class="a-action-btn"
onclick="editAttendance('${item.daily_hash}')">
Edit
</button>

<button class="a-action-btn a-action-btn--danger"
onclick="deleteAttendance('${item.daily_hash}')">
Delete
</button>

</div>
      </td>
    </tr>
  `).join("");
}

async function fetchClassAttendance() {
  if (!classAttendanceTableBody) return;

  classAttendanceTableBody.innerHTML = `
    <tr>
      <td colspan="10" class="a-table-empty">Loading attendance...</td>
    </tr>
  `;

  try {
    const token =
      typeof getToken === "function"
        ? getToken()
        : localStorage.getItem("token");

    const response = await apiRequest("/get_class_daily_attendace", "GET", null, token);

    if (Array.isArray(response) && response.length > 0) {
      classAttendanceData = response.map((item) => ({
        student_hash: item.student_hash || "Unknown",
        username: item.username || "Unknown",
        first_name: item.first_name || "Unknown",
        last_name: item.last_name || "Unknown",
        daily_hash: item.daily_hash || "Unknown",
        status: item.status || "Unknown",
        absence_type: item.absence_type || "Unknown",
        minutes_late: item.minutes_late || "0",
        note: item.note || ""
      }));
    } else {
      classAttendanceData = mockClassAttendance;
    }

    renderClassAttendance(classAttendanceData);
  } catch (error) {
    console.error("Error fetching class attendance:", error);
    classAttendanceData = mockClassAttendance;
    renderClassAttendance(classAttendanceData);
  }
}

function filterClassAttendance() {
  if (!classAttendanceSearch) return;

  const query = classAttendanceSearch.value.trim().toLowerCase();

  const filtered = classAttendanceData.filter((item) =>
    String(item.student_hash).toLowerCase().includes(query) ||
    String(item.username).toLowerCase().includes(query) ||
    String(item.first_name).toLowerCase().includes(query) ||
    String(item.last_name).toLowerCase().includes(query) ||
    String(item.status).toLowerCase().includes(query)
  );

  renderClassAttendance(filtered);
}

function viewClassAttendance(dailyHash) {
  const item = classAttendanceData.find((entry) => entry.daily_hash === dailyHash);
  if (!item || !classAttendanceViewModal) return;

  detailAttendanceStudentHash.textContent = formatValue(item.student_hash);
  detailAttendanceUsername.textContent = formatValue(item.username);
  detailAttendanceFirstName.textContent = formatValue(item.first_name);
  detailAttendanceLastName.textContent = formatValue(item.last_name);
  detailAttendanceDailyHash.textContent = formatValue(item.daily_hash);
  detailAttendanceStatus.textContent = formatValue(item.status);
  detailAttendanceAbsenceType.textContent = formatValue(item.absence_type);
  detailAttendanceMinutesLate.textContent = formatValue(item.minutes_late);
  detailAttendanceNote.textContent = formatValue(item.note);

  classAttendanceViewModal.classList.add("show");
}

function closeClassAttendanceModal() {
  if (!classAttendanceViewModal) return;
  classAttendanceViewModal.classList.remove("show");
}

function openMarkAttendance(studentHash) {
  selectedStudentHash = studentHash;

  if (markAttendanceModal) {
    markAttendanceModal.classList.add("show");
  }
}

function closeMarkAttendanceModal() {
  if (markAttendanceModal) {
    markAttendanceModal.classList.remove("show");
  }

  if (markAttendanceForm) {
    markAttendanceForm.reset();
  }

  selectedStudentHash = null;
}

if (classAttendanceTableBody) {
  fetchClassAttendance();

  if (classAttendanceSearch) {
    classAttendanceSearch.addEventListener("input", filterClassAttendance);
  }

  if (refreshClassAttendanceBtn) {
    refreshClassAttendanceBtn.addEventListener("click", fetchClassAttendance);
  }

  if (closeClassAttendanceModalBtn) {
    closeClassAttendanceModalBtn.addEventListener("click", closeClassAttendanceModal);
  }

  if (classAttendanceBackdrop) {
    classAttendanceBackdrop.addEventListener("click", closeClassAttendanceModal);
  }
}

if (markAttendanceForm) {
  markAttendanceForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const payload = {
      attendance_date: document.getElementById("attendanceDate").value,
      items: [
        {
          student_hash: selectedStudentHash,
          status: document.getElementById("attendanceStatus").value,
          absence_type: document.getElementById("absenceType").value || null,
          minutes_late: Number(document.getElementById("minutesLate").value) || 0,
          note: document.getElementById("attendanceNote").value || null
        }
      ]
    };

    try {
      const token =
        typeof getToken === "function"
          ? getToken()
          : localStorage.getItem("token");

      await apiRequest("/mark_daily_attendance", "POST", payload, token);

      alert("Attendance saved");

      closeMarkAttendanceModal();
      fetchClassAttendance();
    } catch (err) {
      console.error("attendance error", err);
      alert("Failed to save attendance");
    }
  });
}

if (closeMarkAttendanceBtn) {
  closeMarkAttendanceBtn.addEventListener("click", closeMarkAttendanceModal);
}

if (cancelMarkAttendance) {
  cancelMarkAttendance.addEventListener("click", closeMarkAttendanceModal);
}

if (markAttendanceBackdrop) {
  markAttendanceBackdrop.addEventListener("click", closeMarkAttendanceModal);
}

function editAttendance(dailyHash){

const item = classAttendanceData.find(
a => a.daily_hash === dailyHash
);

if(!item) return;

selectedStudentHash = item.student_hash;

document.getElementById("attendanceStatus").value =
item.status || "present";

document.getElementById("absenceType").value =
item.absence_type || "";

document.getElementById("minutesLate").value =
item.minutes_late || "";

document.getElementById("attendanceNote").value =
item.note || "";

markAttendanceModal.classList.add("show");

}

async function loadAttendanceReport(){

const termHash =
document.getElementById("termHashInput").value;

try{

const token =
typeof getToken === "function"
? getToken()
: localStorage.getItem("token");

const response =
await apiRequest(
"/get_daily_attendance_report",
"POST",
{term_hash:termHash},
token
);

const table =
document.getElementById("attendanceReportBody");

table.innerHTML = response.map(r=>`

<tr>

<td>${r.first_name} ${r.last_name}</td>

<td>${r.total_days}</td>

<td>${r.present_days}</td>

<td>${r.absent_days}</td>

<td>${r.late_days}</td>

<td>${r.excused_days}</td>

<td>${r.attendance_percent}%</td>

</tr>

`).join("");

}catch(err){

console.error(err);

}

}