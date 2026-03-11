// renderClasses
// fetchClasses
// filterClasses

const termsTableBody = document.getElementById("termsTableBody");
const termSearch = document.getElementById("termSearch");
const refreshTermsBtn = document.getElementById("refreshTermsBtn");
const addTermBtn = document.getElementById("addTermBtn");

const termViewModal = document.getElementById("termViewModal");
const closeTermModalBtn = document.getElementById("closeTermModalBtn");
const termModalBackdrop = document.getElementById("termModalBackdrop");

const detailTermHash = document.getElementById("detailTermHash");
const detailTermName = document.getElementById("detailTermName");
const detailTermStartDate = document.getElementById("detailTermStartDate");
const detailTermEndDate = document.getElementById("detailTermEndDate");
const detailTermCreatedAt = document.getElementById("detailTermCreatedAt");

const addTermModal = document.getElementById("addTermModal");
const addTermBackdrop = document.getElementById("addTermBackdrop");
const closeAddTermBtn = document.getElementById("closeAddTermBtn");
const cancelAddTerm = document.getElementById("cancelAddTerm");
const addTermForm = document.getElementById("addTermForm");

const termFormTitle = document.getElementById("termFormTitle");
const saveTermBtn = document.getElementById("saveTermBtn");

const newTermHash = document.getElementById("newTermHash");
const newTermName = document.getElementById("newTermName");
const newTermStartDate = document.getElementById("newTermStartDate");
const newTermEndDate = document.getElementById("newTermEndDate");

let termsData = [];
let editingTermHash = null;

const mockTerms = [
  {
    term_hash: "TERM_001",
    name: "Fall 2026",
    start_date: "2026-09-01",
    end_date: "2026-12-20",
    created_at: "2026-03-01"
  },
  {
    term_hash: "TERM_002",
    name: "Spring 2027",
    start_date: "2027-01-10",
    end_date: "2027-05-25",
    created_at: "2026-03-02"
  }
];

