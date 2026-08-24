let mario = document.querySelector(".mario")
let obstacle = document.querySelector(".obstacle")
let gameOverBox = document.querySelector(".game-over")
let button = document.querySelector("button")
let scoreText = document.querySelector(".score")
let message = document.querySelector(".message");
let finalScore = document.querySelector(".final-score");
let startMessage = document.querySelector(".start-message");
let gameRunning = true
let marioX = 50
let marioY = 0
let obstacleX = 900
let score = 0
let isjumping = false
let highScore = localStorage.getItem("marioHighScore") || 0;
let isPaused = false;

document.addEventListener("keydown", (e) => {
    if (gameRunning === false) {
        return
    }
    if (e.key === "Enter" && gameRunning === false) {
        button.click();
    }
    if (e.key == "d" || e.key === "ArrowRight") {
        marioX = marioX + 10
        if (marioX > 750) {
            marioX = 750
        }
        mario.style.left = marioX + "px"
    }
    if (e.key == "a" || e.key === "ArrowLeft") {
        marioX = marioX - 10
        if (marioX < 0) {
            marioX = 0
        }
        mario.style.left = marioX + "px"
    }
    if (e.key === " " ||
        e.key === "w" ||
        e.key === "ArrowUp"
    ) {
        jump();
    }
    if (e.key === "p") {
        isPaused = !isPaused;

        document.querySelector(".pause-message").style.display =
            isPaused ? "block" : "none";

        return;
    }
    startMessage.style.display = "none";

    function jump() {
        if (isjumping === true) {
            return
        }
        isjumping = true
        mario.classList.add("jumping");

        let jumpUp = setInterval(() => {
            marioY = marioY + 10
            mario.style.bottom = marioY + "px"

            if (marioY >= 130) {
                clearInterval(jumpUp)

                let jumpDown = setInterval(() => {
                    marioY = marioY - 10
                    mario.style.bottom = marioY + "px"
                    if (marioY <= 0) {
                        marioY = 0
                        mario.style.bottom = "0px"
                        clearInterval(jumpDown)
                        isjumping = false
                        mario.classList.remove("jumping");
                    }
                }, 20);
            }
        }, 20);
    }

})

//game loop

let gameLoop = setInterval(function () {
    if (gameRunning === false || isPaused === true) {
        return;
    }
    let obstacleSpeed = 5 + Math.floor(score / 5);

    obstacleX = obstacleX - obstacleSpeed;
    obstacle.style.left = obstacleX + "px"

    if (obstacleX < -40) {
        obstacleX = 800
        score++
    }
    scoreText.innerHTML = "Score: " + score + " | High Score: " + highScore
    if (score > 0 && score % 5 === 0) {
        message.innerHTML = "Great!";
    } else {
        message.innerHTML = "";
    }

    let marioBox = mario.getBoundingClientRect()
    let obstacleBox = obstacle.getBoundingClientRect()

    let isCollision = !(
        marioBox.right < obstacleBox.left ||
        marioBox.left > obstacleBox.right ||
        marioBox.bottom < obstacleBox.top ||
        marioBox.top > obstacleBox.bottom
    )

    if (isCollision) {
        gameover()
    }
}, 10);

button.addEventListener("click", () => {
    resetGame();
})

// game over function
function gameover() {
    gameRunning = false

    gameOverBox.style.display = "flex"
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("marioHighScore", highScore);
    }
    finalScore.innerHTML = "Final Score: " + score;
};
function resetGame() {
    gameRunning = true;
    isPaused = false;

    obstacleX = 900;
    score = 0;
    marioX = 50;
    marioY = 0;

    mario.style.left = marioX + "px";
    mario.style.bottom = marioY + "px";

    obstacle.style.left = obstacleX + "px";

    gameOverBox.style.display = "none";

    document.querySelector(".pause-message").style.display = "none";

    scoreText.innerHTML =
        "Score: " + score + " | High Score: " + highScore;
}