const offeringsTableBody = document.getElementById("offeringsTableBody");
const offeringSearch = document.getElementById("offeringSearch");
const refreshOfferingsBtn = document.getElementById("refreshOfferingsBtn");
const addOfferingBtn = document.getElementById("addOfferingBtn");

const offeringViewModal = document.getElementById("offeringViewModal");
const offeringBackdrop = document.getElementById("offeringBackdrop");
const closeOfferingModalBtn = document.getElementById("closeOfferingModalBtn");

const detailOfferingHash = document.getElementById("detailOfferingHash");
const detailOfferingTermHash = document.getElementById("detailOfferingTermHash");
const detailOfferingCourseHash = document.getElementById("detailOfferingCourseHash");
const detailOfferingCourseCode = document.getElementById("detailOfferingCourseCode");
const detailOfferingTitle = document.getElementById("detailOfferingTitle");
const detailOfferingCredits = document.getElementById("detailOfferingCredits");
const detailOfferingStatus = document.getElementById("detailOfferingStatus");
const detailOfferingSectionsCount = document.getElementById("detailOfferingSectionsCount");
const detailOfferingCreatedAt = document.getElementById("detailOfferingCreatedAt");

const addOfferingModal = document.getElementById("addOfferingModal");
const addOfferingBackdrop = document.getElementById("addOfferingBackdrop");
const closeAddOfferingBtn = document.getElementById("closeAddOfferingBtn");
const cancelAddOffering = document.getElementById("cancelAddOffering");
const addOfferingForm = document.getElementById("addOfferingForm");

const offeringTermHashInput = document.getElementById("offeringTermHashInput");
const offeringCourseHashInput = document.getElementById("offeringCourseHashInput");
const offeringStatusInput = document.getElementById("offeringStatusInput");

let offeringsData = [];

const mockOfferings = [
  {
    offering_hash: "OFF_001",
    term_hash: "TERM_001",
    course_hash: "CRS_001",
    status: "active",
    created_at: "2026-03-01",
    course: {
      code: "MATH101",
      title: "Mathematics",
      credits: "3"
    },
    sections_count: 2
  },
  {
    offering_hash: "OFF_002",
    term_hash: "TERM_001",
    course_hash: "CRS_002",
    status: "active",
    created_at: "2026-03-02",
    course: {
      code: "PHY101",
      title: "Physics",
      credits: "4"
    },
    sections_count: 1
  }
];

