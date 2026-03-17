const classAnnouncementsTableBody = document.getElementById("classAnnouncementsTableBody");
const classAnnouncementClassHashInput = document.getElementById("classAnnouncementClassHashInput");
const classAnnouncementHashInput = document.getElementById("classAnnouncementHashInput");
const loadClassAnnouncementBtn = document.getElementById("loadClassAnnouncementBtn");
const refreshClassAnnouncementsBtn = document.getElementById("refreshClassAnnouncementsBtn");
const classAnnouncementSearch = document.getElementById("classAnnouncementSearch");
const addClassAnnouncementBtn = document.getElementById("addClassAnnouncementBtn");

const classAnnouncementViewModal = document.getElementById("classAnnouncementViewModal");
const classAnnouncementBackdrop = document.getElementById("classAnnouncementBackdrop");
const closeClassAnnouncementModalBtn = document.getElementById("closeClassAnnouncementModalBtn");

const detailClassAnnouncementHash = document.getElementById("detailClassAnnouncementHash");
const detailClassAnnouncementClassHash = document.getElementById("detailClassAnnouncementClassHash");
const detailClassAnnouncementTitle = document.getElementById("detailClassAnnouncementTitle");
const detailClassAnnouncementCreatedByAdmin = document.getElementById("detailClassAnnouncementCreatedByAdmin");
const detailClassAnnouncementCreatedByTeacher = document.getElementById("detailClassAnnouncementCreatedByTeacher");
const detailClassAnnouncementCreatedAt = document.getElementById("detailClassAnnouncementCreatedAt");
const detailClassAnnouncementUpdatedAt = document.getElementById("detailClassAnnouncementUpdatedAt");
const detailClassAnnouncementExpiresAt = document.getElementById("detailClassAnnouncementExpiresAt");
const detailClassAnnouncementContent = document.getElementById("detailClassAnnouncementContent");

const addClassAnnouncementModal = document.getElementById("addClassAnnouncementModal");
const addClassAnnouncementBackdrop = document.getElementById("addClassAnnouncementBackdrop");
const closeAddClassAnnouncementBtn = document.getElementById("closeAddClassAnnouncementBtn");
const cancelAddClassAnnouncement = document.getElementById("cancelAddClassAnnouncement");
const addClassAnnouncementForm = document.getElementById("addClassAnnouncementForm");

const classAnnouncementCourseSectionHashInput = document.getElementById("classAnnouncementCourseSectionHashInput");
const classAnnouncementClassHashField = document.getElementById("classAnnouncementClassHashField");
const classAnnouncementSectionHashInput = document.getElementById("classAnnouncementSectionHashInput");
const classAnnouncementTitleInput = document.getElementById("classAnnouncementTitleInput");
const classAnnouncementContentInput = document.getElementById("classAnnouncementContentInput");
const classAnnouncementExpiresInput = document.getElementById("classAnnouncementExpiresInput");

let classAnnouncementsData = [];

const mockClassAnnouncements = [
  {
    announcement_hash: "CANN_001",
    class_hash: "CLS_001",
    title: "Exam Reminder",
    content: "Midterm exam starts next week.",
    created_by_admin: "ADM_001",
    created_by_teacher: "",
    created_at: "2026-03-01",
    updated_at: "2026-03-01",
    expires_at: "2026-03-10"
  }
];

