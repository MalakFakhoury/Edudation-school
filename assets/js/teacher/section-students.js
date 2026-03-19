const selectedSectionLabel = document.getElementById("selectedSectionLabel");
const backToSectionsBtn = document.getElementById("backToSectionsBtn");
const loadStudentsBtn = document.getElementById("loadStudentsBtn");
const courseSectionHashInput = document.getElementById("courseSectionHashInput");
const studentsGrid = document.getElementById("studentsGrid");

let sectionStudents = [];
let currentOrgType = "";

function renderStudents() {
  if (!studentsGrid) return;

  if (!sectionStudents.length) {
    studentsGrid.innerHTML = `
      <article class="t-card t-card--empty">
        <div class="t-card__body">
          <div class="t-card__meta">No students</div>
          <h3 class="t-card__title">No students found</h3>
          <p class="t-muted">Enter a course section hash and load students.</p>
        </div>
      </article>
    `;
    return;
  }

  studentsGrid.innerHTML = sectionStudents
    .map((studentName, index) => {
      return `
        <article class="t-card">
          <div class="t-card__body">
            <div class="t-card__meta">
              ${formatValue(currentOrgType)} • Student ${index + 1}
            </div>
            <h3 class="t-card__title">${formatValue(studentName)}</h3>
            <p class="t-muted">Enrolled in selected course section</p>
          </div>
        </article>
      `;
    })
    .join("");
}

function seedMockStudents() {
  currentOrgType = "school";
  sectionStudents = [
    "Ahmed Ali",
    "Sara Mohamed",
    "Mohammad Hassan",
    "Lina Khaled",
  ];
  renderStudents();
}

async function loadSectionStudents() {
  const courseSectionHash = courseSectionHashInput?.value.trim();

  if (!courseSectionHash) {
    alert("Course section hash is required.");
    return;
  }

  const payload = {
    course_section_hash: courseSectionHash,
  };

  try {
    const response = await fetch(`${getApiBaseUrl()}/get_section_students`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to load section students");
    }

    const data = await response.json();

    currentOrgType = data.org_type || "Unknown";
    sectionStudents = Array.isArray(data.list) ? data.list : [];

    if (selectedSectionLabel) {
      selectedSectionLabel.textContent = `Selected course section: ${courseSectionHash}`;
    }

    localStorage.setItem("selected_course_section_hash", courseSectionHash);

    renderStudents();
  } catch (error) {
    console.warn("get_section_students mock fallback used:", error.message);

    if (selectedSectionLabel) {
      selectedSectionLabel.textContent = `Selected course section: ${courseSectionHash}`;
    }

    localStorage.setItem("selected_course_section_hash", courseSectionHash);

    seedMockStudents();
    alert("API failed. Mock students loaded.");
  }
}

function initSelectedCourseSection() {
  const savedCourseSectionHash =
    localStorage.getItem("selected_course_section_hash") ||
    localStorage.getItem("selected_section") ||
    "";

  if (courseSectionHashInput && savedCourseSectionHash) {
    courseSectionHashInput.value = savedCourseSectionHash;
  }

  if (selectedSectionLabel) {
    selectedSectionLabel.textContent = `Selected course section: ${savedCourseSectionHash || "Unknown"}`;
  }
}

function bindSectionStudentsEvents() {
  if (backToSectionsBtn) {
    backToSectionsBtn.addEventListener("click", () => {
      window.location.href = "./teachers.html";
    });
  }

  if (loadStudentsBtn) {
    loadStudentsBtn.addEventListener("click", loadSectionStudents);
  }
}

function initSectionStudentsPage() {
  initSelectedCourseSection();
  bindSectionStudentsEvents();
}

document.addEventListener("DOMContentLoaded", initSectionStudentsPage);