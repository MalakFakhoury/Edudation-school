const studentHashInput = document.getElementById("studentHashInput");
const loadStudentProgressBtn = document.getElementById("loadStudentProgressBtn");
const studentProgressGrid = document.getElementById("studentProgressGrid");

const assignmentHashStatsInput = document.getElementById("assignmentHashStatsInput");
const assignmentCourseSectionHashStatsInput = document.getElementById("assignmentCourseSectionHashStatsInput");
const loadAssignmentStatsBtn = document.getElementById("loadAssignmentStatsBtn");
const assignmentStatsGrid = document.getElementById("assignmentStatsGrid");

const quizHashInput = document.getElementById("quizHashInput");
const loadQuizAnalysisBtn = document.getElementById("loadQuizAnalysisBtn");
const quizAnalysisGrid = document.getElementById("quizAnalysisGrid");

function renderStudentProgress(progress) {
  if (!studentProgressGrid) return;

  studentProgressGrid.innerHTML = `
    <article class="t-card">
      <div class="t-card__body">
        <div class="t-card__meta">Attendance Summary</div>
        <h3 class="t-card__title">Student Progress</h3>
        <div class="t-card__stats">
          <span>✅ Present: ${formatValue(progress.present)}</span>
          <span>❌ Absent: ${formatValue(progress.absent)}</span>
          <span>⏰ Late: ${formatValue(progress.late)}</span>
          <span>🟡 Excused: ${formatValue(progress.excused)}</span>
          <span>➗ Partial: ${formatValue(progress.partial)}</span>
        </div>
      </div>
    </article>
  `;
}

function renderAssignmentStats(data) {
  if (!assignmentStatsGrid) return;

  const assignment = data.assignment || {};
  const stats = data.stats || {};

  assignmentStatsGrid.innerHTML = `
    <article class="t-card">
      <div class="t-card__body">
        <div class="t-card__meta">Assignment</div>
        <h3 class="t-card__title">${formatValue(assignment.title)}</h3>
        <p class="t-muted">Hash: ${formatValue(assignment.assignment_hash)}</p>
        <p class="t-muted">Section: ${formatValue(assignment.section_hash)}</p>
        <p class="t-muted">Due Date: ${formatValue(assignment.due_date)}</p>
        <p class="t-muted">Created At: ${formatValue(assignment.created_at)}</p>
      </div>
    </article>

    <article class="t-card">
      <div class="t-card__body">
        <div class="t-card__meta">Statistics</div>
        <h3 class="t-card__title">Assignment Stats</h3>
        <div class="t-card__stats">
          <span>📨 Submissions: ${formatValue(stats.submissions_count)}</span>
          <span>⏱️ On Time: ${formatValue(stats.on_time_count)}</span>
          <span>📊 Avg Grade: ${formatValue(stats.avg_grade)}</span>
          <span>📉 Min Grade: ${formatValue(stats.min_grade)}</span>
          <span>📈 Max Grade: ${formatValue(stats.max_grade)}</span>
        </div>
      </div>
    </article>
  `;
}

function renderQuizAnalysis(data) {
  if (!quizAnalysisGrid) return;

  const quiz = data.quiz || {};
  const stats = data.stats || {};
  const distribution = data.distribution || {};

  quizAnalysisGrid.innerHTML = `
    <article class="t-card">
      <div class="t-card__body">
        <div class="t-card__meta">Quiz</div>
        <h3 class="t-card__title">${formatValue(quiz.title)}</h3>
        <p class="t-muted">Hash: ${formatValue(quiz.quiz_hash)}</p>
        <p class="t-muted">Section: ${formatValue(quiz.section_hash)}</p>
        <p class="t-muted">Total Marks: ${formatValue(quiz.total_marks)}</p>
        <p class="t-muted">Created At: ${formatValue(quiz.created_at)}</p>
      </div>
    </article>

    <article class="t-card">
      <div class="t-card__body">
        <div class="t-card__meta">Statistics</div>
        <h3 class="t-card__title">Quiz Stats</h3>
        <div class="t-card__stats">
          <span>📨 Submissions: ${formatValue(stats.submissions_count)}</span>
          <span>👥 Unique Students: ${formatValue(stats.unique_students)}</span>
          <span>📊 Avg Score: ${formatValue(stats.avg_score)}</span>
          <span>📉 Min Score: ${formatValue(stats.min_score)}</span>
          <span>📈 Max Score: ${formatValue(stats.max_score)}</span>
        </div>
      </div>
    </article>

    <article class="t-card">
      <div class="t-card__body">
        <div class="t-card__meta">Distribution</div>
        <h3 class="t-card__title">Score Ranges</h3>
        <div class="t-card__stats">
          <span>0 - 49: ${formatValue(distribution["0_49"])}</span>
          <span>50 - 59: ${formatValue(distribution["50_59"])}</span>
          <span>60 - 69: ${formatValue(distribution["60_69"])}</span>
          <span>70 - 79: ${formatValue(distribution["70_79"])}</span>
          <span>80 - 89: ${formatValue(distribution["80_89"])}</span>
          <span>90 - 100: ${formatValue(distribution["90_100"])}</span>
        </div>
      </div>
    </article>
  `;
}

