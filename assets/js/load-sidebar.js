// fetch("sidebar.html")
//   .then(res => res.text())
//   .then(data => {
//     document.getElementById("sidebar-container").innerHTML = data;
//   });

  fetch("./sidebar.html")
  .then(response => response.text())
  .then(data => {
    const container = document.getElementById("sidebar-container");
    if (container) {
      container.innerHTML = data;
    }
  })
  .catch(error => {
    console.error("Error loading sidebar:", error);
  });