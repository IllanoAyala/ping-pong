const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");
const ball = document.getElementById("ball");
const view = document.querySelector(".View");
const viewRect = view.getBoundingClientRect();
const player1Rect = player1.getBoundingClientRect();
const player2Rect = player2.getBoundingClientRect();
const startButton = document.getElementById("startbutton");
const restartButton = document.getElementById("restartbutton")
const player1Keys = {};
const player2Keys = {};

let animationId;
let topPositonPlayer1 = 150;
let leftPositionPlayer1 = 100;
let topPositonPlayer2 = 150;
let leftPositionPlayer2 = 780;
let topPositionBall = 200;
let leftPositionBall = 400;
let ballDirectionX = -1;
let ballDirectionY = 0;
let step = 7;
let speedball = 3;
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
        
        setInterval(function(){ //melhorar 
            if(speedball <= 7)
            {
                speedball += 1;
                // transitionColor();
            }
            else{
                
            }
        }, 3000);

    }
    else{
        location.reload();
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
    speedball = 3;
    ballDirectionX = -1;
    ballDirectionY = 0;
    ball.style.top = topPositionBall + "px";
    ball.style.left = leftPositionBall + "px";
})

document.addEventListener("keydown", (event) => {
    if (!start) {
        if (event.key === "w") player1Keys.up = true;
        if (event.key === "s") player1Keys.down = true;

        if (event.key === "ArrowUp") player2Keys.up = true;
        if (event.key === "ArrowDown") player2Keys.down = true;

        if (!animationId) {
            animationId = requestAnimationFrame(moverPlayers);
        }
    }
});

document.addEventListener("keyup", (event) => {
    if (!start) {
        if (event.key === "w") player1Keys.up = false;
        if (event.key === "s") player1Keys.down = false;

        if (event.key === "ArrowUp") player2Keys.up = false;
        if (event.key === "ArrowDown") player2Keys.down = false;
    }
});

function moverPlayers() {
    if (player1Keys.up) moverPlayer1(-step);
    if (player1Keys.down) moverPlayer1(step);

    if (player2Keys.up) moverPlayer2(-step);
    if (player2Keys.down) moverPlayer2(step);

    animationId = requestAnimationFrame(moverPlayers);
}

function moverPlayer1(topChange) {
    const newTop = topPositonPlayer1 + topChange;

    if (newTop >= 0 && newTop + player1Rect.height <= viewRect.height) {
        topPositonPlayer1 = newTop;
        player1.style.top = topPositonPlayer1 + "px";
    }
}

function moverPlayer2(topChange) {
    const newTop = topPositonPlayer2 + topChange;

    if (newTop >= 0 && newTop + player2Rect.height <= viewRect.height) {
        topPositonPlayer2 = newTop;
        player2.style.top = topPositonPlayer2 + "px";
    }
}

function moverball() {
    function animate() {
        leftPositionBall += speedball * ballDirectionX;
        topPositionBall += speedball * ballDirectionY;
        ball.style.left = leftPositionBall + "px";
        ball.style.top = topPositionBall + "px";

        checkCollision();

        if (leftPositionBall <= 0 || leftPositionBall >= viewRect.width - ball.offsetWidth) {
            ballDirectionX *= -1;

            if (leftPositionBall <= 0) {
                console.log("1");
            } else if (leftPositionBall >= viewRect.width - ball.offsetWidth) {
                console.log("2"); // function gols
            }
        }

        if (topPositionBall <= 1 || topPositionBall >= viewRect.height - ball.offsetHeight) {
            ballDirectionY *= -1;
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
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
        if (ballRect.left < player1Rect.right + (player1Rect.height / 3) || ballRect.right < player1Rect.left + (player1Rect.height / 3)) {
            ballDirectionY = getRandomValueY();
            ballDirectionX *= -1;
        } 
        else if (ballRect.left > player1Rect.right - (player1Rect.height / 3) || ballRect.left < player1Rect.right + (player1Rect.height / 3)) {
            ballDirectionY = -1 * getRandomValueY();
            ballDirectionX *= -1;
        }
        else if (ballRect.bottom > player1Rect.top) 
        {
            ballDirectionY *= 1;
            ballDirectionX = 0; 
        } 
        else if (ballRect.top > player1Rect.bottom) 
        {
            ballDirectionY *= 1;
            ballDirectionX = 0; 
        }
        else {
            ballDirectionY = 0;
            ballDirectionX *= -1; 
        }
    }

    if (
        ballRect.right >= player2Rect.left &&
        ballRect.left <= player2Rect.right &&
        ballRect.bottom >= player2Rect.top &&
        ballRect.top <= player2Rect.bottom
    ) {
        if (ballRect.right < player2Rect.left + (player2Rect.height / 3) || ballRect.left < player2Rect.right + (player2Rect.height / 3)) {
            ballDirectionY = getRandomValueY();
            ballDirectionX *= -1;
        } 
        else if (ballRect.right > player2Rect.left - (player2Rect.height / 3) || ballRect.right < player2Rect.left + (player2Rect.height / 3)) {            
            ballDirectionY = -1 * getRandomValueY();
            ballDirectionX *= -1;
        }
        else if (ballRect.bottom > player2Rect.top) 
        {
            ballDirectionY *= 1;
            ballDirectionX = 0; 
        } 
        else if (ballRect.top > player2Rect.bottom) 
        {
            ballDirectionY *= 1;
            ballDirectionX = 0; 
        }
        else {           
            ballDirectionY = 0;
            ballDirectionX *= -1; 
        }
    }
}

function getRandomValueY() {
    return Math.random() * 2;
}

function randomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function colorChange() {
    document.body.style.backgroundColor = randomColor();
    view.style.backgroundColor = randomColor();
    player1.style.backgroundColor = randomColor();
    player2.style.backgroundColor = player1.style.backgroundColor;
}

setInterval(colorChange, 5000);