function renderClassAnnouncements(data) {
  if (!classAnnouncementsTableBody) return;

  if (!data || data.length === 0) {
    classAnnouncementsTableBody.innerHTML = `
      <tr>
        <td colspan="8" class="a-table-empty">No class announcements found.</td>
      </tr>
    `;
    return;
  }

  classAnnouncementsTableBody.innerHTML = data.map((item) => `
    <tr>
      <td>${formatValue(item.announcement_hash)}</td>
      <td>${formatValue(item.class_hash)}</td>
      <td>${formatValue(item.title)}</td>
      <td>${formatValue(item.created_by_admin)}</td>
      <td>${formatValue(item.created_by_teacher)}</td>
      <td>${formatValue(item.created_at)}</td>
      <td>${formatValue(item.expires_at)}</td>
      <td>
        <div class="a-table-actions">
          <button class="a-action-btn" onclick="viewClassAnnouncement('${item.announcement_hash}')">View</button>
          <button class="a-action-btn a-action-btn--danger" onclick="deleteClassAnnouncement('${item.announcement_hash}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function fetchClassAnnouncements() {
  if (!classAnnouncementsTableBody) return;

  const classHash = classAnnouncementClassHashInput ? classAnnouncementClassHashInput.value.trim() : "";
  const announcementHash = classAnnouncementHashInput ? classAnnouncementHashInput.value.trim() : "";

  if (!classHash || !announcementHash) {
    classAnnouncementsTableBody.innerHTML = `
      <tr>
        <td colspan="8" class="a-table-empty">Please enter class hash and announcement hash first.</td>
      </tr>
    `;
    return;
  }

  classAnnouncementsTableBody.innerHTML = `
    <tr>
      <td colspan="8" class="a-table-empty">Loading class announcement...</td>
    </tr>
  `;

  try {
    const token = typeof getToken === "function" ? getToken() : localStorage.getItem("token");

    const response = await apiRequest(
      "/get_single_class_announcement",
      "POST",
      {
        class_hash: classHash,
        announcement_hash: announcementHash
      },
      token
    );

    if (Array.isArray(response) && response.length > 0) {
      classAnnouncementsData = response.map((item) => ({
        announcement_hash: item.announcement_hash || "Unknown",
        class_hash: item.class_hash || "Unknown",
        title: item.title || "Unknown",
        content: item.content || "Unknown",
        created_by_admin: item.created_by_admin || "Unknown",
        created_by_teacher: item.created_by_teacher || "Unknown",
        created_at: item.created_at || "Unknown",
        updated_at: item.updated_at || "Unknown",
        expires_at: item.expires_at || "Unknown"
      }));
    } else {
      classAnnouncementsData = mockClassAnnouncements;
    }

    renderClassAnnouncements(classAnnouncementsData);
  } catch (error) {
    console.error("Error fetching class announcement:", error);
    classAnnouncementsData = mockClassAnnouncements;
    renderClassAnnouncements(classAnnouncementsData);
  }
}

function filterClassAnnouncements() {
  if (!classAnnouncementSearch) return;

  const query = classAnnouncementSearch.value.trim().toLowerCase();

  const filtered = classAnnouncementsData.filter((item) =>
    String(item.title).toLowerCase().includes(query) ||
    String(item.content).toLowerCase().includes(query) ||
    String(item.announcement_hash).toLowerCase().includes(query)
  );

  renderClassAnnouncements(filtered);
}

function viewClassAnnouncement(announcementHash) {
  const item = classAnnouncementsData.find((entry) => entry.announcement_hash === announcementHash);
  if (!item || !classAnnouncementViewModal) return;

  detailClassAnnouncementHash.textContent = formatValue(item.announcement_hash);
  detailClassAnnouncementClassHash.textContent = formatValue(item.class_hash);
  detailClassAnnouncementTitle.textContent = formatValue(item.title);
  detailClassAnnouncementCreatedByAdmin.textContent = formatValue(item.created_by_admin);
  detailClassAnnouncementCreatedByTeacher.textContent = formatValue(item.created_by_teacher);
  detailClassAnnouncementCreatedAt.textContent = formatValue(item.created_at);
  detailClassAnnouncementUpdatedAt.textContent = formatValue(item.updated_at);
  detailClassAnnouncementExpiresAt.textContent = formatValue(item.expires_at);
  detailClassAnnouncementContent.textContent = formatValue(item.content);

  classAnnouncementViewModal.classList.add("show");
}

function closeClassAnnouncementModal() {
  if (!classAnnouncementViewModal) return;
  classAnnouncementViewModal.classList.remove("show");
}

function openAddClassAnnouncementModal() {
  if (!addClassAnnouncementModal) return;

  if (addClassAnnouncementForm) addClassAnnouncementForm.reset();

  if (classAnnouncementClassHashField && classAnnouncementClassHashInput) {
    classAnnouncementClassHashField.value = classAnnouncementClassHashInput.value.trim();
  }

  addClassAnnouncementModal.classList.add("show");
}

function closeAddClassAnnouncementModal() {
  if (!addClassAnnouncementModal) return;
  addClassAnnouncementModal.classList.remove("show");

  if (addClassAnnouncementForm) {
    addClassAnnouncementForm.reset();
  }
}

async function deleteClassAnnouncement(announcementHash) {
  const classHash = classAnnouncementClassHashInput ? classAnnouncementClassHashInput.value.trim() : "";

  if (!classHash) {
    alert("Please enter class hash first");
    return;
  }

  const confirmed = confirm("Delete this class announcement?");
  if (!confirmed) return;

  try {
    const token = typeof getToken === "function" ? getToken() : localStorage.getItem("token");

    await apiRequest(
      "/delete_class_annoucement",
      "POST",
      {
        class_hash: classHash,
        announcement_hash: announcementHash
      },
      token
    );

    alert("Announcement deleted");
    fetchClassAnnouncements();
  } catch (error) {
    console.error("Error deleting class announcement:", error);
    alert("Failed to delete announcement");
  }
}

if (classAnnouncementsTableBody) {
  if (loadClassAnnouncementBtn) loadClassAnnouncementBtn.addEventListener("click", fetchClassAnnouncements);
  if (refreshClassAnnouncementsBtn) refreshClassAnnouncementsBtn.addEventListener("click", fetchClassAnnouncements);
  if (classAnnouncementSearch) classAnnouncementSearch.addEventListener("input", filterClassAnnouncements);
  if (addClassAnnouncementBtn) addClassAnnouncementBtn.addEventListener("click", openAddClassAnnouncementModal);

  if (closeClassAnnouncementModalBtn) closeClassAnnouncementModalBtn.addEventListener("click", closeClassAnnouncementModal);
  if (classAnnouncementBackdrop) classAnnouncementBackdrop.addEventListener("click", closeClassAnnouncementModal);

  if (closeAddClassAnnouncementBtn) closeAddClassAnnouncementBtn.addEventListener("click", closeAddClassAnnouncementModal);
  if (cancelAddClassAnnouncement) cancelAddClassAnnouncement.addEventListener("click", closeAddClassAnnouncementModal);
  if (addClassAnnouncementBackdrop) addClassAnnouncementBackdrop.addEventListener("click", closeAddClassAnnouncementModal);
}

if (addClassAnnouncementForm) {
  addClassAnnouncementForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const payload = {
      course_section_hash: classAnnouncementCourseSectionHashInput.value,
      class_hash: classAnnouncementClassHashField.value,
      section_hash: classAnnouncementSectionHashInput.value,
      title: classAnnouncementTitleInput.value,
      content: classAnnouncementContentInput.value,
      expires_at: classAnnouncementExpiresInput.value || null
    };

    try {
      const token = typeof getToken === "function" ? getToken() : localStorage.getItem("token");
      await apiRequest("/create_class_annoucement", "POST", payload, token);

      alert("Class announcement created");
      closeAddClassAnnouncementModal();
      fetchClassAnnouncements();
    } catch (error) {
      console.error("Error creating class announcement:", error);
      alert("Failed to create announcement");
    }
  });
}