const openCreateQuizModalBtn = document.getElementById("openCreateQuizModalBtn");
const quizCourseSectionHashInput = document.getElementById("quizCourseSectionHashInput");
const selectedQuizCourseSectionLabel = document.getElementById("selectedQuizCourseSectionLabel");
const quizzesGrid = document.getElementById("quizzesGrid");

const quizModal = document.getElementById("quizModal");
const quizModalBackdrop = document.getElementById("quizModalBackdrop");
const closeQuizModalBtn = document.getElementById("closeQuizModalBtn");
const cancelQuizModalBtn = document.getElementById("cancelQuizModalBtn");
const quizModalTitle = document.getElementById("quizModalTitle");

const quizForm = document.getElementById("quizForm");
const quizHashInput = document.getElementById("quizHashInput");
const quizSectionHashField = document.getElementById("quizSectionHashField");
const quizTitleInput = document.getElementById("quizTitleInput");
const quizDescriptionInput = document.getElementById("quizDescriptionInput");
const quizTotalMarksInput = document.getElementById("quizTotalMarksInput");

const quizResultsModal = document.getElementById("quizResultsModal");
const quizResultsModalBackdrop = document.getElementById("quizResultsModalBackdrop");
const closeQuizResultsModalBtn = document.getElementById("closeQuizResultsModalBtn");
const quizResultsModalTitle = document.getElementById("quizResultsModalTitle");
const quizResultsGrid = document.getElementById("quizResultsGrid");

let quizzesList = [];
let quizResultsList = [];
let currentQuizCourseSectionHash = "";

function openQuizModal() {
  if (!quizModal) return;
  quizModal.classList.add("show");
}

function closeQuizModal() {
  if (!quizModal) return;
  quizModal.classList.remove("show");
}

function openQuizResultsModal() {
  if (!quizResultsModal) return;
  quizResultsModal.classList.add("show");
}

function closeQuizResultsModal() {
  if (!quizResultsModal) return;
  quizResultsModal.classList.remove("show");
}

function resetQuizForm() {
  if (!quizForm) return;
  quizForm.reset();
  quizHashInput.value = "";
  quizModalTitle.textContent = "Create Quiz";
  quizSectionHashField.value = currentQuizCourseSectionHash || "";
}

function fillQuizForm(quiz) {
  quizHashInput.value = quiz.quiz_hash || "";
  quizSectionHashField.value = quiz.course_section_hash || currentQuizCourseSectionHash || "";
  quizTitleInput.value = quiz.title || "";
  quizDescriptionInput.value = quiz.description || "";
  quizTotalMarksInput.value = quiz.total_marks ?? "";
  quizModalTitle.textContent = "Update Quiz";
}

