const score = localStorage.getItem("examScore");
        const total = localStorage.getItem("totalQuestions");
        const percent = localStorage.getItem("percentage");

        const scoreText = document.getElementById("score");
        const percentageText = document.getElementById("percentage");

        scoreText.textContent = `Score: ${score} from ${total}`;
        percentageText.textContent = `Percentage: ${percent}%`;