let timeLeft = 120;

const flagBtn = document.getElementById('flag-btn')
const submitBtn = document.getElementById('sub-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const _timer = document.getElementById('timer');
const countDown = setInterval(() => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  _timer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  if (timeLeft === 30) {
    _timer.style.color = 'red';
  }
  timeLeft--;
  if (timeLeft < 0) {
    clearInterval(countDown);
    location.replace("../html/timeOut.html");
  }
}, 1000);

let currentQuestionIndex = 0;
let questions = [];
let userAnswers = [];
const flaggedQuestions = new Set();

function shuffleArray(data) {
  let currentIndex = data.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [data[currentIndex], data[randomIndex]] = [
      data[randomIndex],
      data[currentIndex],
    ];
  }

  return data;
}

async function promises() {
  try {
    let response = await fetch("../json/data.json");
    let data = await response.json();
    questions = shuffleArray(data);
    userAnswers = new Array(questions.length).fill(null);
    displayQuestions();
  } catch (e) {
    alert('Error loading questions. Please refresh the page.');
  }
}

function displayQuestions() {
  const container = document.getElementById("exam-container");
  container.innerHTML = " ";
  if (currentQuestionIndex === questions.length - 1) {
    nextBtn.disabled = true;
  } else {
    nextBtn.disabled = false;
  }
  if (currentQuestionIndex === 0) {
    prevBtn.disabled = true;
  } else {
    prevBtn.disabled = false;
  }

  const q = questions[currentQuestionIndex];
  const questionDiv = document.createElement("div");
  questionDiv.classList.add("question-block");
  const questionTitle = `<p><strong>Question ${currentQuestionIndex + 1
    }:</strong> ${q.question}</p>`;
  const choiceHtml = q.choices
    .map((choice) => {
      return `<label>
        <input type="radio" name="q${currentQuestionIndex}" value="${choice}"
        ${userAnswers[currentQuestionIndex] === choice ? "checked" : ""}>
        ${choice}
        </label><br>`;
    })
    .join("");

  questionDiv.innerHTML = questionTitle + choiceHtml;
  container.appendChild(questionDiv);

  document
    .querySelectorAll(`input[name="q${currentQuestionIndex}"]`)
    .forEach((input) => {
      input.addEventListener("change", (e) => {
        userAnswers[currentQuestionIndex] = e.target.value;
        if (userAnswers.every(ans => ans !== null)) {
          submitBtn.disabled = false;
        } else {
          submitBtn.disabled = true;
        }
      });
    });
  updateFlaggedQuestionsList();
}

flagBtn.addEventListener('click', () => {
  if (flaggedQuestions.has(currentQuestionIndex)) {
    flaggedQuestions.delete(currentQuestionIndex);
    flagBtn.style.background = '#fff';
    flagBtn.querySelector('i').style.color = 'var(--primary-color)';
    showNotification('Question unflagged', 'var(--primary-color)');
  } else {
    flaggedQuestions.add(currentQuestionIndex);
    flagBtn.style.background = 'var(--danger-color)';
    flagBtn.querySelector('i').style.color = 'white';
    showNotification('Question flagged', 'var(--danger-color)');
  }

  updateFlaggedQuestionsList();
});
function updateFlaggedQuestionsList() {
  let flaggedList = document.getElementById('flagged-questions');
  if (!flaggedList) {
    flaggedList = document.createElement('div');
    flaggedList.id = 'flagged-questions';
    document.body.appendChild(flaggedList);
  }

  if (flaggedQuestions.size > 0) {
    flaggedList.innerHTML = `
      <h3>
        <i class="fas fa-flag"></i> Flagged Questions
      </h3>
      <div>
        ${Array.from(flaggedQuestions).map(index => `
          <button onclick="goToQuestion(${index})" 
                  class="${currentQuestionIndex === index ? 'active' : ''}">
            <i class="fas fa-question-circle"></i>
            Question ${index + 1}
          </button>
        `).join('')}
      </div>
    `;
    flaggedList.style.display = 'block';
  } 
  else {
    flaggedList.style.display = 'none';
  }
}
//////////////////////
function goToQuestion(index) {
  currentQuestionIndex = index;
  displayQuestions();
  updateFlaggedQuestionsList();
}