async function loadStudentProgress() {
  const studentHash = studentHashInput?.value.trim();

  if (!studentHash) {
    alert("Student hash is required.");
    return;
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/get_student_progress`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        student_hash: studentHash,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to load student progress");
    }

    const data = await response.json();
    const item = Array.isArray(data) ? data[0] : data.list?.[0] || data;

    renderStudentProgress(item || {});
  } catch (error) {
    console.warn("get_student_progress fallback mock used:", error.message);

    renderStudentProgress({
      present: 18,
      absent: 2,
      late: 3,
      excused: 1,
      partial: 0,
    });
  }
}

async function loadAssignmentStats() {
  const assignmentHash = assignmentHashStatsInput?.value.trim();
  const courseSectionHash = assignmentCourseSectionHashStatsInput?.value.trim();

  if (!assignmentHash || !courseSectionHash) {
    alert("Assignment hash and course section hash are required.");
    return;
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/get_assignment_stats`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        assignment_hash: assignmentHash,
        course_section_hash: courseSectionHash,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to load assignment stats");
    }

    const data = await response.json();
    const item = Array.isArray(data) ? data[0] : data.list?.[0] || data;

    renderAssignmentStats(item || {});
  } catch (error) {
    console.warn("get_assignment_stats fallback mock used:", error.message);

    renderAssignmentStats({
      assignment: {
        assignment_hash: assignmentHash,
        section_hash: courseSectionHash,
        title: "Homework 1",
        due_date: "2026-03-25",
        created_at: "2026-03-19 09:00:00",
      },
      stats: {
        submissions_count: 22,
        on_time_count: 18,
        avg_grade: 16,
        min_grade: 9,
        max_grade: 20,
      },
    });
  }
}

async function loadQuizAnalysis() {
  const quizHash = quizHashInput?.value.trim();

  if (!quizHash) {
    alert("Quiz hash is required.");
    return;
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/get_quiz_analysis`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        quiz_hash: quizHash,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to load quiz analysis");
    }

    const data = await response.json();
    renderQuizAnalysis(data || {});
  } catch (error) {
    console.warn("get_quiz_analysis fallback mock used:", error.message);

    renderQuizAnalysis({
      quiz: {
        quiz_hash: quizHash,
        section_hash: "sec_math_a",
        title: "Quiz 1 - Algebra",
        total_marks: "20",
        created_at: "2026-03-19 10:00:00",
      },
      stats: {
        submissions_count: 20,
        unique_students: 20,
        avg_score: 15.4,
        min_score: 7,
        max_score: 20,
      },
      distribution: {
        "0_49": 1,
        "50_59": 2,
        "60_69": 3,
        "70_79": 5,
        "80_89": 6,
        "90_100": 3,
      },
    });
  }
}

function bindAnalyticsEvents() {
  if (loadStudentProgressBtn) {
    loadStudentProgressBtn.addEventListener("click", loadStudentProgress);
  }

  if (loadAssignmentStatsBtn) {
    loadAssignmentStatsBtn.addEventListener("click", loadAssignmentStats);
  }

  if (loadQuizAnalysisBtn) {
    loadQuizAnalysisBtn.addEventListener("click", loadQuizAnalysis);
  }
}

function initAnalyticsPage() {
  bindAnalyticsEvents();
}

document.addEventListener("DOMContentLoaded", initAnalyticsPage);