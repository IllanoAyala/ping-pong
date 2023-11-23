const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");
const ball = document.getElementById("ball");
const view = document.querySelector(".View");
var gametitle = document.getElementById("gametitle");
const viewRect = view.getBoundingClientRect();
const player1Rect = player1.getBoundingClientRect();
const player2Rect = player2.getBoundingClientRect();
const startButton = document.getElementById("startbutton");
const restartButton = document.getElementById("restartbutton")
const player1Keys = {};
const player2Keys = {};

let movePlayersAnimation;
let moveBallAnimation;
let topPositonPlayer1 = 150;
let leftPositionPlayer1 = 10;
let topPositonPlayer2 = 150;
let leftPositionPlayer2 = 90;
let topPositionBall = 200;
let leftPositionBall = 400;
let ballDirectionX = Math.random() < 0.5 ? 1 : -1;
let ballDirectionY = 0;
let step = 7;
let speedball = 4;
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
        player1.style.left = leftPositionPlayer1 + "%";
        player2.style.top = topPositonPlayer2 + "px";
        player2.style.left = leftPositionPlayer2 + "%";
        ball.style.top = topPositionBall + "px";
        ball.style.left = leftPositionBall + "px";

        moveball();
        
    }
    else{
        location.reload();
    }
});

function restart(inicialDiretionX){ //
    topPositonPlayer1 = 150;
    leftPositionPlayer1 = 10;
    player1.style.top = 150 + "px";
    player1.style.left = 10 + "%";
    
    topPositonPlayer2 = 150;
    leftPositionPlayer2 = 90;
    player2.style.top = 150 + "px";
    player2.style.left = 90 + "%";

    topPositionBall = 200;
    leftPositionBall = 400;
    speedball = 0;
    ballDirectionX = inicialDiretionX;
    ballDirectionY = 0;
    golsP1 = 0;
    golsP2 = 0;
    ball.style.top = topPositionBall + "px";
    ball.style.left = leftPositionBall + "px";
    counterGoals();
    startCounter();
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

        if (!movePlayersAnimation) {
            movePlayersAnimation = requestAnimationFrame(moverPlayers);
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

    movePlayersAnimation = requestAnimationFrame(moverPlayers);
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
    // ball.classList.add("rotate"); //criar elemento div para colocar o rotate
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

        moveBallAnimation = requestAnimationFrame(animate);
    }

    setInterval(function(){
        if(speedball != 0)
        {
            if(speedball <= 10)
            {
                speedball += 0.3;
                // var speedanimation = parseFloat(ball.classList.style.animationDuration) - 0.5;
                // ball.style.animationDuration = speedanimation + "s";
                // ball.classList.style.animationDuration = speedanimation + "s";
            }
        }
    }, 2000)

    moveBallAnimation = requestAnimationFrame(animate);
}

function checkCollision() {
    const ballRect = ball.getBoundingClientRect();

    const observerPlayer1 = new IntersectionObserver(handleIntersection, { threshold: 0.1 });
    observerPlayer1.observe(player1);

    const observerPlayer2 = new IntersectionObserver(handleIntersection, { threshold: 0.1 });
    observerPlayer2.observe(player2);

    function handleIntersection(entries) {
        entries.forEach(entry => {
            const playerRect = entry.target.getBoundingClientRect();

            if (entry.isIntersecting) {
                if (
                    ballRect.right >= playerRect.left &&
                    ballRect.left <= playerRect.right &&
                    ballRect.bottom >= playerRect.top &&
                    ballRect.top <= playerRect.bottom
                ) {
                    handleCollision(entry.target);
                }
            }
        });
    }

    function handleCollision(player) {
        if (ballRect.top < player.getBoundingClientRect().top + (player.getBoundingClientRect().height / 3)) {
            ballDirectionY = getRandomValueY();
            ballDirectionX *= -1;
        } else if (ballRect.bottom > player.getBoundingClientRect().bottom - (player.getBoundingClientRect().height / 3)) {
            ballDirectionY = -1 * getRandomValueY();
            ballDirectionX *= -1;
        } else {
            ballDirectionY = 0;
            ballDirectionX *= -1;
        }

        colorChange();
    }
}

function getRandomValueY() {
    return Math.random() * 3;
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

    // document.body.style.backgroundColor = `linear-gradient(to bottom, white, ${randomColor(baseColor)})`;
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
        player1.style.left = 10 + "%";
        
        topPositonPlayer2 = 150;
        leftPositionPlayer2 = 90;
        player2.style.top = 150 + "px";
        player2.style.left = 90 + "%";

        topPositionBall = 200;
        leftPositionBall = 400;
        speedball = 0;
        ballDirectionX = -1;
        ballDirectionY = 0;
        ball.style.top = topPositionBall + "px";
        ball.style.left = leftPositionBall + "px";
        startCounter();
    }
    else if(player === player2){
        golsP2 += 1;
        scores[0].textContent = golsP2;
        topPositonPlayer1 = 150;
        leftPositionPlayer1 = 100;
        player1.style.top = 150 + "px";
        player1.style.left = 10 + "%";
        
        topPositonPlayer2 = 150;
        leftPositionPlayer2 = 780;
        player2.style.top = 150 + "px";
        player2.style.left = 90 + "%";

        topPositionBall = 200;
        leftPositionBall = 400;
        speedball = 0;
        ballDirectionX = 1;
        ballDirectionY = 0;
        ball.style.top = topPositionBall + "px";
        ball.style.left = leftPositionBall + "px"; 
        startCounter();
    }
    else{ //atualizar placar
        scores[0].textContent = golsP2;
        scores[1].textContent = golsP1;
    }

}

function startCounter() {
    var counter = 3;
    view.removeChild(ball);
    
    counterInterval = setInterval(function () {
        if (counter > 0) {
            gametitle.textContent = counter;
            counter--;
        } else {
            clearInterval(counterInterval);
            gametitle.textContent = "GO!";
            gametitle.classList.add("scale-up");
            setTimeout(function () {
                gametitle.textContent = "";
                gametitle.classList.remove("scale-up");
                view.appendChild(ball);
                speedball = 4;
            }, 1000);
        }
    }, 1000);   
}


// setInterval(colorChange, 5000);
// clearInterval(colorChange);
