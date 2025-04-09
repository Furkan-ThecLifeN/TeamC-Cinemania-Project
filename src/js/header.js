// Tema geçişi
const themeToggle = document.getElementById("themeToggle");
const switchElips = document.getElementById("switchElips");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  if (document.body.classList.contains("light-mode")) {
    switchElips.style.left = "0px";
  } else {
    switchElips.style.left = "22px";
  }
});

// Menü butonu (responsive için şimdilik console log)
const menuBtn = document.getElementById("menu-btn");
menuBtn.addEventListener("click", () => {
  console.log("Menu button clicked!");
});

const navLinks = document.getElementById("navLinks");
menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});


document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});



