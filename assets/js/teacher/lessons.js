const openCreateLessonModalBtn = document.getElementById("openCreateLessonModalBtn");
const loadLessonsBtn = document.getElementById("loadLessonsBtn");
const courseSectionHashInput = document.getElementById("courseSectionHashInput");
const selectedCourseSectionLabel = document.getElementById("selectedCourseSectionLabel");
const lessonsGrid = document.getElementById("lessonsGrid");

const lessonModal = document.getElementById("lessonModal");
const lessonModalBackdrop = document.getElementById("lessonModalBackdrop");
const closeLessonModalBtn = document.getElementById("closeLessonModalBtn");
const cancelLessonModalBtn = document.getElementById("cancelLessonModalBtn");
const lessonModalTitle = document.getElementById("lessonModalTitle");

const lessonForm = document.getElementById("lessonForm");
const lessonHashInput = document.getElementById("lessonHashInput");
const lessonSectionHashInput = document.getElementById("lessonSectionHashInput");
const lessonTitleInput = document.getElementById("lessonTitleInput");
const lessonContentTextInput = document.getElementById("lessonContentTextInput");
const lessonContentUrlInput = document.getElementById("lessonContentUrlInput");

let lessonsList = [];
let currentCourseSectionHash = "";

function openLessonModal() {
  if (!lessonModal) return;
  lessonModal.classList.add("show");
}

function closeLessonModal() {
  if (!lessonModal) return;
  lessonModal.classList.remove("show");
}

function resetLessonForm() {
  if (!lessonForm) return;
  lessonForm.reset();
  lessonHashInput.value = "";
  lessonModalTitle.textContent = "Create Lesson";
  lessonSectionHashInput.value = currentCourseSectionHash || "";
}

function fillLessonForm(lesson) {
  lessonHashInput.value = lesson.lesson_hash || "";
  lessonSectionHashInput.value = lesson.section_hash || "";
  lessonTitleInput.value = lesson.title || "";
  lessonContentTextInput.value = lesson.content_text || "";
  lessonContentUrlInput.value = lesson.content_url || "";
  lessonModalTitle.textContent = "Update Lesson";
}

