const startButton = document.getElementById("startButton");

startButton.addEventListener("click", () => {
    document.getElementById("gallery").scrollIntoView({
        behavior: "smooth"
    });
});

const openHeartButton = document.getElementById("openHeart");
const heart = document.getElementById("heart");

openHeartButton.addEventListener("click", () => {
    heart.classList.toggle("open");

    const isOpen = heart.classList.contains("open");

    openHeartButton.textContent = isOpen
        ? "Fechar meu coração ❤️"
        : "Abrir meu coração ❤️";
});
