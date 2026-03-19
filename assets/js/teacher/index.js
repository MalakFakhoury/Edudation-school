const createBtn = document.getElementById("btnCreate");
const quickCreateBtn = document.getElementById("quickCreateBtn");
const tabButtons = document.querySelectorAll(".t-tab");

const termHashInput = document.getElementById("termHashInput");
const loadSectionsBtn = document.getElementById("loadSectionsBtn");
const sectionsGrid = document.querySelector(".t-grid");

let teacherSections = [];
let currentOrgType = "";

function renderTeacherSections() {
  if (!sectionsGrid) return;

  if (!teacherSections.length) {
    sectionsGrid.innerHTML = `
      <article class="t-card t-card--empty">
        <div class="t-card__body">
          <div class="t-card__meta">No sections</div>
          <h3 class="t-card__title">No sections found</h3>
          <p class="t-muted">Enter term hash and load your sections.</p>
          <button class="t-btn t-btn--small" type="button" id="quickCreateBtn">+ Create</button>
        </div>
      </article>
    `;

    const newQuickCreateBtn = document.getElementById("quickCreateBtn");
    if (newQuickCreateBtn) {
      newQuickCreateBtn.addEventListener("click", goToLessons);
    }

    return;
  }

  const cardsHtml = teacherSections
    .map((sectionName, index) => {
      return `
        <article class="t-card" data-section-name="${sectionName}">
          <div class="t-card__thumb"></div>
          <div class="t-card__body">
            <div class="t-card__meta">
              ${formatValue(currentOrgType)} • Section ${index + 1}
            </div>
            <h3 class="t-card__title">${formatValue(sectionName)}</h3>

            <div class="t-card__stats">
              <span>📘 Active Section</span>
              <span>🏫 ${formatValue(currentOrgType)}</span>
            </div>

            <div class="t-card__actions">
              <button class="t-btn t-btn--small open-section-btn" type="button">
                Open
              </button>
              <button class="t-btn t-btn--small t-btn--ghost students-section-btn" type="button">
                Students
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  const quickCardHtml = `
    <article class="t-card t-card--empty">
      <div class="t-card__body">
        <div class="t-card__meta">Quick action</div>
        <h3 class="t-card__title">Create a lesson / assignment</h3>
        <p class="t-muted">Start by selecting a section, then add activities.</p>
        <button class="t-btn t-btn--small" type="button" id="quickCreateBtn">+ Create</button>
      </div>
    </article>
  `;

  sectionsGrid.innerHTML = cardsHtml + quickCardHtml;

  bindRenderedSectionActions();

  const newQuickCreateBtn = document.getElementById("quickCreateBtn");
  if (newQuickCreateBtn) {
    newQuickCreateBtn.addEventListener("click", goToLessons);
  }
}

function bindRenderedSectionActions() {
  const openButtons = document.querySelectorAll(".open-section-btn");
  const studentButtons = document.querySelectorAll(".students-section-btn");

  openButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const card = this.closest(".t-card");
      const sectionName = card?.dataset.sectionName || "";
      openSection(sectionName);
    });
  });

  studentButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const card = this.closest(".t-card");
      const sectionName = card?.dataset.sectionName || "";
      goToStudents(sectionName);
    });
  });
}

function seedMockTeacherSections() {
  currentOrgType = "school";
  teacherSections = [
    "Math - Section A",
    "Physics - Section B",
    "Chemistry - Section C",
  ];
  renderTeacherSections();
}

function goToLessons() {
  window.location.href = "./lessons.html";
}

function goToStudents(sectionName) {
  localStorage.setItem("selected_section", sectionName || "");
  window.location.href = "./section-students.html";
}

function openSection(sectionName) {
  localStorage.setItem("selected_section", sectionName || "");
  window.location.href = "./lessons.html";
}

function handleTabClick(event) {
  tabButtons.forEach((t) => t.classList.remove("active"));
  event.currentTarget.classList.add("active");
}

async function loadTeacherSections() {
  const termHash = termHashInput?.value.trim();

  if (!termHash) {
    alert("Term hash is required.");
    return;
  }

  const payload = {
    term_hash: termHash,
  };

  try {
    const response = await fetch(`${getApiBaseUrl()}/my_sections`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to load teacher sections");
    }

    const data = await response.json();

    currentOrgType = data.org_type || "Unknown";
    teacherSections = Array.isArray(data.list) ? data.list : [];

    renderTeacherSections();
  } catch (error) {
    console.warn("my_sections mock fallback used:", error.message);
    seedMockTeacherSections();
    alert("API failed. Mock sections loaded.");
  }
}

function bindInitialEvents() {
  if (createBtn) {
    createBtn.addEventListener("click", goToLessons);
  }

  if (quickCreateBtn) {
    quickCreateBtn.addEventListener("click", goToLessons);
  }

  if (loadSectionsBtn) {
    loadSectionsBtn.addEventListener("click", loadTeacherSections);
  }

  tabButtons.forEach((tab) => {
    tab.addEventListener("click", handleTabClick);
  });

  const initialCardButtons = document.querySelectorAll(".t-card__actions .t-btn");

  initialCardButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const text = this.textContent.trim();
      const card = this.closest(".t-card");
      const title = card?.querySelector(".t-card__title")?.textContent?.trim() || "";

      if (text === "Open") {
        openSection(title);
        return;
      }

      if (text === "Students") {
        goToStudents(title);
      }
    });
  });
}

function initTeacherIndexPage() {
  bindInitialEvents();
}

document.addEventListener("DOMContentLoaded", initTeacherIndexPage);