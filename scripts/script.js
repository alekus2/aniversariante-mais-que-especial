/* =========================================
   0. BLOQUEADOR DE SITE
========================================= */

const siteUnlockAt = new Date("2026-11-06T00:00:00-04:00");

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
        ? "Fechar mi corazon "
        : "Abrir mi corazon ";

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
        audio: "musicas/Cherry Waves.webm",

        dedication:
            "Essa música me lembra você e tudo que sinto quando estamos juntos.",

        // Trecho escolhido da música, em segundos.
        startAt: 205,
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

const audioPlayer = new Audio();
audioPlayer.preload = "auto";

let currentTime = 0;
let isPlaying = false;
let currentSong = null;
let currentCard = null;
let playbackFrame = null;


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
    if (!currentSong || !currentCard) return;

    const lyricLines = currentCard.querySelectorAll(".lyrics-line");

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
    if (!currentSong || !currentCard) return;

    const elapsed = currentTime - currentSong.startAt;
    const duration = currentSong.endAt - currentSong.startAt;

    const percentage = Math.min(
        100,
        Math.max(0, (elapsed / duration) * 100)
    );

    currentCard.querySelector(".music-progress-fill").style.width =
        `${percentage}%`;

    currentCard.querySelector(".music-time").textContent =
        `${formatTime(currentTime)} / ${formatTime(currentSong.endAt)}`;

    updateLyrics();
}


/* =========================================
   7. CONTROLE DO ÁUDIO E DO KARAOKÊ
========================================= */

function waitForAudioMetadata() {
    if (audioPlayer.readyState >= HTMLMediaElement.HAVE_METADATA) {
        return Promise.resolve();
    }

    if (audioPlayer.error) {
        return Promise.reject(
            new Error("O arquivo de áudio não pôde ser carregado.")
        );
    }

    return new Promise((resolve, reject) => {
        audioPlayer.addEventListener("loadedmetadata", resolve, { once: true });
        audioPlayer.addEventListener("error", () => {
            reject(new Error("O arquivo de áudio não pôde ser carregado."));
        }, { once: true });
    });
}

function seekAudio(time) {
    if (Math.abs(audioPlayer.currentTime - time) < 0.01) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        const cleanup = () => {
            audioPlayer.removeEventListener("seeked", onSeeked);
            audioPlayer.removeEventListener("error", onError);
        };
        const onSeeked = () => {
            cleanup();
            resolve();
        };
        const onError = () => {
            cleanup();
            reject(new Error("Não foi possível sincronizar o trecho do áudio."));
        };

        audioPlayer.addEventListener("seeked", onSeeked, { once: true });
        audioPlayer.addEventListener("error", onError, { once: true });

        try {
            audioPlayer.currentTime = time;
        } catch (error) {
            cleanup();
            reject(error);
        }
    });
}

async function playSong(song, card, restart) {
    const isNewSong = currentSong !== song;

    if (isNewSong) {
        audioPlayer.pause();
        currentSong = song;
        currentCard = card;
        currentTime = song.startAt;
        audioPlayer.src = song.audio;
        audioPlayer.load();
    }

    if (restart || currentTime >= song.endAt) {
        currentTime = song.startAt;
    }

    currentCard = card;
    const status = card.querySelector(".lyrics-status");
    status.textContent = "Carregando música... ";

    try {
        audioPlayer.muted = true;
        const playbackResult = audioPlayer.play().then(
            () => null,
            error => error
        );

        await waitForAudioMetadata();
        await seekAudio(currentTime);
        const playbackError = await playbackResult;
        if (playbackError) throw playbackError;

        audioPlayer.muted = false;
        updatePlayer();
    } catch (error) {
        audioPlayer.muted = false;
        isPlaying = false;
        card.querySelector(".pause-button").textContent = "Continuar";
        status.textContent = `Não foi possível reproduzir o áudio: ${error.message}`;
        console.error("Erro ao reproduzir a música selecionada:", error);
    }
}

audioPlayer.addEventListener("play", () => {
    isPlaying = true;
    if (!currentCard) return;

    currentCard.querySelector(".pause-button").textContent = "Pausar";
    currentCard.querySelector(".lyrics-status").textContent =
        "Nossa música está passando... ";

    if (playbackFrame === null) {
        playbackFrame = requestAnimationFrame(syncPlaybackFrame);
    }
});

audioPlayer.addEventListener("pause", () => {
    isPlaying = false;
    if (playbackFrame !== null) {
        cancelAnimationFrame(playbackFrame);
        playbackFrame = null;
    }
    if (!currentCard || !currentSong) return;

    currentCard.querySelector(".pause-button").textContent = "Continuar";
    currentCard.querySelector(".lyrics-status").textContent =
        currentTime >= currentSong.endAt
            ? "Um trecho que sempre será nosso. "
            : "Música pausada. Continue quando quiser. ";
});

function updatePlaybackPosition() {
    if (!currentSong) return;

    currentTime = Math.min(audioPlayer.currentTime, currentSong.endAt);
    updatePlayer();

    if (audioPlayer.currentTime >= currentSong.endAt) {
        audioPlayer.pause();
        audioPlayer.currentTime = currentSong.endAt;
        currentTime = currentSong.endAt;
        updatePlayer();
    }
}

function syncPlaybackFrame() {
    playbackFrame = null;
    if (!isPlaying) return;

    updatePlaybackPosition();

    if (isPlaying) {
        playbackFrame = requestAnimationFrame(syncPlaybackFrame);
    }
}

audioPlayer.addEventListener("timeupdate", () => {
    updatePlaybackPosition();
});

audioPlayer.addEventListener("error", () => {
    if (!currentCard) return;

    const message = audioPlayer.error?.message
        || "verifique se o arquivo existe e está em um formato compatível.";
    currentCard.querySelector(".lyrics-status").textContent =
        `Não foi possível carregar o áudio: ${message}`;
    console.error("Erro ao carregar a música selecionada:", audioPlayer.error);
});

function toggleSongPlayback(song, card) {
    if (currentSong !== song || currentCard !== card) return;

    if (isPlaying) {
        audioPlayer.pause();
        return;
    }

    playSong(song, card, false);
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

                <p class="lyrics-status">Tudo pronto para nossa música. </p>
            </div>

            <div class="music-progress">
                <div class="music-progress-fill"></div>
            </div>

            <p class="music-time">
                ${formatTime(song.startAt)} / ${formatTime(song.endAt)}
            </p>

            <div class="lyrics-controls">
                <button class="lyrics-button">
                    Reproduzir música
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
                playSong(song, card, true);
            }
        );

        card.querySelector(".pause-button").addEventListener(
            "click",
            () => {
                toggleSongPlayback(song, card);
            }
        );
    });
}


/* =========================================
   9. INICIALIZAÇÃO
========================================= */

renderSongs();
