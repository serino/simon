let button = document.getElementById("button");
let paragraph = document.getElementById("paragraph");

let squares = document.querySelectorAll(".square");

let audioCtx = new (window.AudioContext || window.webkitAudioContext || window.audioContext);

let computerSequence = [];

let indexOfComputerSequence;

let levelCounter = 1;

let userTry = false;

//TODO: Need to make userTry == true, right after the computerTurn has added selected to the last square.

const dictionary = {
  "square1": 330,
  "square2": 880,
  "square3": 554,
  "square4": 659
}

button.addEventListener("click", startGame);

for (let i = 0; i < squares.length; i++) {
  squares[i].addEventListener("click", userTurn);
}

function startGame() {
  // reset all variables
  button.style.display = "none";
  levelCounter = 1;
  computerSequence = [];

  //update levelHeader
  levelHeader.innerHTML = "Level " + levelCounter;

  // and then call the computerTurn function
  computerTurn();
}

function computerTurn() {

  levelHeader.innerHTML = "Level " + levelCounter;
  indexOfComputerSequence = 0;

  //computer picks 1 square, and adds it to the computerSequence array.
  let randomNumber = Math.floor(Math.random() * squares.length);

  computerSequence.push(squares[randomNumber]);

  // Replays existingSequence (sequence will contain the one just picked)
  // 1. setInterval (which is like a loop with a delay)
  // 2. use a loop, but setTimeouts with increasing delays
  for (let i = 0; i < computerSequence.length; i++) {
    setTimeout(addSelected, i * 1000, computerSequence[i]);
  }

  //500 for first square, then 1000 for each additional square
  // 1 square = 0.5 sec
  // 2 squares = 1.5 sec
  // 3 squares = 2.5 sec
  setTimeout(function() {userTry = true}, (computerSequence.length * 1000) - 500);

  levelCounter++;
}

function userTurn() {
  if (userTry == true) {
    //remove and replace opacity of square user has clicked on.
    addSelected(this);

    //checks to see if what user clicks on is the same as what exists in the computerSequence array.
    // this is a square object (ie div) that user clicked
    if (this == computerSequence[indexOfComputerSequence]) {
      //if userclicks on sames square as exists in the computerSequence array, then move to the next square in array.
      indexOfComputerSequence++;

      //if user makes it to end of the array correctly, then call computerTurn.
      if (indexOfComputerSequence == computerSequence.length) {
        levelHeader.innerHTML = "Correct!";
        userTry = false;
        setTimeout(computerTurn, 1500);
      }
    } else {
      levelHeader.innerHTML = "Sorry, you lose.";
      button.style.display = "block";
    }
  }
}

function addSelected(selectedSquare) {
  selectedSquare.classList.add("selected");
  beep(250, dictionary[selectedSquare.id]);

  setTimeout(removeSelected, 500, selectedSquare);
}

function removeSelected(selectedSquare) {
  selectedSquare.classList.remove("selected");
}

function beep(duration, frequency, volume, type, callback) {
  let oscillator = audioCtx.createOscillator();
  let gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  if (volume) { gainNode.gain.value = volume; }
  if (frequency) { oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime); }
  if (type) { oscillator.type = type; }
  if (callback) { oscillator.onended = callback; }

  oscillator.start();
  setTimeout(function () { oscillator.stop() }, (duration ? duration : 500));
}