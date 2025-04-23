class PongGame {
    constructor() {
        this.player1 = document.getElementById("player1");
        this.player2 = document.getElementById("player2");
        this.ball = document.getElementById("ball");
        this.view = document.querySelector(".View");
        this.gametitle = document.getElementById("gametitle");
        this.startButton = document.getElementById("startbutton");
        this.modeGame = document.getElementById("modeGameButton");
        this.scores = document.querySelectorAll("#score");
        this.restartButton = document.getElementById("restartbutton");

        this.player1Keys = {};
        this.player2Keys = {};

        this.topPositonPlayer1 = 0;
        this.leftPositionPlayer1 = 2.5;

        this.topPositonPlayer2 = 0;
        this.leftPositionPlayer2 = 96;

        this.topPositionBall = 200;
        this.leftPositionBall = 400;
        this.ballDirectionX = Math.random() < 0.5 ? 1 : -1;
        this.ballDirectionY = 0;
        this.step = 7;
        this.speedball = 4;
        this.start = true;
        this.mode = true;
        this.golsP1 = 0;
        this.golsP2 = 0;

        this.movePlayersAnimation = null;
        this.moveBallAnimation = null;

        this.view.removeChild(this.player1);
        this.view.removeChild(this.player2);
        this.view.removeChild(this.ball);

        this.counterGoals();
        this.setupEventListeners();

        this.centerPlayers();
        this.updatePositions();

        window.addEventListener("resize", () => {
            this.centerPlayers();
            this.updatePositions();
        });
    }

    centerPlayers() {
        const viewHeight = this.view.clientHeight;
        const playerHeight = this.player1.clientHeight;

        this.topPositonPlayer1 = (viewHeight - playerHeight) / 2;
        this.leftPositionPlayer1 = 2.5;

        this.topPositonPlayer2 = (viewHeight - playerHeight) / 2;
        this.leftPositionPlayer2 = 96;
    }

    setupEventListeners() {
        this.startButton.addEventListener("click", () => this.toggleStart());
        this.modeGame.addEventListener("click", () => this.changeMode());
        this.restartButton.addEventListener("click", () => {
            if (!this.restartButton.disabled) {
                this.restart(this.ballDirectionX);
            }
        });

        document.addEventListener("keydown", (event) => this.onKeyDown(event));
        document.addEventListener("keyup", (event) => this.onKeyUp(event));
    }

    toggleStart() {
        this.start = !this.start;
        if (!this.start) {
            if (!this.mode) {
                this.view.appendChild(this.player1);
                this.view.appendChild(this.ball);
                this.centerPlayers();
                this.updatePositions();
                this.startButton.textContent = "Stop";
                this.moveball();
            } else {
                this.view.appendChild(this.player1);
                this.view.appendChild(this.player2);
                this.view.appendChild(this.ball);
                this.centerPlayers();
                this.updatePositions();
                this.startButton.textContent = "Stop";
                this.moveball();
            }
        } else {
            location.reload();
        }
    }

    changeMode() {
        this.mode = !this.mode;
        const modeIcon = document.getElementById("mode");
        if (!this.mode) {
            modeIcon.src = "src/styles/icons/2p.svg";
            if (!this.start) {
                this.restart(this.ballDirectionX);
                this.view.removeChild(this.player2);
                if(this.ball.parentNode === this.view) {
                    this.view.removeChild(this.ball);
                }
            }
        } else {
            modeIcon.src = "src/styles/icons/1p.svg";
            if (!this.start) {
                this.restart(this.ballDirectionX);
                this.view.appendChild(this.player2);
                if(this.ball.parentNode === this.view) {
                    this.view.removeChild(this.ball);
                }
            }
        }
    }

    restart(initialDirectionX) {
        if(!this.start) {
            this.centerPlayers();
            this.topPositionBall = 200;
            this.leftPositionBall = 400;
            this.speedball = 0;
            this.ballDirectionX = initialDirectionX;
            this.ballDirectionY = 0;
            this.golsP1 = 0;
            this.golsP2 = 0;
            this.updatePositions();
            this.counterGoals();
            this.startCounter();
        }
    }

    resetPositions(ballDirectionX) {
        this.centerPlayers();
        this.topPositionBall = 200;
        this.leftPositionBall = 400;
        this.speedball = 0;
        this.ballDirectionX = ballDirectionX;
        this.ballDirectionY = 0;
        this.updatePositions();
        this.startCounter();
    }

    updatePositions() {
        this.player1.style.top = this.topPositonPlayer1 + "px";
        this.player1.style.left = this.leftPositionPlayer1 + "%";
        this.player2.style.top = this.topPositonPlayer2 + "px";
        this.player2.style.left = this.leftPositionPlayer2 + "%";
        this.ball.style.top = this.topPositionBall + "px";
        this.ball.style.left = this.leftPositionBall + "px";
    }

    onKeyDown(event) {
        if (!this.start) {
            if (event.key === "w") this.player1Keys.up = true;
            if (event.key === "s") this.player1Keys.down = true;
            if (event.key === "ArrowUp") this.player2Keys.up = true;
            if (event.key === "ArrowDown") this.player2Keys.down = true;
            if (!this.movePlayersAnimation) {
                this.movePlayersAnimation = requestAnimationFrame(() => this.moverPlayers());
            }
        }
    }

    onKeyUp(event) {
        if (!this.start) {
            if (event.key === "w") this.player1Keys.up = false;
            if (event.key === "s") this.player1Keys.down = false;
            if (event.key === "ArrowUp") this.player2Keys.up = false;
            if (event.key === "ArrowDown") this.player2Keys.down = false;
        }
    }

    moverPlayers() {
        const viewRect = this.view.getBoundingClientRect();
        const player1Rect = this.player1.getBoundingClientRect();
        const player2Rect = this.player2.getBoundingClientRect();

        if (this.player1Keys.up) this.movePlayer1(-this.step, player1Rect, viewRect);
        if (this.player1Keys.down) this.movePlayer1(this.step, player1Rect, viewRect);
        if (this.player2Keys.up) this.movePlayer2(-this.step, player2Rect, viewRect);
        if (this.player2Keys.down) this.movePlayer2(this.step, player2Rect, viewRect);

        this.movePlayersAnimation = requestAnimationFrame(() => this.moverPlayers());
    }

    movePlayer1(topChange, playerRect, viewRect) {
        const newTop = this.topPositonPlayer1 + topChange;
        if (newTop >= 0 && newTop + playerRect.height <= viewRect.height) {
            this.topPositonPlayer1 = newTop;
            this.player1.style.top = this.topPositonPlayer1 + "px";
        }
    }

    movePlayer2(topChange, playerRect, viewRect) {
        const newTop = this.topPositonPlayer2 + topChange;
        if (newTop >= 0 && newTop + playerRect.height <= viewRect.height) {
            this.topPositonPlayer2 = newTop;
            this.player2.style.top = this.topPositonPlayer2 + "px";
        }
    }

    moveball() {
        this.ball.classList.add("rotate");
        const viewRect = this.view.getBoundingClientRect();
        const animate = () => {
            this.leftPositionBall += this.speedball * this.ballDirectionX;
            this.topPositionBall += this.speedball * this.ballDirectionY;
            this.ball.style.left = this.leftPositionBall + "px";
            this.ball.style.top = this.topPositionBall + "px";

            if (this.leftPositionBall <= 0 || this.leftPositionBall >= viewRect.width - this.ball.offsetWidth) {
                if (this.mode) {
                    if (this.leftPositionBall <= 0) this.counterGoals(this.player1);
                    else if (this.leftPositionBall >= viewRect.width - this.ball.offsetWidth) this.counterGoals(this.player2);
                } else if (!this.mode) {
                    if (this.leftPositionBall <= 0) this.counterGoals(this.player1);
                    else if (this.leftPositionBall >= viewRect.width - this.ball.offsetWidth) this.ballDirectionX *= -1;
                }
            } else if (this.topPositionBall <= 2 || this.topPositionBall >= viewRect.height - this.ball.offsetHeight + 2) {
                this.ballDirectionY *= -1;
            } else {
                this.checkCollision();
            }

            this.moveBallAnimation = requestAnimationFrame(animate);
        };

        setInterval(() => {
            if (this.speedball !== 0 && this.speedball <= 10) {
                this.speedball += 0.5;
            }
        }, 2000);

        this.moveBallAnimation = requestAnimationFrame(animate);
    }

    checkCollision() {
        const ballRect = this.ball.getBoundingClientRect();
        const player1Rect = this.player1.getBoundingClientRect();
        const player2Rect = this.player2.getBoundingClientRect();

        if (this.mode) {
            if (this.isCollision(ballRect, player1Rect)) {
                this.resolveCollision(this.player1, player1Rect, ballRect, 1);
            }
            if (this.isCollision(ballRect, player2Rect)) {
                this.resolveCollision(this.player2, player2Rect, ballRect, 2);
            }
        } else {
            if (this.isCollision(ballRect, player1Rect)) {
                this.resolveCollision(this.player1, player1Rect, ballRect, 1);
            }
        }
    }

    resolveCollision(player, playerRect, ballRect, direction) {
        if (direction === 1) {
            this.leftPositionBall = playerRect.right - this.view.getBoundingClientRect().left;
        } else {
            this.leftPositionBall = playerRect.left - this.view.getBoundingClientRect().left - this.ball.offsetWidth;
        }
        this.collisionPlayer(playerRect, ballRect);
    }

    isCollision(ballRect, playerRect) {
        return (
            ballRect.right >= playerRect.left &&
            ballRect.left <= playerRect.right &&
            ballRect.bottom >= playerRect.top &&
            ballRect.top <= playerRect.bottom
        );
    }

    collisionPlayer(playerRect, ballRect) {
        const ballCenterY = (ballRect.top + ballRect.bottom) / 2;
        const playerCenterY = (playerRect.top + playerRect.bottom) / 2;
        const ballPositionX = (ballRect.left + ballRect.right) / 2;
        const playerPositionX = (playerRect.left + playerRect.right) / 2;

        this.ballDirectionY = ballCenterY < playerCenterY ? this.getRandomValueY() : -1 * this.getRandomValueY();
        this.ballDirectionX = ballPositionX < playerPositionX ? -1 : 1;
        this.colorChange();
    }

    getRandomValueY() {
        return Math.random() * 2;
    }

    getColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    invertColor(hex) {
        let r = 255 - parseInt(hex.slice(1, 3), 16);
        let g = 255 - parseInt(hex.slice(3, 5), 16);
        let b = 255 - parseInt(hex.slice(5, 7), 16);

        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    getContrastColor(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return yiq >= 128 ? '#222222' : '#FFFFFF';
    }

    colorChange() {
        const baseColor = this.getColor();
        this.view.style.backgroundColor = baseColor;
        const playerColor = this.getContrastColor(baseColor);
        this.player1.style.backgroundColor = playerColor;
        this.player2.style.backgroundColor = playerColor;
        this.ball.style.backgroundColor = playerColor;
    }

    counterGoals(player) {
        if (player === this.player1) {
            this.golsP1 += 1;
            this.scores[1].textContent = this.golsP1;
            this.resetPositions(-1);
        } else if (player === this.player2) {
            this.golsP2 += 1;
            this.scores[0].textContent = this.golsP2;
            this.resetPositions(1);
        } else {
            this.scores[0].textContent = this.golsP2;
            this.scores[1].textContent = this.golsP1;
        }
    }

    startCounter() {
        let counter = 3;
        this.modeGame.disabled = true;
        this.restartButton.disabled = true;
        if (this.ball.parentNode === this.view) {
            this.view.removeChild(this.ball);
        }

        let counterInterval = setInterval(() => {
            if (counter > 0) {
                this.gametitle.textContent = counter;
                counter--;
            } else {
                clearInterval(counterInterval);
                setTimeout(() => {
                    this.gametitle.textContent = "";
                    this.view.appendChild(this.ball);
                    this.modeGame.disabled = false;
                    this.restartButton.disabled = false;
                    this.speedball = 4;
                }, 1000);
            }
        }, 1000);
    }
}

const game = new PongGame();