function showNotification(message, color) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 70px;
    left: 20px;
    background: ${color};
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    z-index: 1000;
    animation: fadeIn 0.3s ease;
  `;
  notification.innerHTML = `<i class="fas fa-flag"></i> ${message}`;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}


// ////////////////////

document.getElementById("next-btn").addEventListener("click", () => {
  currentQuestionIndex++;
  displayQuestions();
  console.log(currentQuestionIndex);
});
document.getElementById("prev-btn").addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestions();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  promises();
});

function calculateScore() {
  let score = 0;
  questions.forEach((q, index) => {
    if (userAnswers[index] === q.correctAnswer) {
      score++;
    }
  })
  return score;
}

document.getElementById("sub-btn").addEventListener("click", function () {
  const score = calculateScore();
  const percentage = Math.round((score / questions.length * 100));

  localStorage.setItem("examScore", score);
  localStorage.setItem("totalQuestions", questions.length);
  localStorage.setItem("percentage", percentage);

  clearInterval(countDown);


  if (percentage >= 50) {
    location.replace("../html/sucess.html");
  } else {
    location.replace("../html/failed.html")
  }


});
/***************************************** */
function enterFullscreen() {
  const element = document.documentElement;
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

function preventAllKeys(e) {
  const isFullscreen = document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement;

  if (e.key === 'Escape' && isFullscreen) {
    e.preventDefault();
    const modal = document.getElementById('confirmExitModal');
    modal.style.display = 'flex';
  }
}

function startQuiz() {
  document.getElementById('startScreen').style.display = 'none';
  document.querySelector('.exam-container').style.display = 'block';

  enterFullscreen();

  document.addEventListener('keydown', preventAllKeys);

  document.getElementById('cancelExitBtn').addEventListener('click', () => {
    document.getElementById('confirmExitModal').style.display = 'none';
  });

  document.getElementById('confirmExitBtn').addEventListener('click', () => {
    finishQuiz();
  });
}
function finishQuiz() {
  document.removeEventListener('keydown', preventAllKeys);

  document.getElementById('confirmExitModal').style.display = 'none';

  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}
function handleKeyPress(e) {
  if (document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement) {

    if (e.key === 'Escape' || e.keyCode === 27) {
      e.preventDefault();
      e.stopPropagation();

      endQuiz();


      return false;
    }
  }
}

document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

function handleFullscreenChange() {
  if (
    !document.fullscreenElement &&
    !document.webkitFullscreenElement &&
    !document.mozFullScreenElement &&
    !document.msFullscreenElement
  ) {

    document.getElementById('confirmExitModal').style.display = 'flex';
  }
}

document.getElementById('confirmExitBtn').addEventListener('click', () => {
  endQuiz();
});

  document.getElementById('cancelExitBtn').addEventListener('click', () => {
  document.getElementById('confirmExitModal').style.display = 'none';
  enterFullscreen();
});

document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

document.getElementById('startButton').addEventListener('click', startQuiz);

function endQuiz() {
  const score = calculateScore();
  const percentage = Math.round((score / questions.length * 100));

  localStorage.setItem("examScore", score);
  localStorage.setItem("totalQuestions", questions.length);
  localStorage.setItem("percentage", percentage);

  clearInterval(countDown);

  document.removeEventListener('keydown', preventAllKeys);

  document.getElementById('confirmExitModal').style.display = 'none';

  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }

  if (percentage >= 50) {
    location.replace("../html/sucess.html");
  } else {
    location.replace("../html/failed.html");
  }
}

