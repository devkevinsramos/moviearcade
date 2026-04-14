// =========================
// BOTÃO DA INDEX
// =========================

const welcomeBtn = document.getElementById("welcomeBtn");
const message = document.getElementById("message");

if (welcomeBtn && message) {
  welcomeBtn.addEventListener("click", () => {
    message.textContent = "Bem-vindo ao MovieArcade. O projeto começou oficialmente.";
  });
}

// =========================
// POSTS RECENTES - VER MAIS
// =========================

const toggleButton = document.getElementById("feedToggleButton");
const hiddenCards = document.querySelectorAll(".feed-card-hidden");
const toggleText = document.querySelector(".feed-toggle-text");

if (toggleButton && hiddenCards.length > 0 && toggleText) {
  toggleButton.addEventListener("click", () => {
    const isExpanded = toggleButton.classList.contains("active");

    hiddenCards.forEach((card) => {
      card.classList.toggle("show");
    });

    toggleButton.classList.toggle("active");
    toggleButton.setAttribute("aria-expanded", String(!isExpanded));
    toggleText.textContent = isExpanded ? "Ver mais" : "Ver menos";
  });
}