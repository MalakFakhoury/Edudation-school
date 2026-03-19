document.addEventListener("DOMContentLoaded", () => {
  const createLessonBtn = document.getElementById("createLessonBtn");

  if (createLessonBtn) {
    createLessonBtn.addEventListener("click", () => {
      alert("Create lesson modal/page next.");
    });
  }
});