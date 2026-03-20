const openCreateResourceModalBtn = document.getElementById("openCreateResourceModalBtn");
const resourceCourseSectionHashInput = document.getElementById("resourceCourseSectionHashInput");
const selectedResourceCourseSectionLabel = document.getElementById("selectedResourceCourseSectionLabel");
const resourcesGrid = document.getElementById("resourcesGrid");

const resourceModal = document.getElementById("resourceModal");
const resourceModalBackdrop = document.getElementById("resourceModalBackdrop");
const closeResourceModalBtn = document.getElementById("closeResourceModalBtn");
const cancelResourceModalBtn = document.getElementById("cancelResourceModalBtn");

const resourceForm = document.getElementById("resourceForm");
const resourceTitleInput = document.getElementById("resourceTitleInput");
const resourceFileUrlInput = document.getElementById("resourceFileUrlInput");
const resourceSectionHashField = document.getElementById("resourceSectionHashField");

let resourcesList = [];
let currentResourceCourseSectionHash = "";

function openResourceModal() {
  if (!resourceModal) return;
  resourceModal.classList.add("show");
}

function closeResourceModal() {
  if (!resourceModal) return;
  resourceModal.classList.remove("show");
}

function resetResourceForm() {
  if (!resourceForm) return;
  resourceForm.reset();
  resourceSectionHashField.value = currentResourceCourseSectionHash || "";
}

function renderResources() {
  if (!resourcesGrid) return;

  const filtered = currentResourceCourseSectionHash
    ? resourcesList.filter(
        (item) => item.course_section_hash === currentResourceCourseSectionHash
      )
    : resourcesList;

  if (!filtered.length) {
    resourcesGrid.innerHTML = `
      <article class="t-card t-card--empty">
        <div class="t-card__body">
          <div class="t-card__meta">No resources</div>
          <h3 class="t-card__title">No resources found</h3>
          <p class="t-muted">Create a resource to see it here.</p>
        </div>
      </article>
    `;
    return;
  }

  resourcesGrid.innerHTML = filtered
    .map((resource) => {
      return `
        <article class="t-card">
          <div class="t-card__body">
            <div class="t-card__meta">${formatValue(resource.course_section_hash)}</div>
            <h3 class="t-card__title">${formatValue(resource.title)}</h3>
            <p class="t-muted">${formatValue(resource.file_url)}</p>

            <div class="t-card__actions">
              <a
                class="t-btn t-btn--small"
                href="${resource.file_url}"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open
              </a>

              <button
                class="t-btn t-btn--small t-btn--ghost delete-resource-btn"
                type="button"
                data-resource-hash="${formatValue(resource.resource_hash)}"
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

function seedMockResources() {
  resourcesList = [
    {
      resource_hash: "resource_001",
      title: "Chapter 1 Notes",
      file_url: "https://example.com/files/chapter-1.pdf",
      course_section_hash: currentResourceCourseSectionHash || "sec_math_a",
    },
    {
      resource_hash: "resource_002",
      title: "Practice Worksheet",
      file_url: "https://example.com/files/worksheet.pdf",
      course_section_hash: currentResourceCourseSectionHash || "sec_math_a",
    },
  ];

  renderResources();
}

async function uploadResourceRequest(payload) {
  const response = await fetch(`${getApiBaseUrl()}/upload_course_resource`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to upload resource");
  }

  return response.json();
}

async function deleteResourceRequest(resourceHash) {
  const response = await fetch(`${getApiBaseUrl()}/delete_course_resource`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      resource_hash: resourceHash,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete resource");
  }

  return response.json();
}

async function handleResourceFormSubmit(event) {
  event.preventDefault();

  const payload = {
    title: resourceTitleInput.value.trim(),
    file_url: resourceFileUrlInput.value.trim(),
    course_section_hash: resourceSectionHashField.value.trim(),
  };

  if (!payload.title || !payload.file_url || !payload.course_section_hash) {
    alert("All fields are required.");
    return;
  }

  currentResourceCourseSectionHash = payload.course_section_hash;
  selectedResourceCourseSectionLabel.textContent = `Selected course section: ${currentResourceCourseSectionHash}`;
  resourceCourseSectionHashInput.value = currentResourceCourseSectionHash;
  localStorage.setItem("selected_course_section_hash", currentResourceCourseSectionHash);

  let resourceHash = "";

  try {
    const data = await uploadResourceRequest(payload);
    resourceHash = data.resource_hash || "";
  } catch (error) {
    console.warn("upload_course_resource fallback mock used:", error.message);
  }

  resourcesList.unshift({
    resource_hash: resourceHash || `resource_${Date.now()}`,
    title: payload.title,
    file_url: payload.file_url,
    course_section_hash: payload.course_section_hash,
  });

  renderResources();
  closeResourceModal();
  resetResourceForm();
}

async function handleResourcesGridClick(event) {
  const deleteBtn = event.target.closest(".delete-resource-btn");
  if (!deleteBtn) return;

  const resourceHash = deleteBtn.dataset.resourceHash;
  if (!resourceHash) return;

  const confirmed = confirm("Are you sure you want to delete this resource?");
  if (!confirmed) return;

  try {
    await deleteResourceRequest(resourceHash);
  } catch (error) {
    console.warn("delete_course_resource fallback mock used:", error.message);
  }

  resourcesList = resourcesList.filter((resource) => resource.resource_hash !== resourceHash);
  renderResources();
}

function initSelectedCourseSection() {
  const savedCourseSectionHash =
    localStorage.getItem("selected_course_section_hash") ||
    localStorage.getItem("selected_section") ||
    "";

  if (savedCourseSectionHash) {
    currentResourceCourseSectionHash = savedCourseSectionHash;
    resourceCourseSectionHashInput.value = savedCourseSectionHash;
    resourceSectionHashField.value = savedCourseSectionHash;
    selectedResourceCourseSectionLabel.textContent = `Selected course section: ${savedCourseSectionHash}`;
  }
}

function bindResourceEvents() {
  if (openCreateResourceModalBtn) {
    openCreateResourceModalBtn.addEventListener("click", () => {
      resetResourceForm();
      openResourceModal();
    });
  }

  if (closeResourceModalBtn) {
    closeResourceModalBtn.addEventListener("click", () => {
      closeResourceModal();
      resetResourceForm();
    });
  }

  if (cancelResourceModalBtn) {
    cancelResourceModalBtn.addEventListener("click", () => {
      closeResourceModal();
      resetResourceForm();
    });
  }

  if (resourceModalBackdrop) {
    resourceModalBackdrop.addEventListener("click", () => {
      closeResourceModal();
      resetResourceForm();
    });
  }

  if (resourceForm) {
    resourceForm.addEventListener("submit", handleResourceFormSubmit);
  }

  if (resourcesGrid) {
    resourcesGrid.addEventListener("click", handleResourcesGridClick);
  }

  if (resourceCourseSectionHashInput) {
    resourceCourseSectionHashInput.addEventListener("input", (event) => {
      currentResourceCourseSectionHash = event.target.value.trim();
      selectedResourceCourseSectionLabel.textContent = `Selected course section: ${
        currentResourceCourseSectionHash || "Unknown"
      }`;
      renderResources();
    });
  }
}

function initResourcesPage() {
  initSelectedCourseSection();
  bindResourceEvents();
  seedMockResources();
}

document.addEventListener("DOMContentLoaded", initResourcesPage);