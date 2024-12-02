//Select DOM Elements
var startButtonEl = document.getElementById("start");
var timerEl = document.getElementById("time");
var startScreenEl = document.getElementById("start-screen");
var endScreenEl = document.getElementById("end-screen");
var questionsEl = document.getElementById("questions");
var feedbackEl = document.getElementById("feedback");
var submitButtonEl = document.getElementById("submit");
var initialsInputEl = document.getElementById("initials");

//quiz state variables
var currentQuestionIndex = 0;
var timeLeft = 60;
var timeInterval;

//questions array
const questions = [
  {
    title: "What does HTML stand for?",
    choices: ["Hyper Text Markup Language", "Hot Mail", "How To Make Links"],
    answer: "Hyper Text Markup Language",
  },
  {
    title: "What symbol is used for comments in JavaScript?",
    choices: ["//", "/* */", "<!-- -->", "#"],
    answer: "//",
  },
  {
    title: "Which company developed JavaScript?",
    choices: ["Microsoft", "Netscape", "Google", "IBM"],
    answer: "Netscape",
  },
];

//start quiz function
function startQuiz() {
  //hide the start screen
  startScreenEl.setAttribute("class", "hide");

  //un-hide questions section
  questionsEl.removeAttribute("class");

  //start the timer
  timeInterval = setInterval(startTimer, 1000);

  //Display the first question
  showQuestion();
}

function startTimer() {
  timeLeft--;
  timerEl.textContent = timeLeft;

  //end the quiz if time runs out
  if (timeLeft <= 0) {
    clearInterval(timeInterval);
    endQuiz();
  }
}

function showQuestion() {
  //clear previous choices
  var choicesContainer = document.getElementById("choices");
  choicesContainer.innerHTML = "";

  //get the current question index
  var currentQuestion = questions[currentQuestionIndex];

  //Display the Question title
  var questionTitle = document.getElementById("question-title");
  questionTitle.textContent = currentQuestion.title;

  // Create a button for each choice
  for (var i = 0; i < currentQuestion.choices.length; i++) {
    var choice = currentQuestion.choices[i];

    // Create button element
    var button = document.createElement("button");
    button.textContent = choice;
    button.setAttribute("class", "choice");

    // Add click event listener with correct scope
    button.addEventListener(
      "click",
      (function (selectedChoice) {
        return function () {
          handleChoice(selectedChoice);
        };
      })(choice)
    );

    // Append button to the choices container
    choicesContainer.appendChild(button);
  }
}

function handleChoice(choice) {
  var currentQuestion = questions[currentQuestionIndex];

  if (choice === currentQuestion.answer) {
    showFeedback("Correct", true);
  } else {
    showFeedback("Wrong!", false);
    // Penalize for incorrect answer
    timeLeft -= 10;
    if (timeLeft < 0) timeLeft = 0;
    timerEl.textContent = timeLeft;
  }

  // Move to the next question or end the quiz
  currentQuestionIndex++;
  if (currentQuestionIndex >= questions.length) {
    endQuiz();
  } else {
    showQuestion();
  }
}

function showFeedback(message, isCorrect) {
  feedbackEl.textContent = message;
  feedbackEl.classList.remove("hide");
  feedbackEl.style.color = isCorrect ? "green" : "red";

  // Hide feedback after 1 second
  setTimeout(() => {
    feedbackEl.classList.add("hide");
  }, 1000);
}

function saveHighscore() {
  // Get the user's initials and final score
  var initials = initialsInputEl.value.trim();
  var finalScore = timeLeft > 0 ? timeLeft : 0;

  // Validate initials input
  if (initials === "") {
    alert("Please enter your initials!");
    return;
  }

  // Get existing highscores from local storage or initialize an empty array
  var highscores = JSON.parse(localStorage.getItem("highscores")) || [];

  // Create a new score object
  var newScore = {
    initials: initials,
    score: finalScore,
  };

  // Add the new score to the highscores array
  highscores.push(newScore);

  // Save the updated highscores array to local storage
  localStorage.setItem("highscores", JSON.stringify(highscores));

  // Redirect to highscores page or show a message
  window.location.href = "highscores.html";
}

function endQuiz() {
  //stop the timer
  clearInterval(timeInterval);

  //hide the questions screen
  questionsEl.setAttribute("class", "hide");

  //show the end screen
  endScreenEl.removeAttribute("class");

  // Display final score (placeholder logic for now)
  var finalScoreEl = document.getElementById("final-score");
  finalScoreEl.textContent = timeLeft;
}

// Event listener for Start Quiz button
startButtonEl.addEventListener("click", startQuiz);
submitButtonEl.addEventListener("click", function () {
  saveHighscore();
});
