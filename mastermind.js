const restartButton = document.getElementById('restart');
const notificationCanvas = document.getElementById('notification');
const resultsCanvas = document.getElementById('results');
const guessInput = document.getElementById('guess');
const secret = [1, 2, 3, 4];

let guess = '';
let guessCount = 0;
let resultArray = [];
let secretArray = [];

const postToNotification = (message = '') => {
  notificationCanvas.innerText = message;
}

const postToResult = result => {
  resultsCanvas.innerHTML = `${result}<br />${ resultsCanvas.innerHTML}`;
}

const clearResult = () => {
  resultsCanvas.innerHTML = '';
}

const clearInput = () => {
  guessInput.value = '';
}

// Match location and value:
const checkCorrectLocation = (number, i) => {
  if (number === secretArray[i]) {
    secretArray[i] = '-';
    resultArray.push('x');
    return 0;
  }

  return number;
}

// Match location and value:
const checkCorrectValue = (number, i) => {
  if (secretArray.findIndex(secret => secret === number) >= 0) {
    const index = secretArray.findIndex(secret => secret === number);
    secretArray[index] = '-';
    resultArray.push('o');
    return 0;
  }

  return number;
}

const youWin = () => {
  guessInput.disabled = true;
  return postToNotification(`You won in ${guessCount} guesses!`);
}

const guessAgain = () => {
  postToNotification(`${guessCount} guesses so far.`);
}

const checkResult = guess => {
  let guessArray = guess.split('').slice(0, 4).map(number => parseInt(number, 10));

  if (guessArray.length < 4) { return false; }

  // Clear input:
  clearInput();
  guessCount += 1;

  const resultGuess = `${guessArray.join('')}`;
  resultArray = [];
  secretArray = [...secret];

  guessArray
    .map(checkCorrectLocation)
    .map(checkCorrectValue);

  postToResult(`${resultGuess} [${resultArray}]`);

  if (resultArray.join('') === 'xxxx') { return youWin(); }

  return guessAgain();
}

const checkCharValidity = char => {
  const integer = parseInt(char, 10);

  // If the char is valid, return it:
  if (integer && integer > 0 && integer < 7) { return char; }

  // Notify the player and return nothing:
  postToNotification('That was not a valid character.')
  return '';
}

const checkGuessValidity = value => {
  // Send back the valid characters in the response:
  return value.split('').map(checkCharValidity).join('');
}

// Check the input and compare if complete:
const validateGuess = event =>  {
  const { value } = event.currentTarget;
  const validGuess = checkGuessValidity(value);

  // Replace input with valid guess:
  event.currentTarget.value = validGuess;

  return checkResult(validGuess);
}

// Reset game:
const reset = event => {
  postToNotification('');
  clearInput();
  clearResult();
  guessCount = 0;
  guessInput.disabled = false;
  return guessInput.focus();
}

// Start the game:
const init = () => {
  guessInput.focus();
  guessInput.addEventListener('keyup', validateGuess);
  restartButton.addEventListener('click', reset);
}

init();
