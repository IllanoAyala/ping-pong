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
let ballDirectionX = Math.random() < 0.5 ? 1 : -1;
let ballDirectionY = 0;
let step = 7;
let speedball = 3;
let start = true;
let golsP1 = 0;
let golsP2 = 0;

view.removeChild(player1);
view.removeChild(player2);
view.removeChild(ball);
counterGoals();

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

        moveball();
        
        setInterval(function(){ //melhorar 
            if(speedball <= 7)
            {
                speedball += 1;
            }
            else{
                
            }
        }, 3000);
    }
    else{
        location.reload();
    }
});

function restart(inicialDiretionX){
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
    ballDirectionX = inicialDiretionX;
    ballDirectionY = 0;
    golsP1 = 0;
    golsP2 = 0;
    ball.style.top = topPositionBall + "px";
    ball.style.left = leftPositionBall + "px";
    counterGoals();
}

restartButton.addEventListener("click", () => {
    restart(ballDirectionX);
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
    if (player1Keys.up) movePlayer1(-step);
    if (player1Keys.down) movePlayer1(step);

    if (player2Keys.up) movePlayer2(-step);
    if (player2Keys.down) movePlayer2(step);

    animationId = requestAnimationFrame(moverPlayers);
}

function movePlayer1(topChange) {
    const newTop = topPositonPlayer1 + topChange;

    if (newTop >= 0 && newTop + player1Rect.height <= viewRect.height) {
        topPositonPlayer1 = newTop;
        player1.style.top = topPositonPlayer1 + "px";
    }
}

function movePlayer2(topChange) {
    const newTop = topPositonPlayer2 + topChange;

    if (newTop >= 0 && newTop + player2Rect.height <= viewRect.height) {
        topPositonPlayer2 = newTop;
        player2.style.top = topPositonPlayer2 + "px";
    }
}

function moveball() {
    function animate() {
        leftPositionBall += speedball * ballDirectionX;
        topPositionBall += speedball * ballDirectionY;
        ball.style.left = leftPositionBall + "px";
        ball.style.top = topPositionBall + "px";

        checkCollision();

        if (leftPositionBall <= 0 || leftPositionBall >= viewRect.width - ball.offsetWidth) {
            ballDirectionX *= -1;

            if (leftPositionBall <= 0) {
                console.log("1"); // function gols
                counterGoals(player1);
            } else if (leftPositionBall >= viewRect.width - ball.offsetWidth) {
                console.log("2"); // function gols
                counterGoals(player2);
            }
        }

        if (topPositionBall <= 2 || topPositionBall >= viewRect.height - ball.offsetHeight + 2) {
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
        if (ballRect.top < player1Rect.top + (player1Rect.height / 3)) {
            ballDirectionY = getRandomValueY();
            ballDirectionX *= -1;
        }       
        else if (ballRect.bottom > player1Rect.bottom - (player1Rect.height / 3)) {
            ballDirectionY = -1 * getRandomValueY();
            ballDirectionX *= -1;
        }
        else {
            ballDirectionY = 0;
            ballDirectionX *= -1;
        }

        colorChange();
    }

    if (
        ballRect.right >= player2Rect.left &&
        ballRect.left <= player2Rect.right &&
        ballRect.bottom >= player2Rect.top &&
        ballRect.top <= player2Rect.bottom
    ) {
        if (ballRect.top < player2Rect.top + (player2Rect.height / 3)) {
            ballDirectionY = getRandomValueY();
            ballDirectionX *= -1;
        } 
        else if (ballRect.bottom > player2Rect.bottom - (player2Rect.height / 3)) {            
            ballDirectionY = -1 * getRandomValueY();
            ballDirectionX *= -1;
        }
        else {           
            ballDirectionY = 0;
            ballDirectionX *= -1; 
        }

        colorChange();
    }
}

function getRandomValueY() {
    return Math.random() * 2;
}

function getColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function randomColor(baseColor) {
    const variation = 72; 

    const offset = () => Math.floor(Math.random() * (2 * variation + 1)) - variation;
    const clamp = (value) => Math.min(255, Math.max(0, value));
    const toHex = (value) => (value < 16 ? '0' : '') + value.toString(16);

    const baseRed = parseInt(baseColor.slice(1, 3), 16);
    const baseGreen = parseInt(baseColor.slice(3, 5), 16);
    const baseBlue = parseInt(baseColor.slice(5, 7), 16);

    const newRed = clamp(baseRed + offset());
    const newGreen = clamp(baseGreen + offset());
    const newBlue = clamp(baseBlue + offset());

    const newColor = `#${toHex(newRed)}${toHex(newGreen)}${toHex(newBlue)}`;

    const luminance = (0.299 * newRed + 0.587 * newGreen + 0.114 * newBlue) / 255;
    const color = luminance > 0.5 ? '#000000' : '#ffffff';

    ball.style.backgroundColor = color;

    return newColor;
}

function colorChange() {
    const baseColor = getColor(); 

    document.body.style.backgroundColor = randomColor(baseColor);
    view.style.backgroundColor = randomColor(baseColor);
    player1.style.backgroundColor = randomColor(baseColor);
    player2.style.backgroundColor = player1.style.backgroundColor;
}

function counterGoals(player){
    var scores = document.querySelectorAll("#score");

    if(player === player1)
    {
        golsP1 += 1;
        scores[1].textContent = golsP1;
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
    }
    else if(player === player2){
        golsP2 += 1;
        scores[0].textContent = golsP2;
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
        ballDirectionX = 1;
        ballDirectionY = 0;
        ball.style.top = topPositionBall + "px";
        ball.style.left = leftPositionBall + "px";    
    }
    else{ //atualizar placar
        scores[0].textContent = golsP2;
        scores[1].textContent = golsP1;
    }

}
// setInterval(colorChange, 5000);
// clearInterval(colorChange);
