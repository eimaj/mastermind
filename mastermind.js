const restartButton = document.getElementById('restart');
const highscoreCanvas = document.getElementById('highscore');
const notificationCanvas = document.getElementById('notification');
const resultsCanvas = document.getElementById('results');
const guessInput = document.getElementById('guess');

let guess = '';
let guessCount = 0;
let highscore = 100;
let resultArray = [];
let secret = [];
let secretArray = [];

// User notification:
const postToNotification = (message = '') => {
  notificationCanvas.innerText = message;
}

// User notification:
const postHighscore = () => {
  document.cookie = `eimaj_mastermind_highscore=${highscore}`;
  highscoreCanvas.innerText = `High Score: ${highscore}`;
}

// Append result for user:
const postToResult = result => {
  resultsCanvas.innerHTML = `${result}<br />${ resultsCanvas.innerHTML}`;
}

// Clear the result block:
const clearResult = () => {
  resultsCanvas.innerHTML = '';
}

// Clear the input:
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

// Calculate and save the high score:
const calcualateHighScore = (guessCount = 0) => {
  if (highscore > 99 && !guessCount) {
    // Check for the cookie:
    const cookieRegex = /(?:(?:^|.*;\s*)eimaj_mastermind_highscore\s*\=\s*([^;]*).*$)|^.*$/;
    const cookie = parseInt(document.cookie.replace(cookieRegex, "$1"), 10);

    if (cookie && highscore < 100) {
      highscore = cookie;
      return postHighscore();
    }
  }

  if (guessCount < highscore && guessCount > 0) {
    highscore = guessCount;
    return postHighscore();
  }

  return false;
}

// Winning message for user & high score:
const youWin = () => {
  guessInput.disabled = true;
  calcualateHighScore(guessCount);
  return postToNotification(`You won in ${guessCount} guesses!`);
}

// Let the user know how many guesses they've had:
const guessAgain = () => {
  postToNotification(`${guessCount} guesses so far.`);
}

// Do all the things with the result:
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

// Make sure they key pressed is 1 to 6 and let the user know:
const checkCharValidity = char => {
  const integer = parseInt(char, 10);

  // If the char is valid, return it:
  if (integer && integer > 0 && integer < 7) { return char; }

  // Notify the player and return nothing:
  postToNotification('That was not a valid character.')
  return '';
}

// Filter out all invalid chars:
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

// Create new secret:
const createSecret = () => {
  const a = Math.floor(Math.random() * 6) + 1;
  const b = Math.floor(Math.random() * 6) + 1;
  const c = Math.floor(Math.random() * 6) + 1;
  const d = Math.floor(Math.random() * 6) + 1;

  return [a, b, c, d];
}

// Reset game:
const reset = event => {
  postToNotification('');
  clearInput();
  clearResult();
  guessCount = 0;
  secret = createSecret();
  guessInput.disabled = false;
  return guessInput.focus();
}

// Start the game:
const init = () => {
  guessInput.addEventListener('keyup', validateGuess);
  restartButton.addEventListener('click', reset);
  calcualateHighScore();
  return reset();
}

init();
