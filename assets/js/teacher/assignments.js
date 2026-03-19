const openCreateAssignmentModalBtn = document.getElementById("openCreateAssignmentModalBtn");
const loadAssignmentsBtn = document.getElementById("loadAssignmentsBtn");
const assignmentCourseSectionHashInput = document.getElementById("assignmentCourseSectionHashInput");
const selectedAssignmentCourseSectionLabel = document.getElementById("selectedAssignmentCourseSectionLabel");
const assignmentsGrid = document.getElementById("assignmentsGrid");

const assignmentModal = document.getElementById("assignmentModal");
const assignmentModalBackdrop = document.getElementById("assignmentModalBackdrop");
const closeAssignmentModalBtn = document.getElementById("closeAssignmentModalBtn");
const cancelAssignmentModalBtn = document.getElementById("cancelAssignmentModalBtn");
const assignmentModalTitle = document.getElementById("assignmentModalTitle");

const assignmentForm = document.getElementById("assignmentForm");
const assignmentHashInput = document.getElementById("assignmentHashInput");
const assignmentSectionHashField = document.getElementById("assignmentSectionHashField");
const assignmentTitleInput = document.getElementById("assignmentTitleInput");
const assignmentDescriptionInput = document.getElementById("assignmentDescriptionInput");
const assignmentDueDateInput = document.getElementById("assignmentDueDateInput");

const submissionsModal = document.getElementById("submissionsModal");
const submissionsModalBackdrop = document.getElementById("submissionsModalBackdrop");
const closeSubmissionsModalBtn = document.getElementById("closeSubmissionsModalBtn");
const submissionsModalTitle = document.getElementById("submissionsModalTitle");
const submissionsGrid = document.getElementById("submissionsGrid");

let assignmentsList = [];
let submissionsList = [];
let currentAssignmentCourseSectionHash = "";

function openAssignmentModal() {
  if (!assignmentModal) return;
  assignmentModal.classList.add("show");
}

function closeAssignmentModal() {
  if (!assignmentModal) return;
  assignmentModal.classList.remove("show");
}

function openSubmissionsModal() {
  if (!submissionsModal) return;
  submissionsModal.classList.add("show");
}

function closeSubmissionsModal() {
  if (!submissionsModal) return;
  submissionsModal.classList.remove("show");
}

function resetAssignmentForm() {
  if (!assignmentForm) return;
  assignmentForm.reset();
  assignmentHashInput.value = "";
  assignmentModalTitle.textContent = "Create Assignment";
  assignmentSectionHashField.value = currentAssignmentCourseSectionHash || "";
}

function fillAssignmentForm(assignment) {
  assignmentHashInput.value = assignment.assignment_hash || "";
  assignmentSectionHashField.value = assignment.section_hash || currentAssignmentCourseSectionHash || "";
  assignmentTitleInput.value = assignment.title || "";
  assignmentDescriptionInput.value = assignment.description || "";
  assignmentDueDateInput.value = assignment.due_date || "";
  assignmentModalTitle.textContent = "Update Assignment";
}

