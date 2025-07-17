const timerDisplay = document.getElementById("timer-display");
const minutesInput = document.getElementById("minutes-input");
const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
const resetButton = document.getElementById("reset-button");
const lofiToggle = document.getElementById("lofi-toggle");
const stimToggle = document.getElementById("stim-toggle");
const lofiContainer = document.getElementById("lofi-container");
const stimContainer = document.getElementById("stim-container");
const ring = document.getElementById("progress-ring");
const ringLength = 2 * Math.PI * 100;
let totalSeconds = 0;
let secondsLeft = 0;
let timerInterval = null;
let isPaused = false;

function updateDisplay() {
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
function updateRing() {
  const progress = (secondsLeft / totalSeconds) * ringLength;
  ring.style.strokeDashoffset = progress;
}
function startTimer() {
  const minutes = parseInt(minutesInput.value);
  if (isNaN(minutes) || minutes <= 0) return;

  totalSeconds = minutes * 60;
  secondsLeft = totalSeconds;
  updateDisplay();
  updateRing();

  startButton.disabled = true;
  pauseButton.disabled = false;

  timerInterval = setInterval(() => {
    if (!isPaused) {
      secondsLeft--;
      updateDisplay();
      updateRing();

      if (secondsLeft <= 0) {
        clearInterval(timerInterval);
        startButton.disabled = false;
        pauseButton.disabled = true;
        runConfetti();
      }
    }
  }, 1000);
}
function pauseTimer() {
  isPaused = !isPaused;
  pauseButton.textContent = isPaused ? "Resume" : "Pause";
}
function resetTimer() {
  clearInterval(timerInterval);
  startButton.disabled = false;
  pauseButton.disabled = true;
  pauseButton.textContent = "Pause";
  secondsLeft = 0;
  updateDisplay();
  ring.style.strokeDashoffset = ringLength;
}




function runConfetti() {
  confetti({
    particleCount: 200,
    spread: 100,
    origin: { y: 0.6 }
  });
}



lofiToggle.addEventListener("change", () => {
  lofiContainer.classList.toggle("hidden", !lofiToggle.checked);
});
stimToggle.addEventListener("change", () => {
  stimContainer.classList.toggle("hidden", !stimToggle.checked);
});
startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);
updateDisplay();
ring.style.strokeDashoffset = ringLength;