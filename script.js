const display = document.getElementById("display");
const question = document.getElementById("question");
const startBtn = document.getElementById("start");
const countdownOverlay = document.getElementById("countdown");
const resultModal = document.getElementById("result");
const modalBackground = document.getElementById("modal-background");

// Variables---------------
let userText = "";
let errorCount = 0;
let startTime;
let questionText = "";

// Load and display question-------------
fetch("./texts.json")
  .then((res) => res.json())
  .then((data) => {
    questionText = data[Math.floor(Math.random() * data.length)];
    question.innerHTML = questionText;
  });

// Checks the user typed character and displays accordingly
const typeController = (e) => {
  const newLetter = e.key;

  // Handle backspace press
  if (newLetter == "Backspace") {
    userText = userText.slice(0, userText.length - 1);
    return display.removeChild(display.lastChild);
  }

  // These are the valid character we are allowing to type---------
  const validLetters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890!@#$%^&*()_+-={}[]'\".,?";

  // If it is not a valid character like Control/Alt then skip displaying anything
  if (!validLetters.includes(newLetter)) {
    return;
  }

  userText += newLetter;

  const newLetterCorrect = validate(newLetter);

  if (newLetterCorrect) {
    display.innerHTML += `<span class="green">${newLetter === " " ? "▪" : newLetter}</span>`;
  } else {
    display.innerHTML += `<span class="red">${newLetter === " " ? "▪" : newLetter}</span>`;
  }

  // Check if given question text is equal to user typed text------------------
  if (questionText === userText) {
    gameOver();
  }
};

const validate = (key) => {
  if (key === questionText[userText.length - 1]) {
    return true;
  }
  errorCount++;
  return false;
};

// -------------FINISHED TYPING----------------
const gameOver = () => {
  document.removeEventListener("keydown", typeController);

  // the current time is the finish time
  // so total time taken is current time - start time
  const finishTime = new Date().getTime();
  const timeTaken = parseInt((finishTime - startTime) / 1000);
  const wpm = (userText.length * timeTaken) / 60;


  // Show result modal--------------
  resultModal.innerHTML = "";
  resultModal.classList.toggle("hidden");
  modalBackground.classList.toggle("hidden");

  // Clear user text------------
  display.innerHTML = "";

  // Make it Inactive-------------
  display.classList.add("inactive");

  // Show Result-----------------
  resultModal.innerHTML += `
    <h1>Finished!</h1>
    <p>You took: <span class="bold">${timeTaken}</span> seconds</p>
    <p>You made <span class="bold red">${errorCount++}</span> mistakes</p>
    <p>Typing speed : <span class="bold green">${wpm.toFixed(0)}</span></p>
    <button onclick="closeModal()">Close</button>
  `;

  addHistory(questionText, timeTaken, errorCount, wpm);

  // Restart Everything-------------
  startTime = null;
  errorCount = 0;
  userText = "";
  display.classList.add("inactive");
};

const closeModal = () => {
  modalBackground.classList.toggle("hidden");
  resultModal.classList.toggle("hidden");
};

const start = () => {
  // If already started, Do not start again----------------
  if (startTime) return;

  let count = 3;
  countdownOverlay.style.display = "flex";

  const startCountdown = setInterval(() => {
    countdownOverlay.innerHTML = `<h1>${count}</h1>`;

    // Finished timer---------
    if (count == 0) {
      // ------------ START TYPING ---------------
      document.addEventListener("keydown", typeController);
      countdownOverlay.style.display = "none";
      display.classList.remove("inactive");

      clearInterval(startCountdown);
      startTime = new Date().getTime();
    }
    count--;
  }, 1000);
};

// START Countdown Option---------
startBtn.addEventListener("click", start);

// If history exists, show it there
displayHistory();

// Showing typing time spent
setInterval(() => {
  const currentTime = new Date().getTime();
  const timeSpent = (currentTime - startTime) / 1000;


  document.getElementById("show-time").innerHTML = `${startTime ? parseInt(timeSpent) : 0} seconds`;
}, 1000);
