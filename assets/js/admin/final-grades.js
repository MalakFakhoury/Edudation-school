const finalGradesTableBody =
document.getElementById("finalGradesTableBody")

const finalGradesSearch =
document.getElementById("finalGradesSearch")

const refreshFinalGradesBtn =
document.getElementById("refreshFinalGradesBtn")

const lockFinalGradesBtn =
document.getElementById("lockFinalGradesBtn")

let finalGradesData = []

const mockFinalGrades = [

{
student_hash:"STU_001",
name:"Ahmad Ali",
course:"Math",
percent:92,
letter:"A",
status:"Unlocked"
},

{
student_hash:"STU_002",
name:"Lina Hassan",
course:"Physics",
percent:85,
letter:"B",
status:"Unlocked"
}

]

function renderFinalGrades(data){

if(!finalGradesTableBody) return

if(!data.length){

finalGradesTableBody.innerHTML=
`<tr>
<td colspan="6" class="a-table-empty">
No grades found
</td>
</tr>`

return

}

finalGradesTableBody.innerHTML=data.map(g=>`

<tr>

<td>${formatValue(g.student_hash)}</td>
<td>${formatValue(g.name)}</td>
<td>${formatValue(g.course)}</td>
<td>${formatValue(g.percent)}</td>
<td>${formatValue(g.letter)}</td>
<td>${formatValue(g.status)}</td>

</tr>

`).join("")

}

async function fetchFinalGrades(){

try{

const token=getToken()

const response=await apiRequest(
"/get_final_grades",
"GET",
null,
token
)

if(Array.isArray(response)){

finalGradesData=response

}else{

finalGradesData=mockFinalGrades

}

renderFinalGrades(finalGradesData)

}catch(err){

console.error(err)

finalGradesData=mockFinalGrades

renderFinalGrades(finalGradesData)

}

}

function filterFinalGrades(){

if(!finalGradesSearch) return

const query=
finalGradesSearch.value
.trim()
.toLowerCase()

const filtered=
finalGradesData.filter(g=>

String(g.student_hash)
.toLowerCase()
.includes(query)

||

String(g.name)
.toLowerCase()
.includes(query)

||

String(g.course)
.toLowerCase()
.includes(query)

)

renderFinalGrades(filtered)

}

async function lockFinalGrades(){

const confirmLock=
confirm("Lock all final grades?")

if(!confirmLock) return

try{

await apiRequest(
"/lock_final_grades",
"POST",
{},
getToken()
)

alert("Final grades locked")

fetchFinalGrades()

}catch(err){

console.error(err)

}

}

if(finalGradesTableBody){

fetchFinalGrades()

}

if(refreshFinalGradesBtn){

refreshFinalGradesBtn
.addEventListener(
"click",
fetchFinalGrades
)

}

if(finalGradesSearch){

finalGradesSearch
.addEventListener(
"input",
filterFinalGrades
)

}

if(lockFinalGradesBtn){

lockFinalGradesBtn
.addEventListener(
"click",
lockFinalGrades
)

}