function renderAssignments() {
  if (!assignmentsGrid) return;

  if (!assignmentsList.length) {
    assignmentsGrid.innerHTML = `
      <article class="t-card t-card--empty">
        <div class="t-card__body">
          <div class="t-card__meta">No assignments</div>
          <h3 class="t-card__title">No assignments found</h3>
          <p class="t-muted">Enter a course section hash and load assignments.</p>
        </div>
      </article>
    `;
    return;
  }

  assignmentsGrid.innerHTML = assignmentsList
    .map((assignment) => {
      return `
        <article class="t-card">
          <div class="t-card__body">
            <div class="t-card__meta">
              ${formatValue(assignment.created_at || "No created date")}
            </div>

            <h3 class="t-card__title">${formatValue(assignment.title)}</h3>

            <p class="t-muted">${formatValue(assignment.description || "No description")}</p>

            <div class="t-card__stats">
              <span>📅 ${formatValue(assignment.due_date || "No due date")}</span>
            </div>

            <div class="t-card__actions">
              <button
                class="t-btn t-btn--small view-submissions-btn"
                type="button"
                data-assignment-hash="${formatValue(assignment.assignment_hash)}"
              >
                Submissions
              </button>

              <button
                class="t-btn t-btn--small edit-assignment-btn"
                type="button"
                data-assignment-hash="${formatValue(assignment.assignment_hash)}"
              >
                Edit
              </button>

              <button
                class="t-btn t-btn--small t-btn--ghost delete-assignment-btn"
                type="button"
                data-assignment-hash="${formatValue(assignment.assignment_hash)}"
              >
                Delete
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderSubmissions() {
  if (!submissionsGrid) return;

  if (!submissionsList.length) {
    submissionsGrid.innerHTML = `
      <article class="t-card t-card--empty">
        <div class="t-card__body">
          <div class="t-card__meta">No submissions</div>
          <h3 class="t-card__title">No submissions found</h3>
          <p class="t-muted">This assignment has no submissions yet.</p>
        </div>
      </article>
    `;
    return;
  }

  submissionsGrid.innerHTML = submissionsList
    .map((submission) => {
      return `
        <article class="t-card">
          <div class="t-card__body">
            <div class="t-card__meta">
              ${formatValue(submission.submitted_at || "No submit date")}
            </div>

            <h3 class="t-card__title">
              ${formatValue(
                `${submission.first_name || ""} ${submission.last_name || ""}`.trim() ||
                submission.username ||
                submission.email
              )}
            </h3>

            <p class="t-muted">Username: ${formatValue(submission.username)}</p>
            <p class="t-muted">Email: ${formatValue(submission.email)}</p>
            <p class="t-muted">Student Hash: ${formatValue(submission.student_hash)}</p>

            <div class="t-card__stats">
              <span>📎 ${formatValue(submission.file_url || "No file")}</span>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function seedMockAssignments() {
  assignmentsList = [
    {
      assignment_hash: "assignment_001",
      section_hash: currentAssignmentCourseSectionHash || "sec_math_a",
      title: "Homework 1",
      description: "Solve exercises 1 to 10 from chapter 2.",
      due_date: "2026-03-25",
      created_at: "2026-03-19 09:00:00",
      updated_at: "2026-03-19 09:00:00",
    },
    {
      assignment_hash: "assignment_002",
      section_hash: currentAssignmentCourseSectionHash || "sec_math_a",
      title: "Worksheet: Linear Equations",
      description: "Complete the worksheet and upload your answers.",
      due_date: "2026-03-27",
      created_at: "2026-03-18 11:00:00",
      updated_at: "2026-03-18 11:00:00",
    },
    {
      assignment_hash: "assignment_003",
      section_hash: currentAssignmentCourseSectionHash || "sec_math_a",
      title: "Short Reflection",
      description: "Write a short summary about solving equations.",
      due_date: "",
      created_at: "2026-03-17 08:30:00",
      updated_at: "2026-03-17 08:30:00",
    },
  ];

  renderAssignments();
}

function seedMockSubmissions() {
  submissionsList = [
    {
      submission_hash: "sub_001",
      assignment_hash: "assignment_001",
      student_hash: "stu_001",
      username: "ahmed.ali",
      first_name: "Ahmed",
      last_name: "Ali",
      email: "ahmed@example.com",
      file_url: "https://example.com/files/ahmed-homework.pdf",
      submitted_at: "2026-03-20 14:20:00",
    },
    {
      submission_hash: "sub_002",
      assignment_hash: "assignment_001",
      student_hash: "stu_002",
      username: "sara.mohamed",
      first_name: "Sara",
      last_name: "Mohamed",
      email: "sara@example.com",
      file_url: "https://example.com/files/sara-homework.pdf",
      submitted_at: "2026-03-20 15:10:00",
    },
  ];

  renderSubmissions();
}

async function loadAssignments() {
  const courseSectionHash = assignmentCourseSectionHashInput?.value.trim();

  if (!courseSectionHash) {
    alert("Course section hash is required.");
    return;
  }

  currentAssignmentCourseSectionHash = courseSectionHash;

  try {
    const response = await fetch(`${getApiBaseUrl()}/get_assignments`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        course_section_hash: courseSectionHash,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to load assignments");
    }

    const data = await response.json();
    assignmentsList = Array.isArray(data) ? data : data.list || [];

    selectedAssignmentCourseSectionLabel.textContent = `Selected course section: ${courseSectionHash}`;
    localStorage.setItem("selected_course_section_hash", courseSectionHash);

    renderAssignments();
  } catch (error) {
    console.warn("get_assignments fallback mock used:", error.message);

    selectedAssignmentCourseSectionLabel.textContent = `Selected course section: ${courseSectionHash}`;
    localStorage.setItem("selected_course_section_hash", courseSectionHash);

    seedMockAssignments();
  }
}

async function loadAssignmentSubmissions(assignmentHash) {
  const courseSectionHash =
    currentAssignmentCourseSectionHash ||
    assignmentCourseSectionHashInput.value.trim() ||
    localStorage.getItem("selected_course_section_hash") ||
    "";

  if (!assignmentHash || !courseSectionHash) {
    alert("Assignment hash and course section hash are required.");
    return;
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/get_assignment_submissions`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        assignment_hash: assignmentHash,
        course_section_hash: courseSectionHash,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to load assignment submissions");
    }

    const data = await response.json();
    submissionsList = Array.isArray(data) ? data : data.list || [];

    submissionsModalTitle.textContent = `Assignment Submissions (${assignmentHash})`;
    renderSubmissions();
    openSubmissionsModal();
  } catch (error) {
    console.warn("get_assignment_submissions fallback mock used:", error.message);

    submissionsModalTitle.textContent = `Assignment Submissions (${assignmentHash})`;
    seedMockSubmissions();
    openSubmissionsModal();
  }
}

async function createAssignmentRequest(payload) {
  const response = await fetch(`${getApiBaseUrl()}/create_assignment`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create assignment");
  }

  return response.json();
}

async function updateAssignmentRequest(payload) {
  const response = await fetch(`${getApiBaseUrl()}/update_assignment`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update assignment");
  }

  return response.json();
}

async function deleteAssignmentRequest(assignmentHash, courseSectionHash) {
  const response = await fetch(`${getApiBaseUrl()}/delete_assignment`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      assignment_hash: assignmentHash,
      course_section_hash: courseSectionHash,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete assignment");
  }

  return response.json();
}

async function handleAssignmentFormSubmit(event) {
  event.preventDefault();

  const assignmentHash = assignmentHashInput.value.trim();
  const isEdit = Boolean(assignmentHash);

  if (isEdit) {
    const payload = {
      course_section_hash: assignmentSectionHashField.value.trim(),
      assignment_hash: assignmentHash,
      title: assignmentTitleInput.value.trim() || null,
      description: assignmentDescriptionInput.value.trim() || null,
      due_date: assignmentDueDateInput.value.trim() || null,
    };

    try {
      await updateAssignmentRequest(payload);
    } catch (error) {
      console.warn("update_assignment fallback mock used:", error.message);
    }

    assignmentsList = assignmentsList.map((assignment) => {
      if (assignment.assignment_hash !== assignmentHash) return assignment;

      return {
        ...assignment,
        section_hash: payload.course_section_hash || assignment.section_hash,
        title: payload.title || assignment.title,
        description: payload.description || "",
        due_date: payload.due_date || "",
        updated_at: new Date().toISOString(),
      };
    });

    renderAssignments();
    closeAssignmentModal();
    resetAssignmentForm();
    return;
  }

  const payload = {
    course_section_hash: assignmentSectionHashField.value.trim(),
    title: assignmentTitleInput.value.trim(),
    description: assignmentDescriptionInput.value.trim() || null,
    due_date: assignmentDueDateInput.value.trim() || null,
  };

  if (!payload.course_section_hash || !payload.title) {
    alert("Course section hash and title are required.");
    return;
  }

  try {
    await createAssignmentRequest(payload);
  } catch (error) {
    console.warn("create_assignment fallback mock used:", error.message);
  }

  assignmentsList.unshift({
    assignment_hash: `assignment_${Date.now()}`,
    section_hash: payload.course_section_hash,
    title: payload.title,
    description: payload.description || "",
    due_date: payload.due_date || "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  renderAssignments();
  closeAssignmentModal();
  resetAssignmentForm();
}

async function handleAssignmentsGridClick(event) {
  const submissionsBtn = event.target.closest(".view-submissions-btn");
  const editBtn = event.target.closest(".edit-assignment-btn");
  const deleteBtn = event.target.closest(".delete-assignment-btn");

  if (submissionsBtn) {
    const assignmentHash = submissionsBtn.dataset.assignmentHash;
    if (!assignmentHash) return;
    await loadAssignmentSubmissions(assignmentHash);
    return;
  }

  if (editBtn) {
    const assignmentHash = editBtn.dataset.assignmentHash;
    const assignment = assignmentsList.find((item) => item.assignment_hash === assignmentHash);
    if (!assignment) return;

    fillAssignmentForm(assignment);
    openAssignmentModal();
    return;
  }

  if (deleteBtn) {
    const assignmentHash = deleteBtn.dataset.assignmentHash;
    if (!assignmentHash) return;

    const confirmed = confirm("Are you sure you want to delete this assignment?");
    if (!confirmed) return;

    try {
      await deleteAssignmentRequest(
        assignmentHash,
        currentAssignmentCourseSectionHash || assignmentCourseSectionHashInput.value.trim()
      );
    } catch (error) {
      console.warn("delete_assignment fallback mock used:", error.message);
    }

    assignmentsList = assignmentsList.filter(
      (assignment) => assignment.assignment_hash !== assignmentHash
    );
    renderAssignments();
  }
}

function initSelectedAssignmentCourseSection() {
  const savedCourseSectionHash =
    localStorage.getItem("selected_course_section_hash") ||
    localStorage.getItem("selected_section") ||
    "";

  if (savedCourseSectionHash) {
    currentAssignmentCourseSectionHash = savedCourseSectionHash;
    assignmentCourseSectionHashInput.value = savedCourseSectionHash;
    assignmentSectionHashField.value = savedCourseSectionHash;
    selectedAssignmentCourseSectionLabel.textContent = `Selected course section: ${savedCourseSectionHash}`;
  }
}

function bindAssignmentEvents() {
  if (openCreateAssignmentModalBtn) {
    openCreateAssignmentModalBtn.addEventListener("click", () => {
      resetAssignmentForm();
      openAssignmentModal();
    });
  }

  if (loadAssignmentsBtn) {
    loadAssignmentsBtn.addEventListener("click", loadAssignments);
  }

  if (closeAssignmentModalBtn) {
    closeAssignmentModalBtn.addEventListener("click", () => {
      closeAssignmentModal();
      resetAssignmentForm();
    });
  }

  if (cancelAssignmentModalBtn) {
    cancelAssignmentModalBtn.addEventListener("click", () => {
      closeAssignmentModal();
      resetAssignmentForm();
    });
  }

  if (assignmentModalBackdrop) {
    assignmentModalBackdrop.addEventListener("click", () => {
      closeAssignmentModal();
      resetAssignmentForm();
    });
  }

  if (assignmentForm) {
    assignmentForm.addEventListener("submit", handleAssignmentFormSubmit);
  }

  if (assignmentsGrid) {
    assignmentsGrid.addEventListener("click", handleAssignmentsGridClick);
  }

  if (closeSubmissionsModalBtn) {
    closeSubmissionsModalBtn.addEventListener("click", closeSubmissionsModal);
  }

  if (submissionsModalBackdrop) {
    submissionsModalBackdrop.addEventListener("click", closeSubmissionsModal);
  }
}

function initAssignmentsPage() {
  initSelectedAssignmentCourseSection();
  bindAssignmentEvents();
  seedMockAssignments();
}

document.addEventListener("DOMContentLoaded", initAssignmentsPage);