
/* =========================================
   1. CONTADOR DE RELACIONAMENTO
========================================= */

// Data oficial do início do relacionamento.
// Os meses no JavaScript começam em zero:
// Janeiro = 0, Julho = 6.

const relationshipStart = new Date(2023, 6, 18, 0, 0, 0);


// Adiciona anos preservando a data e o horário.
function addYears(date, amount) {
    const result = new Date(date);

    result.setFullYear(result.getFullYear() + amount);

    return result;
}


// Adiciona meses preservando a data e o horário.
function addMonths(date, amount) {
    const result = new Date(date);

    result.setMonth(result.getMonth() + amount);

    return result;
}


// Adiciona dias considerando o calendário local.
function addDays(date, amount) {
    const result = new Date(date);

    result.setDate(result.getDate() + amount);

    return result;
}


// Calcula e atualiza o contador.
function updateCounter() {

    const now = new Date();

    // Impede resultados negativos caso a data seja anterior
    // ao início do relacionamento.
    if (now < relationshipStart) {
        return;
    }

    let cursor = new Date(relationshipStart);

    let years = 0;
    let months = 0;
    let days = 0;

    // CALCULAR ANOS COMPLETOS
    while (addYears(cursor, 1) <= now) {
        cursor = addYears(cursor, 1);
        years++;
    }

    // CALCULAR MESES COMPLETOS
    while (addMonths(cursor, 1) <= now) {
        cursor = addMonths(cursor, 1);
        months++;
    }

    // CALCULAR DIAS COMPLETOS
    while (addDays(cursor, 1) <= now) {
        cursor = addDays(cursor, 1);
        days++;
    }

    // CALCULAR HORAS, MINUTOS E SEGUNDOS
    const remainingMilliseconds = now.getTime() - cursor.getTime();

    const hours = Math.floor(
        remainingMilliseconds / (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (remainingMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
    );

    const seconds = Math.floor(
        (remainingMilliseconds % (1000 * 60)) / 1000
    );

    // CALCULAR TOTAL DE DIAS DE CALENDÁRIO
    const startDay = Date.UTC(
        relationshipStart.getFullYear(),
        relationshipStart.getMonth(),
        relationshipStart.getDate()
    );

    const currentDay = Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    const totalDays = Math.floor(
        (currentDay - startDay) / (1000 * 60 * 60 * 24)
    );

    // FORMATAR NÚMEROS COM DOIS DÍGITOS
    const formatNumber = (number) => {
        return String(number).padStart(2, "0");
    };

    // ATUALIZAR ELEMENTOS DO HTML
    document.getElementById("years").textContent =
        formatNumber(years);

    document.getElementById("months").textContent =
        formatNumber(months);

    document.getElementById("days").textContent =
        formatNumber(days);

    document.getElementById("hours").textContent =
        formatNumber(hours);

    document.getElementById("minutes").textContent =
        formatNumber(minutes);

    document.getElementById("seconds").textContent =
        formatNumber(seconds);

    document.getElementById("totalDays").textContent =
        totalDays.toLocaleString("pt-BR");

}


// Executar imediatamente quando a página carregar.
updateCounter();

// Atualizar a cada segundo.
setInterval(updateCounter, 1000);


/* =========================================
   2. ANIMAÇÃO DO CORAÇÃO
========================================= */

const openHeartButton = document.getElementById("openHeart");

const heart = document.getElementById("heart");

const finalMessage = document.getElementById("finalMessage");


openHeartButton.addEventListener("click", () => {

    // Alternar entre aberto e fechado.
    const isOpen = heart.classList.toggle("open");

    // Atualizar o estado de acessibilidade.
    openHeartButton.setAttribute("aria-expanded", isOpen);

    // Alterar o texto do botão.
    openHeartButton.textContent = isOpen
        ? "Fechar meu coração ♡"
        : "Abrir meu coração ♡";

    // Atualizar a mensagem.
    finalMessage.textContent = isOpen
        ? "E é aqui que guardo uma das minhas lembranças favoritas. ❤️"
        : "Você é uma das partes mais bonitas da minha vida.";

});
