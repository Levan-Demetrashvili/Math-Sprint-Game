import shuffle from './shuffle.js';

let firstNumber = 0;
let secondNumber = 0;
const wrongFormat = [];
let equationObject = {};

let equationsArray = [];

function generateRandomNumber(start, end) {
  return Math.trunc(Math.random() * (end - start + 1)) + start;
}

// Create Correct/Incorrect Random Equations
function createEquations(questionAmount) {
  // Randomly choose how many correct equations there should be
  const correctEquations = generateRandomNumber(0, questionAmount);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = generateRandomNumber(0, 9);
    secondNumber = generateRandomNumber(0, 9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: true };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = generateRandomNumber(0, 9);
    secondNumber = generateRandomNumber(0, 9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = generateRandomNumber(0, wrongFormat.length - 1);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: false };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}

export { createEquations, equationsArray };
