// renderLevels
// fetchLevels
// filterLevels

const coursesTableBody = document.getElementById("coursesTableBody");
const courseSearch = document.getElementById("courseSearch");
const refreshCoursesBtn = document.getElementById("refreshCoursesBtn");
const addCourseBtn = document.getElementById("addCourseBtn");

const courseViewModal = document.getElementById("courseViewModal");
const closeCourseModalBtn = document.getElementById("closeCourseModalBtn");
const courseModalBackdrop = document.getElementById("courseModalBackdrop");

const detailCourseHash = document.getElementById("detailCourseHash");
const detailCourseCode = document.getElementById("detailCourseCode");
const detailCourseTitle = document.getElementById("detailCourseTitle");
const detailCourseDescription = document.getElementById("detailCourseDescription");
const detailCourseCredits = document.getElementById("detailCourseCredits");
const detailCourseCreatedAt = document.getElementById("detailCourseCreatedAt");
const detailCourseUpdatedAt = document.getElementById("detailCourseUpdatedAt");

const addCourseModal = document.getElementById("addCourseModal");
const addCourseBackdrop = document.getElementById("addCourseBackdrop");
const closeAddCourseBtn = document.getElementById("closeAddCourseBtn");
const cancelAddCourse = document.getElementById("cancelAddCourse");
const addCourseForm = document.getElementById("addCourseForm");

const courseFormTitle = document.getElementById("courseFormTitle");
const saveCourseBtn = document.getElementById("saveCourseBtn");

const newCourseHash = document.getElementById("newCourseHash");
const newCourseCode = document.getElementById("newCourseCode");
const newCourseTitle = document.getElementById("newCourseTitle");
const newCourseDescription = document.getElementById("newCourseDescription");
const newCourseCredits = document.getElementById("newCourseCredits");

let coursesData = [];
let editingCourseHash = null;

const mockCourses = [
  {
    course_hash: "CRS_001",
    code: "MATH101",
    title: "Mathematics",
    description: "Core mathematics course",
    credits: "3",
    created_at: "2026-03-01",
    updated_at: "2026-03-01"
  },
  {
    course_hash: "CRS_002",
    code: "PHY101",
    title: "Physics",
    description: "Introductory physics course",
    credits: "4",
    created_at: "2026-03-02",
    updated_at: "2026-03-02"
  }
];

