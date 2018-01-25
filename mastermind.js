const restartButton = document.getElementById('restart');
const notificationCanvas = document.getElementById('notification');
const resultsCanvas = document.getElementById('results');
const guessInput = document.getElementById('guess');
const secret = [1, 2, 3, 4];

let guess = '';
let guessCount = 0;
let results = [];

const postNotification = (message = '') => {
  notificationCanvas.innerText = message;
}

const postResult = result => {
  resultsCanvas.innerHTML = `${result}<br />${ resultsCanvas.innerHTML}`;
}

const checkResult = guess => {
  const secretArray = [...secret];
  let guessArray = guess.split('').map(number => parseInt(number, 10));

  if (guessArray.length !== 4) { return false; }

  // Clear input:
  guessInput.value = '';
  guessCount += 1;

  const resultGuess = `You guessed ${guess}`;

  const resultArray = [];

  guessArray
    .map((number, i) => {

        // Match location and value:
        if (number === secretArray[i]) {
          secretArray[i] = '-';
          resultArray.push('x');
          return 0;
        }

        return number;
      })
      .map((number, i) => {

        // Match location and value:
        if (secretArray.findIndex(secret => secret === number) >= 0) {
          const index = secretArray.findIndex(secret => secret === number);
          secretArray[index] = '-';
          resultArray.push('o');
          return 0;
        }

        return number;
      });

  if (resultArray.join('') === 'xxxx') {
    postNotification(`You won in ${guessCount} guesses!`);
  }

  return postResult(`${resultGuess} -- Results: ${resultArray}`);
}

const checkCharValidity = char => {
  const integer = parseInt(char, 10);

  // If the char is valid, return it:
  if (integer && integer > 0 && integer < 7) { return char; }

  // Notify the player and return nothing:
  postNotification('That was not a valid guess')
  return '';
}

const checkGuessValidity = value => {
  // Send back the valid characters in the response:
  return value.split('').map(checkCharValidity).join('');
}

// Check the input and compare if complete:
const validateGuess = event =>  {
  // Clear notifications:
  postNotification();

  const { value } = event.currentTarget;
  const validGuess = checkGuessValidity(value);

  // Replace input with valid guess:
  event.currentTarget.value = validGuess;

  return checkResult(validGuess);
}

// Reset game and add listenters:
const restart = event => {
  event.preventDefault();
  guessInput.value = '';
}

// Start the game:
const init = () => {

  guessInput.focus();
  guessInput.addEventListener('keyup', validateGuess);
  restartButton.addEventListener('click', restart);
}

init();
