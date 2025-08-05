let sessionLength = 20;
let breakLength = 5;
let isSession = true;
let isRunning = true;
let timer;
let timeLeft = sessionLength * 60;

const timerDisplay = document.getElementById("timer");
const sessionDisplay = document.getElementById("session-time");
const breakDisplay = document.getElementById("break-time");
const phaseDisplay = document.getElementById("phase");
const pauseResumeText = document.getElementById("pause-resume");

function updateDisplays() {
  sessionDisplay.textContent = `${sessionLength} min`;
  breakDisplay.textContent = `${breakLength} min`;
  timerDisplay.textContent = formatTime(timeLeft);
}

function changeTime(type, amount) {
  if (!isRunning) return;
  if (type === "session") {
    sessionLength = Math.max(1, sessionLength + amount);
    if (isSession) timeLeft = sessionLength * 60;
  } else {
    breakLength = Math.max(1, breakLength + amount);
    if (!isSession) timeLeft = breakLength * 60;
  }
  updateDisplays();
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
}

function toggleTimer() {
  if (isRunning) {
    clearInterval(timer);
    pauseResumeText.textContent = "Resume";
  } else {
    timer = setInterval(countdown, 1000);
    pauseResumeText.textContent = "Pause";
  }
  isRunning = !isRunning;
}

function countdown() {
  if (timeLeft > 0) {
    timeLeft--;
  } else {
    isSession = !isSession;
    timeLeft = (isSession ? sessionLength : breakLength) * 60;
    phaseDisplay.textContent = isSession ? "Session 1" : "Break Time";
  }
  updateDisplays();
}

function resetTimer() {
  clearInterval(timer);
  sessionLength = 20;
  breakLength = 5;
  isSession = true;
  isRunning = false;
  timeLeft = sessionLength * 60;
  pauseResumeText.textContent = "Pause";
  phaseDisplay.textContent = "Session 1";
  updateDisplays();
}

// Start on load
updateDisplays();
timer = setInterval(countdown, 1000);