function renderOfferings(data) {
  if (!offeringsTableBody) return;

  if (!data || data.length === 0) {
    offeringsTableBody.innerHTML = `
      <tr>
        <td colspan="10" class="a-table-empty">No offerings found.</td>
      </tr>
    `;
    return;
  }

  offeringsTableBody.innerHTML = data.map((item) => `
    <tr>
      <td>${formatValue(item.offering_hash)}</td>
      <td>${formatValue(item.term_hash)}</td>
      <td>${formatValue(item.course_hash)}</td>
      <td>${formatValue(item.course?.code)}</td>
      <td>${formatValue(item.course?.title)}</td>
      <td>${formatValue(item.course?.credits)}</td>
      <td>${formatValue(item.status)}</td>
      <td>${formatValue(item.sections_count)}</td>
      <td>${formatValue(item.created_at)}</td>
      <td>
        <div class="a-table-actions">
          <button class="a-action-btn" onclick="viewOffering('${item.offering_hash}')">View</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function fetchOfferings() {
  if (!offeringsTableBody) return;

  offeringsTableBody.innerHTML = `
    <tr>
      <td colspan="10" class="a-table-empty">Loading offerings...</td>
    </tr>
  `;

  try {
    const token = typeof getToken === "function" ? getToken() : localStorage.getItem("token");
    const response = await apiRequest("/get_course_offerings", "GET", null, token);

    if (Array.isArray(response) && response.length > 0) {
      offeringsData = response.map((item) => ({
        offering_hash: item.offering_hash || "Unknown",
        term_hash: item.term_hash || "Unknown",
        course_hash: item.course_hash || "Unknown",
        status: item.status || "Unknown",
        created_at: item.created_at || "Unknown",
        course: item.course || {},
        sections_count: item.sections_count ?? 0
      }));
    } else {
      offeringsData = mockOfferings;
    }

    renderOfferings(offeringsData);
  } catch (error) {
    console.error("Error fetching offerings:", error);
    offeringsData = mockOfferings;
    renderOfferings(offeringsData);
  }
}

function filterOfferings() {
  if (!offeringSearch) return;

  const query = offeringSearch.value.trim().toLowerCase();

  const filtered = offeringsData.filter((item) =>
    String(item.offering_hash).toLowerCase().includes(query) ||
    String(item.term_hash).toLowerCase().includes(query) ||
    String(item.course_hash).toLowerCase().includes(query) ||
    String(item.status).toLowerCase().includes(query) ||
    String(item.course?.code).toLowerCase().includes(query) ||
    String(item.course?.title).toLowerCase().includes(query)
  );

  renderOfferings(filtered);
}

function viewOffering(offeringHash) {
  const item = offeringsData.find((entry) => entry.offering_hash === offeringHash);
  if (!item || !offeringViewModal) return;

  detailOfferingHash.textContent = formatValue(item.offering_hash);
  detailOfferingTermHash.textContent = formatValue(item.term_hash);
  detailOfferingCourseHash.textContent = formatValue(item.course_hash);
  detailOfferingCourseCode.textContent = formatValue(item.course?.code);
  detailOfferingTitle.textContent = formatValue(item.course?.title);
  detailOfferingCredits.textContent = formatValue(item.course?.credits);
  detailOfferingStatus.textContent = formatValue(item.status);
  detailOfferingSectionsCount.textContent = formatValue(item.sections_count);
  detailOfferingCreatedAt.textContent = formatValue(item.created_at);

  offeringViewModal.classList.add("show");
}

function closeOfferingModal() {
  if (!offeringViewModal) return;
  offeringViewModal.classList.remove("show");
}

function openAddOfferingModal() {
  if (!addOfferingModal) return;
  if (addOfferingForm) addOfferingForm.reset();
  addOfferingModal.classList.add("show");
}

function closeAddOfferingModal() {
  if (!addOfferingModal) return;
  addOfferingModal.classList.remove("show");
  if (addOfferingForm) addOfferingForm.reset();
}

if (offeringsTableBody) {
  fetchOfferings();

  if (offeringSearch) offeringSearch.addEventListener("input", filterOfferings);
  if (refreshOfferingsBtn) refreshOfferingsBtn.addEventListener("click", fetchOfferings);
  if (addOfferingBtn) addOfferingBtn.addEventListener("click", openAddOfferingModal);

  if (closeOfferingModalBtn) closeOfferingModalBtn.addEventListener("click", closeOfferingModal);
  if (offeringBackdrop) offeringBackdrop.addEventListener("click", closeOfferingModal);

  if (closeAddOfferingBtn) closeAddOfferingBtn.addEventListener("click", closeAddOfferingModal);
  if (cancelAddOffering) cancelAddOffering.addEventListener("click", closeAddOfferingModal);
  if (addOfferingBackdrop) addOfferingBackdrop.addEventListener("click", closeAddOfferingModal);
}

if (addOfferingForm) {
  addOfferingForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const payload = {
      term_hash: offeringTermHashInput.value,
      course_hash: offeringCourseHashInput.value,
      status: offeringStatusInput.value || null
    };

    try {
      const token = typeof getToken === "function" ? getToken() : localStorage.getItem("token");
      await apiRequest("/create_course_offering", "POST", payload, token);

      alert("Offering created");
      closeAddOfferingModal();
      fetchOfferings();
    } catch (error) {
      console.error("Error creating offering:", error);
      alert("Failed to create offering");
    }
  });
}