function renderTerms(data) {
  if (!termsTableBody) return;

  if (!data || data.length === 0) {
    termsTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="a-table-empty">No terms found.</td>
      </tr>
    `;
    return;
  }

  termsTableBody.innerHTML = data.map((term) => `
    <tr>
      <td>${formatValue(term.term_hash)}</td>
      <td>${formatValue(term.name)}</td>
      <td>${formatValue(term.start_date)}</td>
      <td>${formatValue(term.end_date)}</td>
      <td>${formatValue(term.created_at)}</td>
      <td>
        <div class="a-table-actions">
          <button class="a-action-btn" onclick="viewTerm('${term.term_hash || ""}')">View</button>
          <button class="a-action-btn" onclick="editTerm('${term.term_hash || ""}')">Edit</button>
          <button class="a-action-btn a-action-btn--danger" onclick="deleteTerm('${term.term_hash || ""}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function fetchTerms() {
  if (!termsTableBody) return;

  termsTableBody.innerHTML = `
    <tr>
      <td colspan="6" class="a-table-empty">Loading terms...</td>
    </tr>
  `;

  try {
    const token = typeof getToken === "function" ? getToken() : localStorage.getItem("token");
    const response = await apiRequest("/get_terms", "GET", null, token);

    if (Array.isArray(response) && response.length > 0) {
      termsData = response.map((term) => ({
        term_hash: term.term_hash || "Unknown",
        name: term.name || "Unknown",
        start_date: term.start_date || "Unknown",
        end_date: term.end_date || "Unknown",
        created_at: term.created_at || "Unknown"
      }));
    } else {
      termsData = mockTerms;
    }

    renderTerms(termsData);
  } catch (error) {
    console.error("Error fetching terms:", error);
    termsData = mockTerms;
    renderTerms(termsData);
  }
}

function filterTerms() {
  if (!termSearch) return;

  const query = termSearch.value.trim().toLowerCase();

  const filtered = termsData.filter((term) =>
    String(term.term_hash).toLowerCase().includes(query) ||
    String(term.name).toLowerCase().includes(query)
  );

  renderTerms(filtered);
}

function viewTerm(termHash) {
  const term = termsData.find((item) => item.term_hash === termHash);
  if (!term || !termViewModal) return;

  detailTermHash.textContent = formatValue(term.term_hash);
  detailTermName.textContent = formatValue(term.name);
  detailTermStartDate.textContent = formatValue(term.start_date);
  detailTermEndDate.textContent = formatValue(term.end_date);
  detailTermCreatedAt.textContent = formatValue(term.created_at);

  termViewModal.classList.add("show");
}

function closeTermModal() {
  if (!termViewModal) return;
  termViewModal.classList.remove("show");
}

function openAddTermModal() {
  if (!addTermModal) return;

  editingTermHash = null;

  if (termFormTitle) termFormTitle.textContent = "Add Term";
  if (saveTermBtn) saveTermBtn.textContent = "Save Term";
  if (addTermForm) addTermForm.reset();

  if (newTermHash) {
    newTermHash.disabled = false;
  }

  addTermModal.classList.add("show");
}

function closeAddTermModal() {
  if (!addTermModal) return;

  addTermModal.classList.remove("show");
  editingTermHash = null;

  if (addTermForm) addTermForm.reset();

  if (newTermHash) {
    newTermHash.disabled = false;
  }

  if (termFormTitle) termFormTitle.textContent = "Add Term";
  if (saveTermBtn) saveTermBtn.textContent = "Save Term";
}

function editTerm(termHash) {
  const term = termsData.find((item) => item.term_hash === termHash);
  if (!term || !addTermModal) return;

  editingTermHash = termHash;

  if (termFormTitle) termFormTitle.textContent = "Edit Term";
  if (saveTermBtn) saveTermBtn.textContent = "Update Term";

  newTermHash.value = term.term_hash || "";
  newTermName.value = term.name || "";
  newTermStartDate.value = term.start_date || "";
  newTermEndDate.value = term.end_date || "";

  if (newTermHash) {
    newTermHash.disabled = true;
  }

  addTermModal.classList.add("show");
}

function deleteTerm(termHash) {
  const confirmed = confirm(`Are you sure you want to delete term ${termHash}?`);
  if (!confirmed) return;

  termsData = termsData.filter((term) => term.term_hash !== termHash);
  renderTerms(termsData);
}

if (termsTableBody) {
  fetchTerms();

  if (termSearch) termSearch.addEventListener("input", filterTerms);
  if (refreshTermsBtn) refreshTermsBtn.addEventListener("click", fetchTerms);
  if (addTermBtn) addTermBtn.addEventListener("click", openAddTermModal);

  if (closeTermModalBtn) {
    closeTermModalBtn.addEventListener("click", closeTermModal);
  }

  if (termModalBackdrop) {
    termModalBackdrop.addEventListener("click", closeTermModal);
  }

  if (closeAddTermBtn) {
    closeAddTermBtn.addEventListener("click", closeAddTermModal);
  }

  if (cancelAddTerm) {
    cancelAddTerm.addEventListener("click", closeAddTermModal);
  }

  if (addTermBackdrop) {
    addTermBackdrop.addEventListener("click", closeAddTermModal);
  }

  if (addTermForm) {
    addTermForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const termPayload = {
        term_hash: newTermHash.value,
        name: newTermName.value,
        start_date: newTermStartDate.value || "Unknown",
        end_date: newTermEndDate.value || "Unknown"
      };

      if (editingTermHash) {
        termsData = termsData.map((term) => {
          if (term.term_hash === editingTermHash) {
            return {
              ...term,
              ...termPayload
            };
          }
          return term;
        });
      } else {
        termsData.push({
          ...termPayload,
          created_at: new Date().toISOString().split("T")[0]
        });
      }

      renderTerms(termsData);
      closeAddTermModal();
    });
  }
}
