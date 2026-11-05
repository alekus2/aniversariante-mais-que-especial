
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

/* =========================================
   3. TRILHA SONORA - SPOTIFY
========================================= */

const songs = [
    {
        title: "Cherry Waves",
        artist: "Deftones",
        spotifyUri: "spotify:track:70L6nHORQsblY813yNqUR3?si=1e88b401c14049fa",
        cover: "assets/images/musica-01.jpg",
        dedication:
            "Essa música me lembra você e tudo que sinto quando estamos juntos.",

        startAt: 200,
        endAt: 240,

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

const spotifyControllers = new Map();

let spotifyAPI = null;


/* =========================================
   4. UTILITÁRIOS
========================================= */

function formatTime(seconds) {
    const value = Math.max(0, Math.floor(seconds));

    const minutes = Math.floor(value / 60);
    const remaining = value % 60;

    return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}


/* =========================================
   5. CRIAR OS CARTÕES
========================================= */

function renderSongs() {
    musicGrid.innerHTML = "";

    songs.forEach((song, index) => {
        const card = document.createElement("article");

        card.className = "music-card";

        card.innerHTML = `
            <div class="music-header">
                <img
                    class="music-cover"
                    src="${song.cover}"
                    alt="Capa de ${song.title}"
                >

                <div class="music-info">
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                </div>
            </div>

            <div class="lyrics-box">
                <div class="lyrics-content">
                    ${song.lyrics.map((line, lineIndex) => `
                        <p
                            class="lyrics-line future"
                            data-line="${lineIndex}"
                        >${line.text}</p>
                    `).join("")}
                </div>

                <p class="lyrics-status">
                    Uma lembrança em forma de música ♡
                </p>
            </div>

            <div class="music-progress">
                <div class="music-progress-fill"></div>
            </div>

            <p class="music-time">
                ${formatTime(song.startAt)} / ${formatTime(song.endAt)}
            </p>

            <div class="lyrics-controls">
                <button class="lyrics-button start-button" disabled>
                    Carregando Spotify...
                </button>

                <button class="lyrics-button secondary pause-button" disabled>
                    Pausar
                </button>
            </div>

            <p class="music-note">${song.dedication}</p>

            <div class="spotify-container"></div>
        `;

        musicGrid.appendChild(card);
    });
}


/* =========================================
   6. ATUALIZAR A LETRA
========================================= */

function updateLyrics(card, song, position) {
    const lines = card.querySelectorAll(".lyrics-line");

    let activeIndex = -1;

    song.lyrics.forEach((line, index) => {
        if (position >= line.time) {
            activeIndex = index;
        }
    });

    lines.forEach((line, index) => {
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
   7. CRIAR E CONTROLAR OS PLAYERS
========================================= */

function createSpotifyPlayers() {
    songs.forEach((song, index) => {
        const card = musicGrid.children[index];

        const playerElement = card.querySelector(".spotify-container");

        const startButton = card.querySelector(".start-button");
        const pauseButton = card.querySelector(".pause-button");

        const status = card.querySelector(".lyrics-status");
        const progress = card.querySelector(".music-progress-fill");
        const timeDisplay = card.querySelector(".music-time");

        let controller = null;
        let isPlaying = false;
        let finished = false;

        spotifyAPI.createController(
            playerElement,
            {
                uri: song.spotifyUri,
                width: "100%",
                height: "152"
            },
            (embedController) => {
                controller = embedController;

                spotifyControllers.set(index, controller);

                // PLAYER PRONTO
                controller.addListener("ready", () => {
                    startButton.disabled = false;
                    startButton.textContent = "Sincronizar música ♡";

                    status.textContent = "Tudo pronto para nossa música. ♡";
                });

                // RECEBER O TEMPO REAL DO SPOTIFY
                controller.addListener("playback_update", (event) => {
                    const playback = event.data;

                    if (playback.playingURI !== song.spotifyUri) {
                        return;
                    }

                    const position = playback.position / 1000;

                    isPlaying = !playback.isPaused;

                    updateLyrics(card, song, position);

                    const elapsed = Math.max(
                        0,
                        position - song.startAt
                    );

                    const duration = song.endAt - song.startAt;

                    const percentage = Math.min(
                        100,
                        Math.max(0, elapsed / duration * 100)
                    );

                    progress.style.width = `${percentage}%`;

                    timeDisplay.textContent =
                        `${formatTime(position)} / ${formatTime(song.endAt)}`;

                    pauseButton.textContent = isPlaying
                        ? "Pausar"
                        : "Continuar";

                    status.textContent = playback.isBuffering
                        ? "Carregando música..."
                        : playback.isPaused
                            ? "Música pausada."
                            : "Nossa música está tocando. ♡";

                    // ENCERRAR O TRECHO ESCOLHIDO
                    if (position >= song.endAt && !finished) {
                        finished = true;

                        controller.pause();

                        startButton.textContent = "Recomeçar ♡";
                        pauseButton.disabled = true;

                        status.textContent =
                            "Fim desse pedacinho especial. ♡";
                    }
                });

                // INICIAR NO TEMPO CONFIGURADO
                startButton.addEventListener("click", () => {
                    if (song.spotifyUri.includes("SEU_ID")) {
                        status.textContent =
                            "Insira o ID verdadeiro da música.";

                        return;
                    }

                    // Pausar outras músicas do site.
                    spotifyControllers.forEach((other, otherIndex) => {
                        if (otherIndex !== index) {
                            other.pause();
                        }
                    });

                    finished = false;

                    startButton.textContent = "Carregando...";

                    status.textContent = "Preparando a música ♡";

                    controller.loadEntity(
                        song.spotifyUri,
                        false,
                        song.startAt
                    );

                    controller.play();
                });

                // PAUSAR E RETOMAR
                pauseButton.addEventListener("click", () => {
                    if (!controller) return;

                    if (isPlaying) {
                        controller.pause();
                    } else {
                        controller.resume();
                    }
                });
            }
        );
    });
}


/* =========================================
   8. CARREGAR A API DO SPOTIFY
========================================= */

function initializeSpotify() {
    const script = document.createElement("script");

    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;

    window.onSpotifyIframeApiReady = (IFrameAPI) => {
        spotifyAPI = IFrameAPI;

        createSpotifyPlayers();
    };

    script.onerror = () => {
        document.querySelectorAll(".lyrics-status").forEach((element) => {
            element.textContent =
                "Não foi possível carregar o Spotify. Tente novamente.";
        });
    };

    document.body.appendChild(script);
}


/* =========================================
   9. INICIALIZAÇÃO
========================================= */

renderSongs();
initializeSpotify();
