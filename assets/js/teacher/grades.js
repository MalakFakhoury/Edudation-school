const gradesSectionHashInput = document.getElementById("gradesSectionHashInput");
const gradesCourseSectionHashInput = document.getElementById("gradesCourseSectionHashInput");
const loadGradesBtn = document.getElementById("loadGradesBtn");
const saveGradesBtn = document.getElementById("saveGradesBtn");
const selectedGradesSectionLabel = document.getElementById("selectedGradesSectionLabel");
const gradesListWrap = document.getElementById("gradesListWrap");

let gradesList = [];
let currentSectionHash = "";
let currentCourseSectionHash = "";

function renderGradesList() {
  if (!gradesListWrap) return;

  if (!gradesList.length) {
    gradesListWrap.innerHTML = `
      <div class="t-empty-state">
        <div class="t-card__meta">No grades</div>
        <h3 class="t-card__title">No grades found</h3>
        <p class="t-muted">Load a course section first.</p>
      </div>
    `;
    return;
  }

  gradesListWrap.innerHTML = gradesList
    .map((item, index) => {
      const fullName = `${item.first_name || ""} ${item.last_name || ""}`.trim();

      return `
        <div class="t-attendance-item grade-item" data-student-hash="${formatValue(item.student_hash)}" data-assignment-hash="${formatValue(item.assignment_hash || "")}">
          <div class="t-attendance-main">
            <div>
              <div class="t-attendance-name">${formatValue(fullName || item.username || item.student_hash)}</div>
              <div class="t-attendance-hash">Student: ${formatValue(item.student_hash)}</div>
              <div class="t-attendance-hash">Assignment: ${formatValue(item.assignment_title || item.assignment_hash || "Unknown")}</div>
            </div>

            <div class="t-attendance-statuses">
              <label>Grade</label>
              <input
                type="number"
                step="0.01"
                class="t-input grade-value-input"
                placeholder="Grade"
                value="${item.grade_value ?? ""}"
                style="min-width:120px;"
              />
            </div>
          </div>

          <div class="t-attendance-extra">
            <input
              type="text"
              class="t-input grade-feedback-input"
              placeholder="Feedback"
              value="${item.feedback ?? ""}"
            />

            <input
              type="text"
              class="t-input"
              value="Teacher: ${formatValue(item.created_by_teacher || "Unknown")}"
              readonly
            />

            <input
              type="text"
              class="t-input"
              value="Updated: ${formatValue(item.updated_at || item.created_at || "Unknown")}"
              readonly
            />
          </div>
        </div>
      `;
    })
    .join("");
}

function seedMockGrades() {
  gradesList = [
    {
      grade_hash: "grade_001",
      student_hash: "stu_001",
      username: "ahmed.ali",
      first_name: "Ahmed",
      last_name: "Ali",
      assignment_hash: "assignment_001",
      assignment_title: "Homework 1",
      grade_value: 18,
      feedback: "Very good work",
      created_by_teacher: "teacher_001",
      created_at: "2026-03-20 10:00:00",
      updated_at: "2026-03-20 10:30:00",
    },
    {
      grade_hash: "grade_002",
      student_hash: "stu_002",
      username: "sara.mohamed",
      first_name: "Sara",
      last_name: "Mohamed",
      assignment_hash: "assignment_001",
      assignment_title: "Homework 1",
      grade_value: 15.5,
      feedback: "Good, but check question 3",
      created_by_teacher: "teacher_001",
      created_at: "2026-03-20 10:05:00",
      updated_at: "2026-03-20 10:35:00",
    },
    {
      grade_hash: "grade_003",
      student_hash: "stu_003",
      username: "lina.hassan",
      first_name: "Lina",
      last_name: "Hassan",
      assignment_hash: "assignment_002",
      assignment_title: "Worksheet",
      grade_value: null,
      feedback: "",
      created_by_teacher: "teacher_001",
      created_at: "2026-03-20 10:10:00",
      updated_at: "2026-03-20 10:10:00",
    },
  ];

  renderGradesList();
}

