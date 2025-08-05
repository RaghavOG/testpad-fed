let timer = document.getElementById("timer");
let startBtn = document.getElementById("startBtn");
let lapBtn = document.getElementById("lapBtn");
let laps = document.getElementById("laps");

let milliseconds = 0, interval = null;

function updateTime() {
  milliseconds += 10;
  const date = new Date(milliseconds);
  const min = String(date.getUTCMinutes()).padStart(2, '0');
  const sec = String(date.getUTCSeconds()).padStart(2, '0');
  const ms = String(Math.floor(date.getUTCMilliseconds() / 10)).padStart(2, '0');
  timer.textContent = `${min}:${sec}:${ms}`;
}

function startStopwatch() {
  interval = setInterval(updateTime, 10);
  startBtn.textContent = "Stop";
  startBtn.classList.add("stop");
  lapBtn.textContent = "Lap";
}

function stopStopwatch() {
  clearInterval(interval);
  startBtn.textContent = "Start";
  startBtn.classList.remove("stop");
  lapBtn.textContent = "Reset";
}

function resetStopwatch() {
  milliseconds = 0;
  updateTime();
  laps.innerHTML = '';
  lapBtn.textContent = "Lap";
}

startBtn.addEventListener("click", () => {
  if (startBtn.textContent === "Start") {
    startStopwatch();
  } else {
    stopStopwatch();
  }
});

lapBtn.addEventListener("click", () => {
  if (lapBtn.textContent === "Lap") {
    const li = document.createElement("li");
    li.textContent = `Lap ${laps.children.length + 1}: ${timer.textContent}`;
    laps.prepend(li);
  } else {
    resetStopwatch();
  }
});