function renderCourses(data) {
  if (!coursesTableBody) return;

  if (!data || data.length === 0) {
    coursesTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="a-table-empty">No courses found.</td>
      </tr>
    `;
    return;
  }

  coursesTableBody.innerHTML = data.map((course) => `
    <tr>
      <td>${formatValue(course.course_hash)}</td>
      <td>${formatValue(course.code)}</td>
      <td>${formatValue(course.title)}</td>
      <td>${formatValue(course.credits)}</td>
      <td>${formatValue(course.created_at)}</td>
      <td>${formatValue(course.updated_at)}</td>
      <td>
        <div class="a-table-actions">
          <button class="a-action-btn" onclick="viewCourse('${course.course_hash || ""}')">View</button>
          <button class="a-action-btn" onclick="editCourse('${course.course_hash || ""}')">Edit</button>
          <button class="a-action-btn a-action-btn--danger" onclick="deleteCourse('${course.course_hash || ""}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function fetchCourses() {
  if (!coursesTableBody) return;

  coursesTableBody.innerHTML = `
    <tr>
      <td colspan="7" class="a-table-empty">Loading courses...</td>
    </tr>
  `;

  try {
    const token = typeof getToken === "function" ? getToken() : localStorage.getItem("token");
    const response = await apiRequest("/get_courses", "GET", null, token);

    if (Array.isArray(response) && response.length > 0) {
      coursesData = response.map((course) => ({
        course_hash: course.course_hash || "Unknown",
        code: course.code || "Unknown",
        title: course.title || "Unknown",
        description: course.description || "Unknown",
        credits: course.credits || "Unknown",
        created_at: course.created_at || "Unknown",
        updated_at: course.updated_at || "Unknown"
      }));
    } else {
      coursesData = mockCourses;
    }

    renderCourses(coursesData);
  } catch (error) {
    console.error("Error fetching courses:", error);
    coursesData = mockCourses;
    renderCourses(coursesData);
  }
}

function filterCourses() {
  if (!courseSearch) return;

  const query = courseSearch.value.trim().toLowerCase();

  const filtered = coursesData.filter((course) =>
    String(course.course_hash).toLowerCase().includes(query) ||
    String(course.code).toLowerCase().includes(query) ||
    String(course.title).toLowerCase().includes(query)
  );

  renderCourses(filtered);
}

function viewCourse(courseHash) {
  const course = coursesData.find((item) => item.course_hash === courseHash);
  if (!course || !courseViewModal) return;

  detailCourseHash.textContent = formatValue(course.course_hash);
  detailCourseCode.textContent = formatValue(course.code);
  detailCourseTitle.textContent = formatValue(course.title);
  detailCourseDescription.textContent = formatValue(course.description);
  detailCourseCredits.textContent = formatValue(course.credits);
  detailCourseCreatedAt.textContent = formatValue(course.created_at);
  detailCourseUpdatedAt.textContent = formatValue(course.updated_at);

  courseViewModal.classList.add("show");
}

function closeCourseModal() {
  if (!courseViewModal) return;
  courseViewModal.classList.remove("show");
}

function openAddCourseModal() {
  if (!addCourseModal) return;

  editingCourseHash = null;

  if (courseFormTitle) courseFormTitle.textContent = "Add Course";
  if (saveCourseBtn) saveCourseBtn.textContent = "Save Course";
  if (addCourseForm) addCourseForm.reset();

  if (newCourseHash) {
    newCourseHash.disabled = false;
  }

  addCourseModal.classList.add("show");
}

function closeAddCourseModal() {
  if (!addCourseModal) return;

  addCourseModal.classList.remove("show");
  editingCourseHash = null;

  if (addCourseForm) addCourseForm.reset();

  if (newCourseHash) {
    newCourseHash.disabled = false;
  }

  if (courseFormTitle) courseFormTitle.textContent = "Add Course";
  if (saveCourseBtn) saveCourseBtn.textContent = "Save Course";
}

function editCourse(courseHash) {
  const course = coursesData.find((item) => item.course_hash === courseHash);
  if (!course || !addCourseModal) return;

  editingCourseHash = courseHash;

  if (courseFormTitle) courseFormTitle.textContent = "Edit Course";
  if (saveCourseBtn) saveCourseBtn.textContent = "Update Course";

  newCourseHash.value = course.course_hash || "";
  newCourseCode.value = course.code || "";
  newCourseTitle.value = course.title || "";
  newCourseDescription.value = course.description || "";
  newCourseCredits.value = course.credits || "";

  if (newCourseHash) {
    newCourseHash.disabled = true;
  }

  addCourseModal.classList.add("show");
}

function deleteCourse(courseHash) {
  const confirmed = confirm(`Are you sure you want to delete course ${courseHash}?`);
  if (!confirmed) return;

  coursesData = coursesData.filter((course) => course.course_hash !== courseHash);
  renderCourses(coursesData);
}

if (coursesTableBody) {
  fetchCourses();

  if (courseSearch) courseSearch.addEventListener("input", filterCourses);
  if (refreshCoursesBtn) refreshCoursesBtn.addEventListener("click", fetchCourses);
  if (addCourseBtn) addCourseBtn.addEventListener("click", openAddCourseModal);

  if (closeCourseModalBtn) {
    closeCourseModalBtn.addEventListener("click", closeCourseModal);
  }

  if (courseModalBackdrop) {
    courseModalBackdrop.addEventListener("click", closeCourseModal);
  }

  if (closeAddCourseBtn) {
    closeAddCourseBtn.addEventListener("click", closeAddCourseModal);
  }

  if (cancelAddCourse) {
    cancelAddCourse.addEventListener("click", closeAddCourseModal);
  }

  if (addCourseBackdrop) {
    addCourseBackdrop.addEventListener("click", closeAddCourseModal);
  }

  if (addCourseForm) {
    addCourseForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const coursePayload = {
        course_hash: newCourseHash.value,
        code: newCourseCode.value,
        title: newCourseTitle.value,
        description: newCourseDescription.value || "Unknown",
        credits: newCourseCredits.value || "Unknown",
        updated_at: new Date().toISOString().split("T")[0]
      };

      if (editingCourseHash) {
        coursesData = coursesData.map((course) => {
          if (course.course_hash === editingCourseHash) {
            return {
              ...course,
              ...coursePayload
            };
          }
          return course;
        });
      } else {
        coursesData.push({
          ...coursePayload,
          created_at: new Date().toISOString().split("T")[0]
        });
      }

      renderCourses(coursesData);
      closeAddCourseModal();
    });
  }
}
