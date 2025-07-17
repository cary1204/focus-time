let lofiPlayer, stimPlayer;

const timerDisplay = document.getElementById("timer-display");
const minutesInput = document.getElementById("minutes-input");
const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
const resetButton = document.getElementById("reset-button");

const lofiToggle = document.getElementById("lofi-toggle");
const stimToggle = document.getElementById("stim-toggle");
const themeToggle = document.getElementById("theme-toggle");

const lofiContainer = document.getElementById("lofi-container");
const stimContainer = document.getElementById("stim-container");

const ring = document.getElementById("progress-ring");
const radius = ring.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

ring.style.strokeDasharray = circumference;
ring.style.strokeDashoffset = circumference;

let totalSeconds = 0;
let secondsLeft = 0;
let isPaused = false;
let startTime = null;
let pauseTime = null;
let rafId = null;

function updateDisplay() {
  const mins = Math.floor(secondsLeft / 60);
  const secs = Math.floor(secondsLeft % 60);
  timerDisplay.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function setProgress(percent) {
  const offset = circumference - percent * circumference;
  ring.style.strokeDashoffset = offset;
}

function animate() {
  if (isPaused) return;

  const now = Date.now();
  const elapsed = (now - startTime) / 1000;
  secondsLeft = Math.max(totalSeconds - elapsed, 0);

  updateDisplay();
  setProgress(1 - secondsLeft / totalSeconds);

  if (secondsLeft > 0) {
    rafId = requestAnimationFrame(animate);
  } else {
    runConfetti();
    startButton.disabled = false;
    pauseButton.disabled = true;
  }
}

function startTimer() {
  const minutes = parseFloat(minutesInput.value);
  if (isNaN(minutes) || minutes <= 0) return;

  totalSeconds = minutes * 60;
  secondsLeft = totalSeconds;
  startTime = Date.now();
  isPaused = false;

  updateDisplay();
  setProgress(0);

  startButton.disabled = true;
  pauseButton.disabled = false;
  pauseButton.textContent = "Pause";

  animate();
}

function pauseTimer() {
  if (!isPaused) {
    isPaused = true;
    pauseTime = Date.now();
    cancelAnimationFrame(rafId);
    pauseButton.textContent = "Resume";
  } else {
    isPaused = false;
    const pausedDuration = Date.now() - pauseTime;
    startTime += pausedDuration;
    pauseButton.textContent = "Pause";
    animate();
  }
}

function resetTimer() {
  cancelAnimationFrame(rafId);
  startButton.disabled = false;
  pauseButton.disabled = true;
  pauseButton.textContent = "Pause";
  secondsLeft = 0;
  totalSeconds = 0;
  setProgress(1);
  updateDisplay();
}

function runConfetti() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
    });
  } else {
    alert("Time's up! 🎉🎉🎉🎉 Take a rest :) ");
  }
}

function onYouTubeIframeAPIReady() {
  lofiPlayer = new YT.Player("lofi-player", {
    videoId: "jfKfPfyJRdk",
    playerVars: {
      autoplay: 1,
      loop: 1,
      playlist: "jfKfPfyJRdk",
      controls: 0,
      modestbranding: 1,
      rel: 0,
      mute: 1,
    },
    events: {
      onReady: (event) => {
        if (lofiToggle.checked) {
          event.target.playVideo();
        }
      },
    },
  });

  stimPlayer = new YT.Player("stim-player", {
    videoId: "ECuuGNt4rqY", 
    playerVars: {
      autoplay: 1,
      loop: 1,
      playlist: "ECuuGNt4rqY",
      controls: 0,
      modestbranding: 1,
      rel: 0,
      mute: 1,
      start: 1,
    },
    events: {
      onReady: (event) => {
        if (stimToggle.checked) {
          event.target.playVideo();
        }
      },
    },
  });
}


lofiToggle.addEventListener("change", () => {
  if (lofiToggle.checked) {
    lofiContainer.classList.remove("hidden");
    if (lofiPlayer && lofiPlayer.playVideo) lofiPlayer.playVideo();
  } else {
    lofiContainer.classList.add("hidden");
    if (lofiPlayer && lofiPlayer.pauseVideo) lofiPlayer.pauseVideo();
  }
});

stimToggle.addEventListener("change", () => {
  if (stimToggle.checked) {
    stimContainer.classList.remove("hidden");
    if (stimPlayer && stimPlayer.playVideo) stimPlayer.playVideo();
  } else {
    stimContainer.classList.add("hidden");
    if (stimPlayer && stimPlayer.pauseVideo) stimPlayer.pauseVideo();
  }
});

themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    document.body.classList.add("light-theme");
    document.body.classList.remove("dark-theme");
  } else {
    document.body.classList.add("dark-theme");
    document.body.classList.remove("light-theme");
  }
});

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);

updateDisplay();
setProgress(1);
pauseButton.disabled = true;
