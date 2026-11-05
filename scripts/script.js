/* =========================================
   0. BLOQUEADOR DE SITE
========================================= */

const siteUnlockAt = new Date("2026-11-05T20:00:00-04:00");

const siteContent = document.getElementById("siteContent");
const siteLock = document.getElementById("siteLock");
const siteCountdown = document.getElementById("siteCountdown");

let siteLockInterval = null;

function updateSiteLock() {
    if (!siteContent || !siteLock || !siteCountdown) return;

    const remaining = siteUnlockAt.getTime() - Date.now();

    if (remaining <= 0) {
        document.body.classList.remove("site-locked");

        siteContent.removeAttribute("inert");

        siteLock.hidden = true;

        if (siteLockInterval !== null) {
            clearInterval(siteLockInterval);
        }

        return;
    }

    document.body.classList.add("site-locked");

    siteContent.setAttribute("inert", "");

    siteLock.hidden = false;

    const totalSeconds = Math.floor(remaining / 1000);

    const days = Math.floor(totalSeconds / 86400);

    const hours = Math.floor((totalSeconds % 86400) / 3600);

    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const seconds = totalSeconds % 60;

    const format = number => String(number).padStart(2, "0");

    siteCountdown.textContent =
        `${days}d ${format(hours)}h ${format(minutes)}m ${format(seconds)}s`;
}

updateSiteLock();

if (siteUnlockAt.getTime() > Date.now()) {
    siteLockInterval = setInterval(updateSiteLock, 1000);
}


/* =========================================
   1. CONTADOR DE RELACIONAMENTO
========================================= */

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
        ? "Fechar mi corazon ♡"
        : "Abrir mi corazon ♡";

    // Atualizar a mensagem.
    finalMessage.textContent = isOpen
        ? "Eu te amo demais! ❤️"
        : "Você é uma das partes mais bonitas da minha vida.";

});


/* =========================================
   3. TRILHA SONORA - KARAOKE VISUAL
========================================= */

const songs = [
    {
        title: "Cherry Waves",
        artist: "Deftones",
        cover: "assets/images/musica-01.jpg",

        dedication:
            "Essa música me lembra você e tudo que sinto quando estamos juntos.",

        // Trecho escolhido da música, em segundos.
        startAt: 205,
        endAt: 250,

        lyrics: [
            { time: 205, text: "If like, you should stay down beneath" },
            { time: 217, text: "I'll swim down" },
            { time: 223, text: "Would you?" },
            { time: 226, text: "Is that what you want?" },
            { time: 230, text: "Would you?" }
        ]
    }
];

const musicGrid = document.getElementById("musicGrid");

let musicTimer = null;
let currentTime = 0;
let isPlaying = false;
let currentSong = null;


/* =========================================
   4. FORMATAÇÃO DO TEMPO
========================================= */

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}


/* =========================================
   5. DESTAQUE DINÂMICO DAS LETRAS
========================================= */

function updateLyrics() {
    if (!currentSong) return;

    const lyricLines = document.querySelectorAll(".lyrics-line");

    let activeIndex = -1;

    currentSong.lyrics.forEach((lyric, index) => {
        if (currentTime >= lyric.time) {
            activeIndex = index;
        }
    });

    lyricLines.forEach((line, index) => {
        line.classList.remove("active", "past", "future");

        if (index === activeIndex) {
            line.classList.add("active");
        } else if (index < activeIndex) {
            line.classList.add("past");
        } else {
            line.classList.add("future");
        }
    });
}


/* =========================================
   6. ATUALIZAÇÃO DO PLAYER VISUAL
========================================= */

function updatePlayer() {
    if (!currentSong) return;

    const elapsed = currentTime - currentSong.startAt;
    const duration = currentSong.endAt - currentSong.startAt;

    const percentage = Math.min(
        100,
        Math.max(0, (elapsed / duration) * 100)
    );

    document.querySelector(".music-progress-fill").style.width =
        `${percentage}%`;

    document.querySelector(".music-time").textContent =
        `${formatTime(currentTime)} / ${formatTime(currentSong.endAt)}`;

    updateLyrics();
}


/* =========================================
   7. CONTROLE DO KARAOKÊ VISUAL
========================================= */

function startVisualTimer() {
    if (!currentSong || isPlaying) return;

    if (currentTime >= currentSong.endAt) {
        currentTime = currentSong.startAt;
    }

    isPlaying = true;

    const syncButton = document.querySelector(".lyrics-button");
    const pauseButton = document.querySelector(".pause-button");
    const status = document.querySelector(".lyrics-status");

    syncButton.textContent = "Sincronizando ♡";
    pauseButton.textContent = "Pausar";
    status.textContent = "Nossa música está passando... ♡";

    const startClock = Date.now();
    const initialTime = currentTime;

    musicTimer = setInterval(() => {
        const elapsed = (Date.now() - startClock) / 1000;

        currentTime = Math.min(
            initialTime + elapsed,
            currentSong.endAt
        );

        updatePlayer();

        if (currentTime >= currentSong.endAt) {
            stopVisualTimer();

            syncButton.textContent = "Recomeçar ♡";
            status.textContent = "Um trecho que sempre será nosso. ♡";
        }
    }, 100);
}

function stopVisualTimer() {
    clearInterval(musicTimer);

    musicTimer = null;
    isPlaying = false;

    const pauseButton = document.querySelector(".pause-button");

    if (pauseButton) {
        pauseButton.textContent = "Continuar";
    }
}

function toggleVisualTimer() {
    if (isPlaying) {
        stopVisualTimer();
        return;
    }

    startVisualTimer();
}


/* =========================================
   8. RENDERIZAÇÃO DAS MÚSICAS
========================================= */

function renderSongs() {
    musicGrid.innerHTML = "";

    songs.forEach((song) => {
        const card = document.createElement("article");

        card.className = "music-card";

        card.innerHTML = `
            <div class="music-header">
                <img
                    src="${song.cover}"
                    alt="Capa de ${song.title}"
                    class="music-cover"
                >

                <div>
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                </div>
            </div>

            <div class="lyrics-box">
                <div class="lyrics-list">
                    ${song.lyrics.map((lyric) => `
                        <p class="lyrics-line future">
                            ${lyric.text}
                        </p>
                    `).join("")}
                </div>

                <p class="lyrics-status">Tudo pronto para nossa música. ♡</p>
            </div>

            <div class="music-progress">
                <div class="music-progress-fill"></div>
            </div>

            <p class="music-time">
                ${formatTime(song.startAt)} / ${formatTime(song.endAt)}
            </p>

            <div class="lyrics-controls">
                <button class="lyrics-button">
                    Sincronizar música ♡
                </button>

                <button class="pause-button">
                    Pausar
                </button>
            </div>

            <p class="music-dedication">
                ${song.dedication}
            </p>
        `;

        musicGrid.appendChild(card);

        card.querySelector(".lyrics-button").addEventListener(
            "click",
            () => {
                currentSong = song;
                currentTime = song.startAt;

                stopVisualTimer();
                updatePlayer();
                startVisualTimer();
            }
        );

        card.querySelector(".pause-button").addEventListener(
            "click",
            () => {
                if (currentSong !== song) return;

                toggleVisualTimer();
            }
        );
    });
}


/* =========================================
   9. INICIALIZAÇÃO
========================================= */

renderSongs();
