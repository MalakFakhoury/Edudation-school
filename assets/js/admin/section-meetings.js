const meetingsTableBody = document.getElementById("meetingsTableBody");
const meetingSectionHashInput = document.getElementById("meetingSectionHashInput");
const loadMeetingsBtn = document.getElementById("loadMeetingsBtn");
const meetingSearch = document.getElementById("meetingSearch");
const refreshMeetingsBtn = document.getElementById("refreshMeetingsBtn");
const addMeetingBtn = document.getElementById("addMeetingBtn");

const meetingViewModal = document.getElementById("meetingViewModal");
const meetingBackdrop = document.getElementById("meetingBackdrop");
const closeMeetingModalBtn = document.getElementById("closeMeetingModalBtn");

const detailMeetingHash = document.getElementById("detailMeetingHash");
const detailMeetingDay = document.getElementById("detailMeetingDay");
const detailMeetingStart = document.getElementById("detailMeetingStart");
const detailMeetingEnd = document.getElementById("detailMeetingEnd");
const detailMeetingRoom = document.getElementById("detailMeetingRoom");
const detailMeetingCreatedAt = document.getElementById("detailMeetingCreatedAt");

const addMeetingModal = document.getElementById("addMeetingModal");
const addMeetingBackdrop = document.getElementById("addMeetingBackdrop");
const closeAddMeetingBtn = document.getElementById("closeAddMeetingBtn");
const cancelAddMeeting = document.getElementById("cancelAddMeeting");
const addMeetingForm = document.getElementById("addMeetingForm");

const meetingSectionHashField = document.getElementById("meetingSectionHashField");
const meetingDayInput = document.getElementById("meetingDayInput");
const meetingStartInput = document.getElementById("meetingStartInput");
const meetingEndInput = document.getElementById("meetingEndInput");
const meetingRoomInput = document.getElementById("meetingRoomInput");

let meetingsData = [];

const mockMeetings = [
  {
    meeting_hash: "MEET_001",
    day_of_week: "Monday",
    start_time: "08:00",
    end_time: "08:45",
    room: "A101",
    created_at: "2026-03-01"
  },
  {
    meeting_hash: "MEET_002",
    day_of_week: "Wednesday",
    start_time: "10:00",
    end_time: "10:45",
    room: "B203",
    created_at: "2026-03-02"
  }
];

