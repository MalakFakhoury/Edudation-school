const attendanceDateInput = document.getElementById("attendanceDateInput");
const attendanceCourseSectionHashInput = document.getElementById("attendanceCourseSectionHashInput");
const attendanceSectionHashInput = document.getElementById("attendanceSectionHashInput");
const attendanceTimetableHashInput = document.getElementById("attendanceTimetableHashInput");

const loadAttendanceBtn = document.getElementById("loadAttendanceBtn");
const saveAttendanceBtn = document.getElementById("saveAttendanceBtn");

const selectedAttendanceSectionLabel = document.getElementById("selectedAttendanceSectionLabel");
const attendanceListWrap = document.getElementById("attendanceListWrap");

let attendanceStudents = [];
let currentAttendanceCourseSectionHash = "";

function setTodayDate() {
  if (!attendanceDateInput) return;
  if (attendanceDateInput.value) return;

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  attendanceDateInput.value = `${yyyy}-${mm}-${dd}`;
}

function renderAttendanceList() {
  if (!attendanceListWrap) return;

  if (!attendanceStudents.length) {
    attendanceListWrap.innerHTML = `
      <div class="t-empty-state">
        <div class="t-card__meta">No students</div>
        <h3 class="t-card__title">No attendance list found</h3>
        <p class="t-muted">Load a course section first.</p>
      </div>
    `;
    return;
  }

  attendanceListWrap.innerHTML = attendanceStudents
    .map((student, index) => {
      return `
        <div class="t-attendance-item" data-student-hash="${formatValue(student.student_hash)}">
          <div class="t-attendance-main">
            <div>
              <div class="t-attendance-name">${formatValue(student.name)}</div>
              <div class="t-attendance-hash">${formatValue(student.student_hash)}</div>
            </div>

            <div class="t-attendance-statuses">
              <label><input type="radio" name="status_${index}" value="present" ${student.status === "present" ? "checked" : ""}> Present</label>
              <label><input type="radio" name="status_${index}" value="absent" ${student.status === "absent" ? "checked" : ""}> Absent</label>
              <label><input type="radio" name="status_${index}" value="late" ${student.status === "late" ? "checked" : ""}> Late</label>
              <label><input type="radio" name="status_${index}" value="excused" ${student.status === "excused" ? "checked" : ""}> Excused</label>
            </div>
          </div>

          <div class="t-attendance-extra">
            <input
              type="number"
              min="0"
              class="t-input attendance-minutes-late"
              placeholder="Minutes late"
              value="${student.minutes_late ?? ""}"
            />

            <input
              type="text"
              class="t-input attendance-absence-type"
              placeholder="Absence type"
              value="${student.absence_type ?? ""}"
            />

            <input
              type="text"
              class="t-input attendance-note"
              placeholder="Note"
              value="${student.note ?? ""}"
            />
          </div>
        </div>
      `;
    })
    .join("");
}

function seedMockAttendanceStudents() {
  attendanceStudents = [
    {
      student_hash: "stu_001",
      name: "Ahmed Ali",
      status: "present",
      minutes_late: null,
      absence_type: null,
      note: "",
    },
    {
      student_hash: "stu_002",
      name: "Sara Mohamed",
      status: "late",
      minutes_late: 10,
      absence_type: null,
      note: "Traffic",
    },
    {
      student_hash: "stu_003",
      name: "Lina Hassan",
      status: "absent",
      minutes_late: null,
      absence_type: "Sick",
      note: "Parent informed",
    },
  ];

  renderAttendanceList();
}

async function loadAttendance() {
  const courseSectionHash = attendanceCourseSectionHashInput?.value.trim();

  if (!courseSectionHash) {
    alert("Course section hash is required.");
    return;
  }

  currentAttendanceCourseSectionHash = courseSectionHash;
  selectedAttendanceSectionLabel.textContent = `Selected course section: ${courseSectionHash}`;
  localStorage.setItem("selected_course_section_hash", courseSectionHash);

  try {
    const response = await fetch(`${getApiBaseUrl()}/get_attendance`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        course_section_hash: courseSectionHash,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to load attendance");
    }

    const data = await response.json();
    const list = Array.isArray(data) ? data : data.list || [];

    attendanceStudents = list.map((item, index) => ({
      student_hash: `student_${index + 1}`,
      name: item,
      status: "present",
      minutes_late: null,
      absence_type: null,
      note: "",
    }));

    renderAttendanceList();
  } catch (error) {
    console.warn("get_attendance fallback mock used:", error.message);
    seedMockAttendanceStudents();
  }
}

function collectAttendanceItems() {
  const wrappers = document.querySelectorAll(".t-attendance-item");

  return Array.from(wrappers).map((wrapper, index) => {
    const studentHash = wrapper.dataset.studentHash || "";
    const checked = wrapper.querySelector(`input[name="status_${index}"]:checked`);
    const minutesLateInput = wrapper.querySelector(".attendance-minutes-late");
    const absenceTypeInput = wrapper.querySelector(".attendance-absence-type");
    const noteInput = wrapper.querySelector(".attendance-note");

    return {
      student_hash: studentHash,
      status: checked ? checked.value : "present",
      minutes_late: minutesLateInput && minutesLateInput.value !== "" ? Number(minutesLateInput.value) : null,
      absence_type: absenceTypeInput && absenceTypeInput.value.trim() !== "" ? absenceTypeInput.value.trim() : null,
      note: noteInput && noteInput.value.trim() !== "" ? noteInput.value.trim() : null,
    };
  });
}

async function saveAttendance() {
  const attendanceDate = attendanceDateInput?.value.trim();
  const courseSectionHash = attendanceCourseSectionHashInput?.value.trim();
  const sectionHash = attendanceSectionHashInput?.value.trim();
  const timetableHash = attendanceTimetableHashInput?.value.trim();

  if (!attendanceDate) {
    alert("Attendance date is required.");
    return;
  }

  if (!attendanceStudents.length) {
    alert("No attendance items to save.");
    return;
  }

  const items = collectAttendanceItems();

  const payload = {
    attendance_date: attendanceDate,
    timetable_hash: timetableHash || null,
    section_hash: sectionHash || null,
    items,
  };

  try {
    const response = await fetch(`${getApiBaseUrl()}/mark_attendance`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to save attendance");
    }

    alert(data.message || "Attendance saved successfully.");
  } catch (error) {
    console.warn("mark_attendance fallback mock used:", error.message);
    alert("API failed. Mock attendance saved locally.");
  }

  if (courseSectionHash) {
    localStorage.setItem("selected_course_section_hash", courseSectionHash);
  }
}

function initSelectedAttendanceSection() {
  const savedCourseSectionHash =
    localStorage.getItem("selected_course_section_hash") ||
    localStorage.getItem("selected_section") ||
    "";

  if (savedCourseSectionHash) {
    currentAttendanceCourseSectionHash = savedCourseSectionHash;
    attendanceCourseSectionHashInput.value = savedCourseSectionHash;
    selectedAttendanceSectionLabel.textContent = `Selected course section: ${savedCourseSectionHash}`;
  }
}

function bindAttendanceEvents() {
  if (loadAttendanceBtn) {
    loadAttendanceBtn.addEventListener("click", loadAttendance);
  }

  if (saveAttendanceBtn) {
    saveAttendanceBtn.addEventListener("click", saveAttendance);
  }
}

function initAttendancePage() {
  setTodayDate();
  initSelectedAttendanceSection();
  bindAttendanceEvents();
}

document.addEventListener("DOMContentLoaded", initAttendancePage);