function renderQuizzes() {
  if (!quizzesGrid) return;

  const filtered = currentQuizCourseSectionHash
    ? quizzesList.filter((quiz) => quiz.course_section_hash === currentQuizCourseSectionHash)
    : quizzesList;

  if (!filtered.length) {
    quizzesGrid.innerHTML = `
      <article class="t-card t-card--empty">
        <div class="t-card__body">
          <div class="t-card__meta">No quizzes</div>
          <h3 class="t-card__title">No quizzes found</h3>
          <p class="t-muted">Create a quiz to see it here.</p>
        </div>
      </article>
    `;
    return;
  }

  quizzesGrid.innerHTML = filtered
    .map((quiz) => {
      return `
        <article class="t-card">
          <div class="t-card__body">
            <div class="t-card__meta">${formatValue(quiz.course_section_hash)}</div>
            <h3 class="t-card__title">${formatValue(quiz.title)}</h3>
            <p class="t-muted">${formatValue(quiz.description || "No description")}</p>

            <div class="t-card__stats">
              <span>🧮 ${formatValue(quiz.total_marks ?? "No total marks")}</span>
            </div>

            <div class="t-card__actions">
              <button
                class="t-btn t-btn--small view-results-btn"
                type="button"
                data-quiz-hash="${formatValue(quiz.quiz_hash)}"
              >
                Results
              </button>

              <button
                class="t-btn t-btn--small edit-quiz-btn"
                type="button"
                data-quiz-hash="${formatValue(quiz.quiz_hash)}"
              >
                Edit
              </button>

              <button
                class="t-btn t-btn--small t-btn--ghost delete-quiz-btn"
                type="button"
                data-quiz-hash="${formatValue(quiz.quiz_hash)}"
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

function renderQuizResults() {
  if (!quizResultsGrid) return;

  if (!quizResultsList.length) {
    quizResultsGrid.innerHTML = `
      <article class="t-card t-card--empty">
        <div class="t-card__body">
          <div class="t-card__meta">No results</div>
          <h3 class="t-card__title">No quiz results found</h3>
          <p class="t-muted">This quiz has no submissions yet.</p>
        </div>
      </article>
    `;
    return;
  }

  quizResultsGrid.innerHTML = quizResultsList
    .map((item) => {
      const fullName = `${item.first_name || ""} ${item.last_name || ""}`.trim();

      return `
        <article class="t-card">
          <div class="t-card__body">
            <div class="t-card__meta">${formatValue(item.submitted_at || "No submit date")}</div>
            <h3 class="t-card__title">${formatValue(fullName || item.username || item.student_hash)}</h3>
            <p class="t-muted">Username: ${formatValue(item.username)}</p>

            <div class="t-card__stats">
              <span>🎯 Score: ${formatValue(item.score)}</span>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function seedMockQuizzes() {
  quizzesList = [
    {
      quiz_hash: "quiz_001",
      course_section_hash: currentQuizCourseSectionHash || "sec_math_a",
      title: "Quiz 1 - Algebra",
      description: "Basic algebra quiz.",
      total_marks: 20,
    },
    {
      quiz_hash: "quiz_002",
      course_section_hash: currentQuizCourseSectionHash || "sec_math_a",
      title: "Quiz 2 - Equations",
      description: "Linear equations quiz.",
      total_marks: 15,
    },
  ];

  renderQuizzes();
}

function seedMockQuizResults() {
  quizResultsList = [
    {
      submission_hash: "sub_001",
      student_hash: "stu_001",
      username: "ahmed.ali",
      first_name: "Ahmed",
      last_name: "Ali",
      score: "18",
      submitted_at: "2026-03-20 10:15:00",
    },
    {
      submission_hash: "sub_002",
      student_hash: "stu_002",
      username: "sara.mohamed",
      first_name: "Sara",
      last_name: "Mohamed",
      score: "14",
      submitted_at: "2026-03-20 10:25:00",
    },
  ];

  renderQuizResults();
}

async function createQuizRequest(payload) {
  const response = await fetch(`${getApiBaseUrl()}/create_quiz`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create quiz");
  }

  return response.json();
}

async function updateQuizRequest(payload) {
  const response = await fetch(`${getApiBaseUrl()}/update_quiz`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update quiz");
  }

  return response.json();
}

async function deleteQuizRequest(quizHash, courseSectionHash) {
  const response = await fetch(`${getApiBaseUrl()}/delete_quiz`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      quiz_hash: quizHash,
      course_section_hash: courseSectionHash,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete quiz");
  }

  return response.json();
}

async function getQuizResultsRequest(quizHash, courseSectionHash) {
  const response = await fetch(`${getApiBaseUrl()}/get_quiz_results`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      quiz_hash: quizHash,
      course_section_hash: courseSectionHash,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get quiz results");
  }

  return response.json();
}

async function handleQuizFormSubmit(event) {
  event.preventDefault();

  const quizHash = quizHashInput.value.trim();
  const isEdit = Boolean(quizHash);

  if (isEdit) {
    const payload = {
      course_section_hash: quizSectionHashField.value.trim(),
      quiz_hash: quizHash,
      title: quizTitleInput.value.trim() || null,
      description: quizDescriptionInput.value.trim() || null,
      total_marks: quizTotalMarksInput.value ? Number(quizTotalMarksInput.value) : null,
    };

    try {
      await updateQuizRequest(payload);
    } catch (error) {
      console.warn("update_quiz fallback mock used:", error.message);
    }

    quizzesList = quizzesList.map((quiz) => {
      if (quiz.quiz_hash !== quizHash) return quiz;

      return {
        ...quiz,
        course_section_hash: payload.course_section_hash || quiz.course_section_hash,
        title: payload.title || quiz.title,
        description: payload.description || "",
        total_marks: payload.total_marks ?? quiz.total_marks,
      };
    });

    renderQuizzes();
    closeQuizModal();
    resetQuizForm();
    return;
  }

  const payload = {
    course_section_hash: quizSectionHashField.value.trim(),
    title: quizTitleInput.value.trim(),
    description: quizDescriptionInput.value.trim() || null,
    total_marks: quizTotalMarksInput.value ? Number(quizTotalMarksInput.value) : null,
  };

  if (!payload.course_section_hash || !payload.title) {
    alert("Course section hash and title are required.");
    return;
  }

  let quizHashFromApi = "";

  try {
    const data = await createQuizRequest(payload);
    quizHashFromApi = data.quiz_hash || "";
  } catch (error) {
    console.warn("create_quiz fallback mock used:", error.message);
  }

  currentQuizCourseSectionHash = payload.course_section_hash;
  selectedQuizCourseSectionLabel.textContent = `Selected course section: ${currentQuizCourseSectionHash}`;
  quizCourseSectionHashInput.value = currentQuizCourseSectionHash;
  localStorage.setItem("selected_course_section_hash", currentQuizCourseSectionHash);

  quizzesList.unshift({
    quiz_hash: quizHashFromApi || `quiz_${Date.now()}`,
    course_section_hash: payload.course_section_hash,
    title: payload.title,
    description: payload.description || "",
    total_marks: payload.total_marks ?? "",
  });

  renderQuizzes();
  closeQuizModal();
  resetQuizForm();
}

async function loadQuizResults(quizHash) {
  const courseSectionHash =
    currentQuizCourseSectionHash ||
    quizCourseSectionHashInput.value.trim() ||
    localStorage.getItem("selected_course_section_hash") ||
    "";

  if (!quizHash || !courseSectionHash) {
    alert("Quiz hash and course section hash are required.");
    return;
  }

  try {
    const data = await getQuizResultsRequest(quizHash, courseSectionHash);
    quizResultsList = Array.isArray(data) ? data : data.list || [];
  } catch (error) {
    console.warn("get_quiz_results fallback mock used:", error.message);
    seedMockQuizResults();
  }

  quizResultsModalTitle.textContent = `Quiz Results (${quizHash})`;
  renderQuizResults();
  openQuizResultsModal();
}

async function handleQuizzesGridClick(event) {
  const resultsBtn = event.target.closest(".view-results-btn");
  const editBtn = event.target.closest(".edit-quiz-btn");
  const deleteBtn = event.target.closest(".delete-quiz-btn");

  if (resultsBtn) {
    const quizHash = resultsBtn.dataset.quizHash;
    if (!quizHash) return;
    await loadQuizResults(quizHash);
    return;
  }

  if (editBtn) {
    const quizHash = editBtn.dataset.quizHash;
    const quiz = quizzesList.find((item) => item.quiz_hash === quizHash);
    if (!quiz) return;

    fillQuizForm(quiz);
    openQuizModal();
    return;
  }

  if (deleteBtn) {
    const quizHash = deleteBtn.dataset.quizHash;
    if (!quizHash) return;

    const confirmed = confirm("Are you sure you want to delete this quiz?");
    if (!confirmed) return;

    try {
      await deleteQuizRequest(
        quizHash,
        currentQuizCourseSectionHash || quizCourseSectionHashInput.value.trim()
      );
    } catch (error) {
      console.warn("delete_quiz fallback mock used:", error.message);
    }

    quizzesList = quizzesList.filter((quiz) => quiz.quiz_hash !== quizHash);
    renderQuizzes();
  }
}

function initSelectedQuizCourseSection() {
  const savedCourseSectionHash =
    localStorage.getItem("selected_course_section_hash") ||
    localStorage.getItem("selected_section") ||
    "";

  if (savedCourseSectionHash) {
    currentQuizCourseSectionHash = savedCourseSectionHash;
    quizCourseSectionHashInput.value = savedCourseSectionHash;
    quizSectionHashField.value = savedCourseSectionHash;
    selectedQuizCourseSectionLabel.textContent = `Selected course section: ${savedCourseSectionHash}`;
  }
}

function bindQuizEvents() {
  if (openCreateQuizModalBtn) {
    openCreateQuizModalBtn.addEventListener("click", () => {
      resetQuizForm();
      openQuizModal();
    });
  }

  if (closeQuizModalBtn) {
    closeQuizModalBtn.addEventListener("click", () => {
      closeQuizModal();
      resetQuizForm();
    });
  }

  if (cancelQuizModalBtn) {
    cancelQuizModalBtn.addEventListener("click", () => {
      closeQuizModal();
      resetQuizForm();
    });
  }

  if (quizModalBackdrop) {
    quizModalBackdrop.addEventListener("click", () => {
      closeQuizModal();
      resetQuizForm();
    });
  }

  if (quizForm) {
    quizForm.addEventListener("submit", handleQuizFormSubmit);
  }

  if (quizzesGrid) {
    quizzesGrid.addEventListener("click", handleQuizzesGridClick);
  }

  if (closeQuizResultsModalBtn) {
    closeQuizResultsModalBtn.addEventListener("click", closeQuizResultsModal);
  }

  if (quizResultsModalBackdrop) {
    quizResultsModalBackdrop.addEventListener("click", closeQuizResultsModal);
  }

  if (quizCourseSectionHashInput) {
    quizCourseSectionHashInput.addEventListener("input", (event) => {
      currentQuizCourseSectionHash = event.target.value.trim();
      selectedQuizCourseSectionLabel.textContent = `Selected course section: ${
        currentQuizCourseSectionHash || "Unknown"
      }`;
      renderQuizzes();
    });
  }
}

function initQuizzesPage() {
  initSelectedQuizCourseSection();
  bindQuizEvents();
  seedMockQuizzes();
}

document.addEventListener("DOMContentLoaded", initQuizzesPage);