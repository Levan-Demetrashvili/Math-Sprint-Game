import { createEquations, equationsArray } from './Equations.js';

// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const selectionContainer = document.querySelector('.selection-container');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
const wrongBtn = document.querySelector('.wrong');
const rightBtn = document.querySelector('.right');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

const bestScoresObj = JSON.parse(localStorage.getItem('bestScores')) || [
  { questions: 10, bestScore: 0.0 },
  { questions: 25, bestScore: 0.0 },
  { questions: 50, bestScore: 0.0 },
  { questions: 99, bestScore: 0.0 },
];

updateLS();

// Render best scores element
bestScores.forEach((el, i) => (el.textContent = bestScoresObj[i].bestScore + 's'));

// Equations
let questionAmount = 0;
let equationArrIndex = 0;

function updateLS() {
  localStorage.setItem('bestScores', JSON.stringify(bestScoresObj));
}

// Select inputs
function removeSelectClass() {
  radioContainers.forEach(el => el.classList.remove('selected-label'));
}

function addSelectClass(e) {
  const radioEl = e.target.closest('.radio-container')?.querySelector('input');
  if (!radioEl?.checked) return;

  removeSelectClass();
  radioEl.closest('.radio-container').classList.add('selected-label');
}

// Get Question Amount
function getRadioValue() {
  let value;
  radioInputs.forEach(el => {
    if (el.checked) value = +el.value;
  });
  return value;
}

function selectQuestionAmount(e) {
  e.preventDefault();
  questionAmount = getRadioValue();
  // Start Countdown to start the game
  questionAmount && displayCountdown();
}

// Display Countdown
function displayCountdown() {
  // Hide Splash Page and Show Countdown Page
  splashPage.hidden = true;
  countdownPage.hidden = false;
  let seconds = 3;
  const countdownInterval = setInterval(() => {
    if (seconds === 1) {
      countdown.textContent = 'GO!';
      clearInterval(countdownInterval);
      // Populate Game Page
      setTimeout(populateGamePage, 1000);
      return;
    }
    countdown.textContent = --seconds;
  }, 1000);
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Hide countdown Page and Show Game Page
  countdownPage.hidden = true;
  gamePage.hidden = false;

  // Scroll to top
  itemContainer.scroll(0, 0);

  // Reset DOM, Set Blank Space Above
  itemContainer.innerHTML = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');

  // Append
  itemContainer.append(topSpacer);

  // Create Equations, Build Elements in DOM
  createEquations(questionAmount);

  equationsArray.forEach(eq => {
    const item = document.createElement('div');
    item.classList.add('item');
    item.innerHTML = `<h1>${eq.value}</h1>`;
    itemContainer.appendChild(item);
  });

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

//* Time
let penaltyTime = 0;
let gameDurationInterval, baseTime, totalTime;

// Start Timer To Track Game Duration
function startTimer() {
  const interval = 100;
  const start = Date.now() + interval;

  gameDurationInterval = setInterval(() => {
    const delta = Date.now() - start;
    baseTime = +(delta / 1000).toFixed(1);
  }, interval);
}

//* Scroll

function scrollToNextEquation(idx) {
  itemContainer.scroll(0, 80 * idx);
}

// Check If Result iS Correct
function checkResult(isCorrectEquation) {
  // Start Timer when user press Button first time
  if (equationArrIndex === 0) startTimer();
  // Update Penalty Time
  penaltyTime += equationsArray[equationArrIndex].evaluated !== isCorrectEquation ? 0.5 : 0;

  equationArrIndex++;
  // Scroll To Next
  scrollToNextEquation(equationArrIndex);

  // When finish the test Stop Timer
  if (equationArrIndex > equationsArray.length - 1) {
    clearInterval(gameDurationInterval);
    totalTime = baseTime + penaltyTime;
    displayScorePage();
  }
}

function displayScorePage() {
  // Hide Game Page and Show Score Page
  gamePage.hidden = true;
  scorePage.hidden = false;

  // Update DOM
  finalTimeEl.textContent = totalTime + 's';
  baseTimeEl.textContent = `Base Time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty Time: +${penaltyTime}s`;

  // Update Best Score Value in LS and DOM

  const index = bestScoresObj.findIndex(entry => entry.questions === questionAmount);

  const bestScore = bestScoresObj[index].bestScore == 0.0 ? Infinity : bestScoresObj[index].bestScore;
  if (totalTime < bestScore) {
    // Update LS
    bestScoresObj[index].bestScore = totalTime;
    updateLS();
    // Update DOM
    const bestScoreEl = document.querySelector(`input[value="${questionAmount}"] + span .best-score-value`);
    bestScoreEl.textContent = totalTime + 's';
  }
}

// Reset Game
function resetGame() {
  //  Hide Score Page and Show Splash Page
  scorePage.hidden = true;
  splashPage.hidden = false;

  // Set Initial Values
  equationsArray.splice(0, questionAmount);
  equationArrIndex = 0;
  penaltyTime = 0;
  countdown.textContent = 3;
  removeSelectClass();
}

// Event Listeners
selectionContainer.addEventListener('click', addSelectClass);
startForm.addEventListener('submit', selectQuestionAmount);
rightBtn.addEventListener('click', () => checkResult(true));
wrongBtn.addEventListener('click', () => checkResult(false));
playAgainBtn.addEventListener('click', resetGame);