function renderMeetings(data) {
  if (!meetingsTableBody) return;

  if (!data || data.length === 0) {
    meetingsTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="a-table-empty">No meetings found.</td>
      </tr>
    `;
    return;
  }

  meetingsTableBody.innerHTML = data.map((item) => `
    <tr>
      <td>${formatValue(item.meeting_hash)}</td>
      <td>${formatValue(item.day_of_week)}</td>
      <td>${formatValue(item.start_time)}</td>
      <td>${formatValue(item.end_time)}</td>
      <td>${formatValue(item.room)}</td>
      <td>${formatValue(item.created_at)}</td>
      <td>
        <div class="a-table-actions">
          <button class="a-action-btn" onclick="viewMeeting('${item.meeting_hash}')">View</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function fetchMeetings() {
  if (!meetingsTableBody) return;

  const sectionHash = meetingSectionHashInput ? meetingSectionHashInput.value.trim() : "";

  if (!sectionHash) {
    meetingsTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="a-table-empty">Please enter a section hash first.</td>
      </tr>
    `;
    return;
  }

  meetingsTableBody.innerHTML = `
    <tr>
      <td colspan="7" class="a-table-empty">Loading meetings...</td>
    </tr>
  `;

  try {
    const token = typeof getToken === "function" ? getToken() : localStorage.getItem("token");
    const response = await apiRequest(
      "/get_section_meetings",
      "POST",
      { course_section_hash: sectionHash },
      token
    );

    if (Array.isArray(response) && response.length > 0) {
      meetingsData = response.map((item) => ({
        meeting_hash: item.meeting_hash || "Unknown",
        day_of_week: item.day_of_week || "Unknown",
        start_time: item.start_time || "Unknown",
        end_time: item.end_time || "Unknown",
        room: item.room || "Unknown",
        created_at: item.created_at || "Unknown"
      }));
    } else {
      meetingsData = mockMeetings;
    }

    renderMeetings(meetingsData);
  } catch (error) {
    console.error("Error fetching meetings:", error);
    meetingsData = mockMeetings;
    renderMeetings(meetingsData);
  }
}

function filterMeetings() {
  if (!meetingSearch) return;

  const query = meetingSearch.value.trim().toLowerCase();

  const filtered = meetingsData.filter((item) =>
    String(item.meeting_hash).toLowerCase().includes(query) ||
    String(item.day_of_week).toLowerCase().includes(query) ||
    String(item.room).toLowerCase().includes(query)
  );

  renderMeetings(filtered);
}

function viewMeeting(meetingHash) {
  const item = meetingsData.find((entry) => entry.meeting_hash === meetingHash);
  if (!item || !meetingViewModal) return;

  detailMeetingHash.textContent = formatValue(item.meeting_hash);
  detailMeetingDay.textContent = formatValue(item.day_of_week);
  detailMeetingStart.textContent = formatValue(item.start_time);
  detailMeetingEnd.textContent = formatValue(item.end_time);
  detailMeetingRoom.textContent = formatValue(item.room);
  detailMeetingCreatedAt.textContent = formatValue(item.created_at);

  meetingViewModal.classList.add("show");
}

function closeMeetingModal() {
  if (!meetingViewModal) return;
  meetingViewModal.classList.remove("show");
}

function openAddMeetingModal() {
  if (!addMeetingModal) return;

  if (addMeetingForm) addMeetingForm.reset();
  if (meetingSectionHashField && meetingSectionHashInput) {
    meetingSectionHashField.value = meetingSectionHashInput.value.trim();
  }

  addMeetingModal.classList.add("show");
}

function closeAddMeetingModal() {
  if (!addMeetingModal) return;
  addMeetingModal.classList.remove("show");
  if (addMeetingForm) addMeetingForm.reset();
}

if (meetingsTableBody) {
  if (loadMeetingsBtn) loadMeetingsBtn.addEventListener("click", fetchMeetings);
  if (refreshMeetingsBtn) refreshMeetingsBtn.addEventListener("click", fetchMeetings);
  if (meetingSearch) meetingSearch.addEventListener("input", filterMeetings);
  if (addMeetingBtn) addMeetingBtn.addEventListener("click", openAddMeetingModal);

  if (closeMeetingModalBtn) closeMeetingModalBtn.addEventListener("click", closeMeetingModal);
  if (meetingBackdrop) meetingBackdrop.addEventListener("click", closeMeetingModal);

  if (closeAddMeetingBtn) closeAddMeetingBtn.addEventListener("click", closeAddMeetingModal);
  if (cancelAddMeeting) cancelAddMeeting.addEventListener("click", closeAddMeetingModal);
  if (addMeetingBackdrop) addMeetingBackdrop.addEventListener("click", closeAddMeetingModal);
}

if (addMeetingForm) {
  addMeetingForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const payload = {
      section_hash: meetingSectionHashField.value,
      day_of_week: Number(meetingDayInput.value),
      start_time: meetingStartInput.value,
      end_time: meetingEndInput.value,
      room: meetingRoomInput.value || null
    };

    try {
      const token = typeof getToken === "function" ? getToken() : localStorage.getItem("token");
      await apiRequest("/add_section_meeting", "POST", payload, token);

      alert("Meeting added");
      closeAddMeetingModal();
      fetchMeetings();
    } catch (error) {
      console.error("Error adding meeting:", error);
      alert("Failed to add meeting");
    }
  });
}