function renderLessons() {
  if (!lessonsGrid) return;

  if (!lessonsList.length) {
    lessonsGrid.innerHTML = `
      <article class="t-card t-card--empty">
        <div class="t-card__body">
          <div class="t-card__meta">No lessons</div>
          <h3 class="t-card__title">No lessons found</h3>
          <p class="t-muted">Enter a course section hash and load lessons.</p>
        </div>
      </article>
    `;
    return;
  }

  lessonsGrid.innerHTML = lessonsList.map((lesson) => {
    return `
      <article class="t-card">
        <div class="t-card__body">
          <div class="t-card__meta">${formatValue(lesson.created_at || "No date")}</div>
          <h3 class="t-card__title">${formatValue(lesson.title)}</h3>
          <p class="t-muted">${formatValue(lesson.content_text || "No content text")}</p>

          <div class="t-card__stats">
            <span>🔗 ${formatValue(lesson.content_url || "No URL")}</span>
          </div>

          <div class="t-card__actions">
            <button
              class="t-btn t-btn--small edit-lesson-btn"
              type="button"
              data-lesson-hash="${formatValue(lesson.lesson_hash)}"
            >
              Edit
            </button>

            <button
              class="t-btn t-btn--small t-btn--ghost delete-lesson-btn"
              type="button"
              data-lesson-hash="${formatValue(lesson.lesson_hash)}"
            >
              Delete
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function seedMockLessons() {
  lessonsList = [
    {
      lesson_hash: "lesson_001",
      section_hash: currentCourseSectionHash || "sec_math_a",
      title: "Introduction to Algebra",
      content_text: "Basic algebra concepts, variables, and simple expressions.",
      content_url: "https://example.com/algebra-intro",
      created_at: "2026-03-15 09:00:00",
      updated_at: "2026-03-15 09:00:00",
    },
    {
      lesson_hash: "lesson_002",
      section_hash: currentCourseSectionHash || "sec_math_a",
      title: "Linear Equations",
      content_text: "Solving one-variable equations with step-by-step examples.",
      content_url: "https://example.com/linear-equations",
      created_at: "2026-03-16 10:30:00",
      updated_at: "2026-03-17 08:15:00",
    },
    {
      lesson_hash: "lesson_003",
      section_hash: currentCourseSectionHash || "sec_math_a",
      title: "Word Problems",
      content_text: "Translate word problems into algebraic equations.",
      content_url: "",
      created_at: "2026-03-18 11:00:00",
      updated_at: "2026-03-18 11:00:00",
    },
  ];

  renderLessons();
}

async function loadLessons() {
  const courseSectionHash = courseSectionHashInput?.value.trim();

  if (!courseSectionHash) {
    alert("Course section hash is required.");
    return;
  }

  currentCourseSectionHash = courseSectionHash;

  try {
    const response = await fetch(`${getApiBaseUrl()}/get_lessons`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        course_section_hash: courseSectionHash,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to load lessons");
    }

    const data = await response.json();
    lessonsList = Array.isArray(data) ? data : data.list || [];

    selectedCourseSectionLabel.textContent = `Selected course section: ${courseSectionHash}`;
    localStorage.setItem("selected_course_section_hash", courseSectionHash);

    renderLessons();
  } catch (error) {
    console.warn("get_lessons fallback mock used:", error.message);

    selectedCourseSectionLabel.textContent = `Selected course section: ${courseSectionHash}`;
    localStorage.setItem("selected_course_section_hash", courseSectionHash);

    seedMockLessons();
    renderLessons();
  }
}

async function createLessonRequest(payload) {
  const response = await fetch(`${getApiBaseUrl()}/create_lesson`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create lesson");
  }

  return response.json();
}

async function updateLessonRequest(payload) {
  const response = await fetch(`${getApiBaseUrl()}/update_lesson`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update lesson");
  }

  return response.json();
}

async function deleteLessonRequest(lessonHash) {
  const response = await fetch(`${getApiBaseUrl()}/delete_lesson`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      lesson_hash: lessonHash,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete lesson");
  }

  return response.json();
}

async function handleLessonFormSubmit(event) {
  event.preventDefault();

  const lessonHash = lessonHashInput.value.trim();
  const isEdit = Boolean(lessonHash);

  if (isEdit) {
    const payload = {
      lesson_hash: lessonHash,
      title: lessonTitleInput.value.trim() || null,
      content_text: lessonContentTextInput.value.trim() || null,
      content_url: lessonContentUrlInput.value.trim() || null,
    };

    try {
      await updateLessonRequest(payload);
    } catch (error) {
      console.warn("update_lesson fallback mock used:", error.message);
    }

    lessonsList = lessonsList.map((lesson) => {
      if (lesson.lesson_hash !== lessonHash) return lesson;

      return {
        ...lesson,
        title: payload.title || lesson.title,
        content_text: payload.content_text || "",
        content_url: payload.content_url || "",
        updated_at: new Date().toISOString(),
      };
    });

    renderLessons();
    closeLessonModal();
    resetLessonForm();
    return;
  }

  const payload = {
    section_hash: lessonSectionHashInput.value.trim(),
    title: lessonTitleInput.value.trim(),
    content_text: lessonContentTextInput.value.trim() || null,
    content_url: lessonContentUrlInput.value.trim() || null,
  };

  if (!payload.section_hash || !payload.title) {
    alert("Section hash and title are required.");
    return;
  }

  let lessonHashFromApi = "";

  try {
    const data = await createLessonRequest(payload);
    lessonHashFromApi = data.lesson_hash || "";
  } catch (error) {
    console.warn("create_lesson fallback mock used:", error.message);
  }

  lessonsList.unshift({
    lesson_hash: lessonHashFromApi || `lesson_${Date.now()}`,
    section_hash: payload.section_hash,
    title: payload.title,
    content_text: payload.content_text || "",
    content_url: payload.content_url || "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  renderLessons();
  closeLessonModal();
  resetLessonForm();
}

async function handleLessonsGridClick(event) {
  const editBtn = event.target.closest(".edit-lesson-btn");
  const deleteBtn = event.target.closest(".delete-lesson-btn");

  if (editBtn) {
    const lessonHash = editBtn.dataset.lessonHash;
    const lesson = lessonsList.find((item) => item.lesson_hash === lessonHash);
    if (!lesson) return;

    fillLessonForm(lesson);
    openLessonModal();
    return;
  }

  if (deleteBtn) {
    const lessonHash = deleteBtn.dataset.lessonHash;
    if (!lessonHash) return;

    const confirmed = confirm("Are you sure you want to delete this lesson?");
    if (!confirmed) return;

    try {
      await deleteLessonRequest(lessonHash);
    } catch (error) {
      console.warn("delete_lesson fallback mock used:", error.message);
    }

    lessonsList = lessonsList.filter((lesson) => lesson.lesson_hash !== lessonHash);
    renderLessons();
  }
}

function initSelectedCourseSection() {
  const savedCourseSectionHash =
    localStorage.getItem("selected_course_section_hash") ||
    localStorage.getItem("selected_section") ||
    "";

  if (savedCourseSectionHash) {
    currentCourseSectionHash = savedCourseSectionHash;
    courseSectionHashInput.value = savedCourseSectionHash;
    lessonSectionHashInput.value = savedCourseSectionHash;
    selectedCourseSectionLabel.textContent = `Selected course section: ${savedCourseSectionHash}`;
  }
}

function bindLessonEvents() {
  if (openCreateLessonModalBtn) {
    openCreateLessonModalBtn.addEventListener("click", () => {
      resetLessonForm();
      openLessonModal();
    });
  }

  if (loadLessonsBtn) {
    loadLessonsBtn.addEventListener("click", loadLessons);
  }

  if (closeLessonModalBtn) {
    closeLessonModalBtn.addEventListener("click", () => {
      closeLessonModal();
      resetLessonForm();
    });
  }

  if (cancelLessonModalBtn) {
    cancelLessonModalBtn.addEventListener("click", () => {
      closeLessonModal();
      resetLessonForm();
    });
  }

  if (lessonModalBackdrop) {
    lessonModalBackdrop.addEventListener("click", () => {
      closeLessonModal();
      resetLessonForm();
    });
  }

  if (lessonForm) {
    lessonForm.addEventListener("submit", handleLessonFormSubmit);
  }

  if (lessonsGrid) {
    lessonsGrid.addEventListener("click", handleLessonsGridClick);
  }
}

function initLessonsPage() {
  initSelectedCourseSection();
  bindLessonEvents();
  seedMockLessons();
}

document.addEventListener("DOMContentLoaded", initLessonsPage);