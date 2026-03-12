const announcementsTableBody = document.getElementById("announcementsTableBody")
const announcementSearch = document.getElementById("announcementSearch")
const refreshAnnouncementsBtn = document.getElementById("refreshAnnouncementsBtn")

const announcementViewModal = document.getElementById("announcementViewModal")
const announcementBackdrop = document.getElementById("announcementBackdrop")
const closeAnnouncementModalBtn = document.getElementById("closeAnnouncementModalBtn")

const addAnnouncementModal = document.getElementById("addAnnouncementModal")
const addAnnouncementBtn = document.getElementById("addAnnouncementBtn")
const addAnnouncementBackdrop = document.getElementById("addAnnouncementBackdrop")
const closeAddAnnouncementBtn = document.getElementById("closeAddAnnouncementBtn")
const cancelAddAnnouncement = document.getElementById("cancelAddAnnouncement")

const addAnnouncementForm = document.getElementById("addAnnouncementForm")

let announcementsData = []

const mockAnnouncements = [
{
announcement_hash:"ANN_001",
title:"School Closed",
content:"School will be closed tomorrow",
created_at:"2026-03-01",
expires_at:"2026-03-05"
},
{
announcement_hash:"ANN_002",
title:"Exam Week",
content:"Midterm exams start next Monday",
created_at:"2026-03-02",
expires_at:"2026-03-10"
}
]

function renderAnnouncements(data) {
  if (!announcementsTableBody) return;

  if (!data || data.length === 0) {
    announcementsTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="a-table-empty">No announcements found.</td>
      </tr>
    `;
    return;
  }

  announcementsTableBody.innerHTML = data.map((a) => `
    <tr>
      <td>${formatValue(a.announcement_hash)}</td>
      <td>${formatValue(a.title)}</td>
      <td>${formatValue(a.created_at)}</td>
      <td>${formatValue(a.expires_at)}</td>
      <td>
        <div class="a-table-actions">
          <button class="a-action-btn" onclick="viewAnnouncement('${a.announcement_hash}')">
            View
          </button>

          <button class="a-action-btn a-action-btn--danger" onclick="deleteAnnouncement('${a.announcement_hash}')">
            Delete
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function fetchAnnouncements(){

try{

const token=getToken()

const response=await apiRequest(
"/get_all_admin_announcements",
"GET",
null,
token
)

if(Array.isArray(response)){

announcementsData=response

}else{

announcementsData=mockAnnouncements

}

renderAnnouncements(announcementsData)

}catch(e){

announcementsData=mockAnnouncements
renderAnnouncements(announcementsData)

}

}

function viewAnnouncement(hash){

const item=announcementsData.find(
a=>a.announcement_hash===hash
)

if(!item) return

document.getElementById("detailAnnouncementTitle").textContent=item.title
document.getElementById("detailAnnouncementContent").textContent=item.content
document.getElementById("detailAnnouncementCreated").textContent=item.created_at
document.getElementById("detailAnnouncementExpires").textContent=item.expires_at

announcementViewModal.classList.add("show")

}

function closeAnnouncementModal(){

announcementViewModal.classList.remove("show")

}

function openAddAnnouncement(){

addAnnouncementModal.classList.add("show")

}

function closeAddAnnouncement(){

addAnnouncementModal.classList.remove("show")

}

async function deleteAnnouncement(hash){

if(!confirm("Delete announcement?")) return

try{

await apiRequest(
"/delete_admin_announcement",
"POST",
{announcement_hash:hash},
getToken()
)

fetchAnnouncements()

}catch(e){

console.error(e)

}

}

if(announcementsTableBody){

fetchAnnouncements()

}

if(addAnnouncementBtn){

addAnnouncementBtn.addEventListener(
"click",
openAddAnnouncement
)

}

if(closeAnnouncementModalBtn){

closeAnnouncementModalBtn.addEventListener(
"click",
closeAnnouncementModal
)

}

if(announcementBackdrop){

announcementBackdrop.addEventListener(
"click",
closeAnnouncementModal
)

}

if(closeAddAnnouncementBtn){

closeAddAnnouncementBtn.addEventListener(
"click",
closeAddAnnouncement
)

}

if(cancelAddAnnouncement){

cancelAddAnnouncement.addEventListener(
"click",
closeAddAnnouncement
)

}

if(addAnnouncementBackdrop){

addAnnouncementBackdrop.addEventListener(
"click",
closeAddAnnouncement
)

}

if(refreshAnnouncementsBtn){

refreshAnnouncementsBtn.addEventListener(
"click",
fetchAnnouncements
)

}

function filterAnnouncements() {
  if (!announcementSearch) return;

  const query = announcementSearch.value.trim().toLowerCase();

  const filtered = announcementsData.filter((item) =>
    String(item.announcement_hash).toLowerCase().includes(query) ||
    String(item.title).toLowerCase().includes(query) ||
    String(item.content).toLowerCase().includes(query)
  );

  renderAnnouncements(filtered);
}

if (announcementSearch) {
  announcementSearch.addEventListener("input", filterAnnouncements);
}