const score = localStorage.getItem("examScore");
      const total = localStorage.getItem("totalQuestions");
      const percent = localStorage.getItem("percentage");

      const resultHeading = document.getElementById("result-heading");
      const scoreText = document.getElementById("score");
      const percentageText = document.getElementById("percentage");

      resultHeading.textContent = "Congrats!";
        resultHeading.style.color = "green"; 

      scoreText.textContent = `score:${score} from ${total}`;
      percentageText.textContent = `Percentage: ${percent}%`;

      document.getElementById("try-again-btn").addEventListener("click", function(){
    location.replace("../html/ques.html");   
       })
     document.getElementById("home-btn").addEventListener("click", function(){
    location.replace("../index.html");
           })
