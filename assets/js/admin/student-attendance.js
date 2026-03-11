const studentAttendanceTableBody = document.getElementById("studentAttendanceTableBody");
const studentAttendanceSearch = document.getElementById("studentAttendanceSearch");
const refreshStudentAttendanceBtn = document.getElementById("refreshStudentAttendanceBtn");

const studentAttendanceViewModal = document.getElementById("studentAttendanceViewModal");
const studentAttendanceBackdrop = document.getElementById("studentAttendanceBackdrop");
const closeStudentAttendanceModalBtn = document.getElementById("closeStudentAttendanceModalBtn");

const detailStudentAttendanceDailyHash = document.getElementById("detailStudentAttendanceDailyHash");
const detailStudentAttendanceDate = document.getElementById("detailStudentAttendanceDate");
const detailStudentAttendanceStatus = document.getElementById("detailStudentAttendanceStatus");
const detailStudentAttendanceAbsenceType = document.getElementById("detailStudentAttendanceAbsenceType");
const detailStudentAttendanceMinutesLate = document.getElementById("detailStudentAttendanceMinutesLate");
const detailStudentAttendanceRecordedRole = document.getElementById("detailStudentAttendanceRecordedRole");
const detailStudentAttendanceRecordedHash = document.getElementById("detailStudentAttendanceRecordedHash");
const detailStudentAttendanceCreatedAt = document.getElementById("detailStudentAttendanceCreatedAt");
const detailStudentAttendanceUpdatedAt = document.getElementById("detailStudentAttendanceUpdatedAt");
const detailStudentAttendanceNote = document.getElementById("detailStudentAttendanceNote");

let studentAttendanceData = [];

const mockStudentAttendance = [
{
daily_hash:"DAY_001",
attendance_date:"2026-03-01",
status:"Present",
absence_type:"None",
minutes_late:0,
note:"On time",
recorded_by_role:"Teacher",
recorded_by_hash:"TCH_001",
created_at:"2026-03-01",
updated_at:"2026-03-01"
},
{
daily_hash:"DAY_002",
attendance_date:"2026-03-02",
status:"Late",
absence_type:"None",
minutes_late:15,
note:"Traffic",
recorded_by_role:"Teacher",
recorded_by_hash:"TCH_002",
created_at:"2026-03-02",
updated_at:"2026-03-02"
}
];

function renderStudentAttendance(data){

if(!studentAttendanceTableBody) return;

if(!data || data.length===0){

studentAttendanceTableBody.innerHTML=
`
<tr>
<td colspan="11" class="a-table-empty">No attendance records.</td>
</tr>
`;

return;
}

studentAttendanceTableBody.innerHTML=data.map(item=>`

<tr>

<td>${formatValue(item.daily_hash)}</td>
<td>${formatValue(item.attendance_date)}</td>
<td>${formatValue(item.status)}</td>
<td>${formatValue(item.absence_type)}</td>
<td>${formatValue(item.minutes_late)}</td>
<td>${formatValue(item.note)}</td>
<td>${formatValue(item.recorded_by_role)}</td>
<td>${formatValue(item.recorded_by_hash)}</td>
<td>${formatValue(item.created_at)}</td>
<td>${formatValue(item.updated_at)}</td>

<td>
<div class="a-table-actions">
<button class="a-action-btn" onclick="viewStudentAttendance('${item.daily_hash || ""}')">View</button>
</div>
</td>

</tr>

`).join("");

}

async function fetchStudentAttendance(){

if(!studentAttendanceTableBody) return;

studentAttendanceTableBody.innerHTML=
`
<tr>
<td colspan="11" class="a-table-empty">Loading attendance...</td>
</tr>
`;

try{

const token=typeof getToken==="function"
?getToken()
:localStorage.getItem("token");

const response=await apiRequest("/get_student_daily_attendance","GET",null,token);

if(Array.isArray(response) && response.length>0){

studentAttendanceData=response.map(item=>({

daily_hash:item.daily_hash||"Unknown",
attendance_date:item.attendance_date||"Unknown",
status:item.status||"Unknown",
absence_type:item.absence_type||"Unknown",
minutes_late:item.minutes_late||0,
note:item.note||"",
recorded_by_role:item.recorded_by_role||"",
recorded_by_hash:item.recorded_by_hash||"",
created_at:item.created_at||"",
updated_at:item.updated_at||""

}));

}else{

studentAttendanceData=mockStudentAttendance;

}

renderStudentAttendance(studentAttendanceData);

}catch(error){

console.error("attendance error:",error);

studentAttendanceData=mockStudentAttendance;

renderStudentAttendance(studentAttendanceData);

}

}

function filterStudentAttendance(){

if(!studentAttendanceSearch) return;

const query=studentAttendanceSearch.value.toLowerCase();

const filtered=studentAttendanceData.filter(item=>

String(item.attendance_date).toLowerCase().includes(query) ||
String(item.status).toLowerCase().includes(query) ||
String(item.note).toLowerCase().includes(query)

);

renderStudentAttendance(filtered);

}
function viewStudentAttendance(dailyHash) {
  const item = studentAttendanceData.find(entry => entry.daily_hash === dailyHash);
  if (!item || !studentAttendanceViewModal) return;

  detailStudentAttendanceDailyHash.textContent = formatValue(item.daily_hash);
  detailStudentAttendanceDate.textContent = formatValue(item.attendance_date);
  detailStudentAttendanceStatus.textContent = formatValue(item.status);
  detailStudentAttendanceAbsenceType.textContent = formatValue(item.absence_type);
  detailStudentAttendanceMinutesLate.textContent = formatValue(item.minutes_late);
  detailStudentAttendanceRecordedRole.textContent = formatValue(item.recorded_by_role);
  detailStudentAttendanceRecordedHash.textContent = formatValue(item.recorded_by_hash);
  detailStudentAttendanceCreatedAt.textContent = formatValue(item.created_at);
  detailStudentAttendanceUpdatedAt.textContent = formatValue(item.updated_at);
  detailStudentAttendanceNote.textContent = formatValue(item.note);

  studentAttendanceViewModal.classList.add("show");
}

function closeStudentAttendanceModal() {
  if (!studentAttendanceViewModal) return;
  studentAttendanceViewModal.classList.remove("show");
}

if(studentAttendanceTableBody){

fetchStudentAttendance();

if(studentAttendanceSearch){
studentAttendanceSearch.addEventListener("input",filterStudentAttendance);
}

if(refreshStudentAttendanceBtn){
refreshStudentAttendanceBtn.addEventListener("click",fetchStudentAttendance);
}

if (closeStudentAttendanceModalBtn) {
  closeStudentAttendanceModalBtn.addEventListener("click", closeStudentAttendanceModal);
}

if (studentAttendanceBackdrop) {
  studentAttendanceBackdrop.addEventListener("click", closeStudentAttendanceModal);
}

}