async function loadGrades() {
  const courseSectionHash = gradesCourseSectionHashInput?.value.trim();
  const sectionHash = gradesSectionHashInput?.value.trim();

  if (!courseSectionHash) {
    alert("Course section hash is required.");
    return;
  }

  currentCourseSectionHash = courseSectionHash;
  currentSectionHash = sectionHash || currentSectionHash;

  selectedGradesSectionLabel.textContent = `Selected course section: ${courseSectionHash}`;
  localStorage.setItem("selected_course_section_hash", courseSectionHash);

  try {
    const response = await fetch(`${getApiBaseUrl()}/get_grades`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        course_section_hash: courseSectionHash,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to load grades");
    }

    const data = await response.json();
    gradesList = Array.isArray(data) ? data : data.list || [];
    renderGradesList();
  } catch (error) {
    console.warn("get_grades fallback mock used:", error.message);
    seedMockGrades();
  }
}

function collectGradesItems() {
  const wrappers = document.querySelectorAll(".grade-item");

  return Array.from(wrappers).map((wrapper) => {
    const studentHash = wrapper.dataset.studentHash || "";
    const assignmentHash = wrapper.dataset.assignmentHash || "";
    const gradeValueInput = wrapper.querySelector(".grade-value-input");
    const feedbackInput = wrapper.querySelector(".grade-feedback-input");

    return {
      student_hash: studentHash,
      assignment_hash: assignmentHash || null,
      grade_value:
        gradeValueInput && gradeValueInput.value !== ""
          ? Number(gradeValueInput.value)
          : null,
      feedback:
        feedbackInput && feedbackInput.value.trim() !== ""
          ? feedbackInput.value.trim()
          : null,
    };
  });
}

async function saveGrades() {
  const sectionHash = gradesSectionHashInput?.value.trim();
  const courseSectionHash = gradesCourseSectionHashInput?.value.trim();

  if (!sectionHash) {
    alert("Section hash is required.");
    return;
  }

  if (!courseSectionHash) {
    alert("Course section hash is required.");
    return;
  }

  if (!gradesList.length) {
    alert("No grades to save.");
    return;
  }

  const grades = collectGradesItems();

  const payload = {
    section_hash: sectionHash,
    course_section_hash: courseSectionHash,
    grades,
  };

  try {
    const response = await fetch(`${getApiBaseUrl()}/submit_grades`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to save grades");
    }

    alert(data.message || "Grades saved successfully.");

    gradesList = gradesList.map((item) => {
      const updated = grades.find(
        (g) =>
          g.student_hash === item.student_hash &&
          (g.assignment_hash || "") === (item.assignment_hash || "")
      );

      if (!updated) return item;

      return {
        ...item,
        grade_value: updated.grade_value,
        feedback: updated.feedback,
        updated_at: new Date().toISOString(),
      };
    });

    renderGradesList();
  } catch (error) {
    console.warn("submit_grades fallback mock used:", error.message);
    alert("API failed. Mock grades saved locally.");

    gradesList = gradesList.map((item) => {
      const updated = grades.find(
        (g) =>
          g.student_hash === item.student_hash &&
          (g.assignment_hash || "") === (item.assignment_hash || "")
      );

      if (!updated) return item;

      return {
        ...item,
        grade_value: updated.grade_value,
        feedback: updated.feedback,
        updated_at: new Date().toISOString(),
      };
    });

    renderGradesList();
  }
}

function initSelectedGradesSection() {
  const savedCourseSectionHash =
    localStorage.getItem("selected_course_section_hash") || "";
  const savedSectionHash =
    localStorage.getItem("selected_section_hash") || "";

  if (savedCourseSectionHash) {
    currentCourseSectionHash = savedCourseSectionHash;
    gradesCourseSectionHashInput.value = savedCourseSectionHash;
    selectedGradesSectionLabel.textContent = `Selected course section: ${savedCourseSectionHash}`;
  }

  if (savedSectionHash) {
    currentSectionHash = savedSectionHash;
    gradesSectionHashInput.value = savedSectionHash;
  }
}

function bindGradesEvents() {
  if (loadGradesBtn) {
    loadGradesBtn.addEventListener("click", loadGrades);
  }

  if (saveGradesBtn) {
    saveGradesBtn.addEventListener("click", saveGrades);
  }
}

function initGradesPage() {
  initSelectedGradesSection();
  bindGradesEvents();
  seedMockGrades();
}

document.addEventListener("DOMContentLoaded", initGradesPage);