'use strict';

const displayMinutes = document.getElementById('display-minutes');
const displaySeconds = document.getElementById('display-seconds');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');
let startTime = 0;
let displayTime = 0;
let isRunning = false;
let intervalID = null;
let previousText = null;

function hideButton(element) {
  element.classList.add('display-none');
}

function showButton(element) {
  element.classList.remove('display-none');
}

function disableResetButton(element, boolean) {
  if (boolean) {
    element.disabled = false;
  } else {
    element.disabled = true;
  }
}

// Start ボタンが押されてからの経過時間
function elapsedTime() {
  return Date.now() - startTime;
}

function calcDisplayTime() {
  if (isRunning) {
    return displayTime + elapsedTime();
  }
  return displayTime;
}

function start() {
  hideButton(startButton);
  showButton(stopButton);
  disableResetButton(resetButton, isRunning);
  isRunning = true;
  startTime = Date.now();
  intervalID = setInterval(() => {
    const time = calcDisplayTime();
    printDisplayTime(time);
    speakDisplayMinutes(displayMinutes);
  }, 100);
}

function stop() {
  hideButton(stopButton);
  showButton(startButton);
  disableResetButton(resetButton, isRunning);
  isRunning = false;
  displayTime = displayTime + elapsedTime();
  clearInterval(intervalID);
}

function reset() {
  displayTime = 0;
  printDisplayTime(displayTime);
  startTime = 0;
}

/**
 *
 * @param {Number} time ミリ秒
 */
function printDisplayTime(time) {
  const minutes = Math.floor(Math.floor(time / 1000) / 60);
  const seconds = Math.floor(time / 1000);

  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = (seconds % 60).toString().padStart(2, '0');

  displayMinutes.textContent = formattedMinutes;
  displaySeconds.textContent = formattedSeconds;
}

function speakDisplayMinutes(displayMinutes) {
  const currentText = displayMinutes.textContent;
  if (previousText !== currentText) {
    previousText = currentText;
    if (currentText !== '00' && previousText) {
      const text = Number(currentText) + '分、経過';
      const utterThis = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterThis);
    }
  }
}

startButton.addEventListener('click', () => {
  start();
});

stopButton.addEventListener('click', () => {
  stop();
});

resetButton.addEventListener('click', () => {
  reset();
});
