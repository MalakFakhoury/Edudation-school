const teacherTimetableTermHashInput = document.getElementById("teacherTimetableTermHashInput");
const loadTeacherTimetableBtn = document.getElementById("loadTeacherTimetableBtn");
const teacherTimetableGrid = document.getElementById("teacherTimetableGrid");
const teacherTimetableOrgTypeLabel = document.getElementById("teacherTimetableOrgTypeLabel");

let teacherTimetableList = [];
let teacherTimetableOrgType = "";

function renderTeacherTimetable() {
  if (!teacherTimetableGrid) return;

  if (!teacherTimetableList.length) {
    teacherTimetableGrid.innerHTML = `
      <article class="t-card t-card--empty">
        <div class="t-card__body">
          <div class="t-card__meta">No timetable</div>
          <h3 class="t-card__title">No timetable found</h3>
          <p class="t-muted">Enter a term hash and load your timetable.</p>
        </div>
      </article>
    `;
    return;
  }

  teacherTimetableGrid.innerHTML = teacherTimetableList
    .map((item, index) => {
      return `
        <article class="t-card">
          <div class="t-card__body">
            <div class="t-card__meta">
              ${formatValue(teacherTimetableOrgType)} • Entry ${index + 1}
            </div>
            <h3 class="t-card__title">${formatValue(item)}</h3>
            <p class="t-muted">Timetable entry loaded from current term</p>
          </div>
        </article>
      `;
    })
    .join("");
}

function seedMockTeacherTimetable() {
  teacherTimetableOrgType = "school";
  teacherTimetableList = [
    "Sunday - Period 1 - Math - Section A",
    "Monday - Period 2 - Physics - Section B",
    "Tuesday - Period 3 - Chemistry - Section C",
  ];
  renderTeacherTimetable();
}

async function loadTeacherTimetable() {
  const termHash = teacherTimetableTermHashInput?.value.trim();

  if (!termHash) {
    alert("Term hash is required.");
    return;
  }

  const payload = {
    term_hash: termHash,
  };

  try {
    const response = await fetch(`${getApiBaseUrl()}/my_timetable`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to load teacher timetable");
    }

    const data = await response.json();

    teacherTimetableOrgType = data.org_type || "Unknown";
    teacherTimetableList = Array.isArray(data.list) ? data.list : [];

    if (teacherTimetableOrgTypeLabel) {
      teacherTimetableOrgTypeLabel.textContent = `Organization type: ${teacherTimetableOrgType}`;
    }

    renderTeacherTimetable();
  } catch (error) {
    console.warn("my_timetable mock fallback used:", error.message);

    if (teacherTimetableOrgTypeLabel) {
      teacherTimetableOrgTypeLabel.textContent = "Organization type: school";
    }

    seedMockTeacherTimetable();
    alert("API failed. Mock timetable loaded.");
  }
}

function initTeacherTimetablePage() {
  if (loadTeacherTimetableBtn) {
    loadTeacherTimetableBtn.addEventListener("click", loadTeacherTimetable);
  }
}

document.addEventListener("DOMContentLoaded", initTeacherTimetablePage);