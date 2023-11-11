const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");
const ball = document.getElementById("ball");
const view = document.querySelector(".View");
const viewRect = view.getBoundingClientRect();
const player1Rect = player1.getBoundingClientRect();
const player2Rect = player2.getBoundingClientRect();
const startButton = document.querySelector("#startbutton");
const restartButton = document.querySelector("#restartbutton")
const player1Keys = {};
const player2Keys = {};

let topPositonPlayer1 = 150;
let leftPositionPlayer1 = 100;
let topPositonPlayer2 = 150;
let leftPositionPlayer2 = 780;
let topPositionBall = 200;
let leftPositionBall = 400;
let ballDirectionX = -1;
let ballDirectionY = 0;
let step = 20;
let speedball = 4;
let start = true;

view.removeChild(player1);
view.removeChild(player2);
view.removeChild(ball);

const keys = {};

startButton.addEventListener("click", () => {
    start = !start;
    if (!start) {
        view.appendChild(player1);
        view.appendChild(player2);
        view.appendChild(ball);
        startButton.textContent = "Stop";
        player1.style.top = topPositonPlayer1 + "px";
        player1.style.left = leftPositionPlayer1 + "px";
        player2.style.top = topPositonPlayer2 + "px";
        player2.style.left = leftPositionPlayer2 + "px";
        ball.style.top = topPositionBall + "px";
        ball.style.left = leftPositionBall + "px";
        moverball();
    }
    else{
        startButton.textContent = "Start";
    }
});

restartButton.addEventListener("click", () => {
    topPositonPlayer1 = 150;
    leftPositionPlayer1 = 100;
    player1.style.top = 150 + "px";
    player1.style.left = 100 + "px";
    
    topPositonPlayer2 = 150;
    leftPositionPlayer2 = 780;
    player2.style.top = 150 + "px";
    player2.style.left = 780 + "px";

    topPositionBall = 200;
    leftPositionBall = 400;
    ball.style.top = topPositionBall + "px";
    ball.style.left = leftPositionBall + "px";
})

document.addEventListener("keydown", (event) => {
    if (!start) {
        if (event.key === "w") player1Keys.up = true;
        if (event.key === "s") player1Keys.down = true;
        // if (event.key === "a") player1Keys.left = true;
        // if (event.key === "d") player1Keys.right = true;

        if (event.key === "ArrowUp") player2Keys.up = true;
        if (event.key === "ArrowDown") player2Keys.down = true;
        // if (event.key === "j") player2Keys.left = true;
        // if (event.key === "l") player2Keys.right = true;

        moverPlayers();
    }
});

document.addEventListener("keyup", (event) => {
    if (!start) {
        if (event.key === "w") player1Keys.up = false;
        if (event.key === "s") player1Keys.down = false;
        // if (event.key === "a") player1Keys.left = false;
        // if (event.key === "d") player1Keys.right = false;

        if (event.key === "ArrowUp") player2Keys.up = false;
        if (event.key === "ArrowDown") player2Keys.down = false;
        // if (event.key === "j") player2Keys.left = false;
        // if (event.key === "l") player2Keys.right = false;

        moverPlayers();
    }
});

function moverPlayers() {
    if (player1Keys.up) moverPlayer1(-step, 0);
    if (player1Keys.down) moverPlayer1(step, 0);
    // if (player1Keys.left) moverPlayer1(0, -step);
    // if (player1Keys.right) moverPlayer1(0, step);

    if (player2Keys.up) moverPlayer2(-step, 0);
    if (player2Keys.down) moverPlayer2(step, 0);
    // if (player2Keys.left) moverPlayer2(0, -step);
    // if (player2Keys.right) moverPlayer2(0, step);
}

function moverPlayer1(topChange, leftChange) {
    const newTop = topPositonPlayer1 + topChange;
    const newLeft = leftPositionPlayer1 + leftChange;

    if (
        newTop >= 0 &&
        newLeft >= 0 &&
        newTop + player1Rect.height <= viewRect.height &&
        newLeft + player1Rect.width <= viewRect.width
    ) {
        topPositonPlayer1 = newTop;
        leftPositionPlayer1 = newLeft;

        player1.style.top = topPositonPlayer1 + "px";
        player1.style.left = leftPositionPlayer1 + "px";
    }
}

function moverPlayer2(topChange, leftChange) {
    const newTop = topPositonPlayer2 + topChange;
    const newLeft = leftPositionPlayer2 + leftChange;

    if (
        newTop >= 0 &&
        newLeft >= 0 &&
        newTop + player2Rect.height <= viewRect.height &&
        newLeft + player2Rect.width <= viewRect.width
    ) {
        topPositonPlayer2 = newTop;
        leftPositionPlayer2 = newLeft;

        player2.style.top = topPositonPlayer2 + "px";
        player2.style.left = leftPositionPlayer2 + "px";
    }
}
function moverball() {
    setInterval(function () {

        leftPositionBall += speedball * ballDirectionX;
        topPositionBall += speedball * ballDirectionY;
        ball.style.left = leftPositionBall + "px";
        ball.style.top = topPositionBall + "px";

        checkCollision();

        if (leftPositionBall <= 0 || leftPositionBall >= viewRect.width - ball.offsetWidth) {
            ballDirectionX *= -1; 
        }

        if (topPositionBall <= 1 || topPositionBall >= viewRect.height - ball.offsetHeight) {
            ballDirectionY *= -1; 
        }
    }, 25);
}

function checkCollision() {
    const ballRect = ball.getBoundingClientRect();
    const player1Rect = player1.getBoundingClientRect();
    const player2Rect = player2.getBoundingClientRect();

    if (
        ballRect.right >= player1Rect.left &&
        ballRect.left <= player1Rect.right &&
        ballRect.bottom >= player1Rect.top &&
        ballRect.top <= player1Rect.bottom
    ) {
        if (ballRect.left < player1Rect.right + (player1Rect.height / 3)) {
            ballDirectionY = getRandomValueY();
            ballDirectionX *= -1;
        } 
        else if (ballRect.left > player1Rect.right - (player1Rect.height / 3)) {
            ballDirectionY = -1 * getRandomValueY();
            ballDirectionX *= -1;
        } 
        else {
            ballDirectionY = 0;
            ballDirectionX *= -1; 
        }

        speedsControl();
    }

    if (
        ballRect.right >= player2Rect.left &&
        ballRect.left <= player2Rect.right &&
        ballRect.bottom >= player2Rect.top &&
        ballRect.top <= player2Rect.bottom
    ) {
        if (ballRect.right < player2Rect.left + (player2Rect.height / 3)) {
            ballDirectionY = getRandomValueY();
            ballDirectionX *= -1;
        } 
        else if (ballRect.right > player2Rect.left - (player2Rect.height / 3)) {            
            ballDirectionY = -1 * getRandomValueY();
            ballDirectionX *= -1;
        } 
        else {           
            ballDirectionY = 0;
            ballDirectionX *= -1; 
        }

        speedsControl();
    }
}

function speedsControl(){
    if(speedball <= 9){
        speedball += 1;
    }
    else{
        speedball -= 1;
    }
}
function getRandomValueY() {
    return Math.random() * 2;
}