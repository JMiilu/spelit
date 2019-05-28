"use strict";

function getNewGame() {
    return {
        interval: 5000,
        timer: null,
        colors: [],
        gameOver: false,
        score: 0,
        notify: null,

        reset(callBack = null) {
            // TODO: nollaa ajastin
            this.interval = 5000;
            this.colors = [];
            this.gameOver = false;
            this.score = 0;
            this.notify = callBack;
        },

        start(callBack) {
            this.reset(callBack);
            this.getNextColor();
        },

        guess(color) {
            if (this.gameOver || this.colors.length === 0) {
                this.gameOver = true;
            } else if (this.colors[0] === color) {
                this.colors.shift();
                this.score += 1;
            } else {
                this.gameOver = true;
            }

            return !this.gameOver;
        },

        stop() {
            // TODO: nollaa ajastin
            this.gameOver = true;
        },

        getScore() {
            return this.score;
        },

        getNextColor() {
            if (this.gameOver || this.colors.length > 50) {
                this.gameOver = true;
                this.notify(null);
                return;
            }

            const color = Math.floor(Math.random() * 4);
            this.colors.push(color);
            this.notify(color);

            if (this.interval > 4000) {
                this.interval -= 250;
            } else if (this.interval > 3000) {
                this.interval -= 125;
            } else if (this.interval > 2000) {
                this.interval -= 100;
            } else if (this.interval > 1000) {
                this.interval -= 50;
            } else if (this.interval > 500) {
                this.interval -= 40;
            } else if (this.interval > 100) {
                this.interval -= 25;
            }

            setTimeout(this.getNextColor.bind(this), this.interval);
        }
    };
}

(function() {
    const startBtn = document.getElementById("startBtn");
    const info = document.getElementById("alert");
    const bubbles = document.getElementsByClassName("bubble");
    const colors = ["red", "yellow", "blue", "green"];
    const game = getNewGame();

    startBtn.addEventListener("click", startGame);

    function guessColor(evt) {
        const color = colors.indexOf(evt.target.id);

        if (!game.guess(color)) {
            stopGame(evt);
        }
    }

    function flashBubble(color = null) {
        if (color === null) {
            // TODO: show game over message
            return;
        }

        toggleBubbleColor(color, true);
    }

    function toggleBubbleColor(color, repeat = false) {
        bubbles[color].classList.toggle(colors[color]);

        if (repeat) {
            setTimeout(toggleBubbleColor, 300, color);
        }
    }

    function startGame(evt) {
        startBtn.innerText = "Lopeta peli";
        startBtn.removeEventListener("click", startGame);
        startBtn.addEventListener("click", stopGame);

        info.classList.add("hidden");
        info.innerText = "";

        for (const bubble of bubbles) {
            bubble.addEventListener("click", guessColor);
        }

        game.start(flashBubble);
    }

    function stopGame(evt) {
        game.stop();

        startBtn.innerText = "Aloita peli";
        startBtn.removeEventListener("click", stopGame);
        startBtn.addEventListener("click", startGame);

        info.innerText = `Sait ${game.getScore()} pistettä.`;
        info.classList.remove("hidden");

        for (const bubble of bubbles) {
            bubble.removeEventListener("click", guessColor);
        }
    }
})();
