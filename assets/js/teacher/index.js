document.addEventListener("DOMContentLoaded", () => {
  const createBtn = document.getElementById("btnCreate");
  const quickCreateBtn = document.getElementById("quickCreateBtn");
  const tabButtons = document.querySelectorAll(".t-tab");
  const cardButtons = document.querySelectorAll(".t-card__actions .t-btn");

  function goToLessons() {
    window.location.href = "./lessons.html";
  }

  function goToStudents(sectionTitle) {
    localStorage.setItem("selected_section", sectionTitle || "");
    window.location.href = "./section-students.html";
  }

  function openSection(sectionTitle) {
    localStorage.setItem("selected_section", sectionTitle || "");
    window.location.href = "./lessons.html";
  }

  if (createBtn) {
    createBtn.addEventListener("click", goToLessons);
  }

  if (quickCreateBtn) {
    quickCreateBtn.addEventListener("click", goToLessons);
  }

  tabButtons.forEach((tab) => {
    tab.addEventListener("click", function () {
      tabButtons.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");
    });
  });

  cardButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const text = this.textContent.trim();
      const card = this.closest(".t-card");
      const title = card?.querySelector(".t-card__title")?.textContent?.trim() || "";

      if (text === "Open") {
        openSection(title);
        return;
      }

      if (text === "Students") {
        goToStudents(title);
      }
    });
  });
});