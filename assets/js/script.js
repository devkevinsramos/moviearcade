// Seleciona o botão principal da página
const welcomeBtn = document.getElementById("welcomeBtn");

// Seleciona o parágrafo onde a mensagem será exibida
const message = document.getElementById("message");

// Adiciona um evento de clique no botão
welcomeBtn.addEventListener("click", () => {
  // Troca o texto da mensagem ao clicar
  message.textContent = "Bem-vindo ao MovieArcade. O projeto começou oficialmente.";
});