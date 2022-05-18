class MemoTest {
  constructor(totalTime, cards) {
    this.grid = {};
    this.matchedCards = [];
    this.cardToCheck = null;
    this.busy = false;
  }

  async getImages() {
    const images = await fetch("./images.json");
    const imagesJSON = await images.json();
    this.images = imagesJSON;
  }

  getHtmlElements() {
    this.playAgainButton = document.getElementById("play-again-btn");
    this.board = document.getElementById("board");
    this.finalMessageContainer = document.getElementById("final-msg-container");
    this.statusMessage = document.getElementById("status-message");
    this.cards = Array.from(document.getElementsByClassName("card"));
    this.singlePlayerBtn = document.getElementById("single-player");
    this.multiPlayerBtn = document.getElementById("multi-player");
    this.menu = document.getElementById("menu");
    this.gameDiv = document.getElementById("game");
  }

  createCardElements() {
    this.images.forEach((img, index) => {
      const imgDiv = document.createElement("div");
      imgDiv.innerHTML = `<div class="card" id="card">
      <div class="card-front face" id="card-front">
      <img class="card-value" src="./public/images/${img}" alt="" srcset="" />
      </div>
      <div class="card-back face" id="card-back">
      <img src="./public/images/back.jpg" alt="" srcset="" />
      </div>
      </div>`;
      document.getElementById(index).innerHTML = imgDiv.innerHTML;
    });
  }

  addListeners() {
    this.playAgainButton.addEventListener("click", () => {
      this.playAgain();
    });
    this.cards.forEach((card) => {
      card.addEventListener("click", () => {
        this.flipCard(card);
      });
    });
    this.singlePlayerBtn.addEventListener("click", () => {
      this.setSinglePlayerMode();
    });
    this.multiPlayerBtn.addEventListener("click", () => {
      this.setMultiplayerMode();
    });
  }

  async initialize() {
    await this.getImages();
    this.createCardElements();
    this.getHtmlElements();
    this.addListeners();
  }

  startGame() {
    this.createCardElements();
    this.getHtmlElements();
    this.addListeners();
    this.shuffleCards();
    this.gameDiv.style.display = "block";
    this.board.style.display = "block";
    this.finalMessageContainer.style.display = "none";
    this.menu.style.display = "none";
  }

  victory() {
    this.board.style.display = "none";
    this.finalMessageContainer.style.display = "block";

    if (this.players === "singlePlayer") {
      clearInterval(this.countdown);
      this.statusMessage.innerHTML = "EEAEAEAEAEAEAE ganaste :D";
      if (this.remainingTime > this.record) {
        this.getRecord();
      }
    } else {
      if (this.playerOnePoints > this.playerTwoPoints) {
        this.statusMessage.innerHTML = "Jugador 1 gana con " + this.playerOnePoints + " puntos";
      } else {
        this.statusMessage.innerHTML = "Jugador 2 gana con " + this.playerTwoPoints + " puntos";
      }
    }
  }

  gameOver() {
    clearInterval(this.countdown);
    this.board.style.display = "none";
    this.finalMessageContainer.style.display = "block";
    this.statusMessage.innerHTML = "Qué sad :( Perdiste u.u";
  }

  playAgain() {
    this.hideAllCards();
    this.board.style.display = "block";
    this.finalMessageContainer.style.display = "none";
    this.matchedCards = [];
    if (this.players === "multiPlayer") {
      this.playerOnePoints = 0;
      this.playerTwoPoints = 0;
      this.showPlayerOnePoints.innerHTML = this.playerOnePoints;
      this.showPlayerTwoPoints.innerHTML = this.playerTwoPoints;
    }
    if (this.players === "singlePlayer") {
      this.remainingTime = this.totalTime;
      this.timerDisplay.innerHTML = this.remainingTime;
      clearInterval(this.countdown);

      this.countdown = setInterval(() => {
        this.remainingTime--;
        this.timerDisplay.innerHTML = this.remainingTime;
        if (this.remainingTime === 0) {
          this.gameOver();
        }
      }, 1000);
    }
    this.points = 0;
    this.busy = false;
    this.startGame();
  }

  /* startCountdown() {
    return setInterval(() => {
      this.remainingTime--;
      this.timerDisplay.innerHTML = this.remainingTime;
      if (this.remainingTime === 0) {
        this.gameOver();
      }
    }, 1000);
  }
 */
  /* Cards Logic */

  shuffleCards() {
    this.images = this.images.sort(function () {
      return Math.random() - 0.5;
    });

    for (let i = 0; i < this.images.length; i++) {
      this.grid[i.toString()] = this.images[i];
    }
  }

  flipCard(card) {
    if (this.canFlipCard(card)) {
      card.classList.add("flipped");
      if (this.cardToCheck) {
        this.checkForCardMatch(card);
      } else {
        this.cardToCheck = card;
      }
    }
  }

  checkForCardMatch(card) {
    if (this.getCardImageSrc(card) === this.getCardImageSrc(this.cardToCheck)) {
      this.cardMatch(card, this.cardToCheck);
    } else {
      this.cardMismatch(card, this.cardToCheck);
    }
    this.cardToCheck = null;
  }

  cardMatch(card1, card2) {
    this.matchedCards.push(card1);
    this.matchedCards.push(card2);
    card1.classList.add("matched");
    card2.classList.add("matched");
    if (this.players === "multiPlayer") {
      this.countPoints();
    }
    if (this.matchedCards.length === this.cards.length) this.victory();
  }

  cardMismatch(card1, card2) {
    this.busy = true;
    if (this.players === "multiPlayer") {
      this.changeTurn();
    }
    setTimeout(() => {
      this.hideCard(card1);
      this.hideCard(card2);
      this.busy = false;
    }, 1000);
  }

  hideCard(card) {
    card.classList.remove("flipped");
  }

  hideAllCards() {
    this.cards.forEach((card) => {
      this.hideCard(card);
    });
  }

  getCardImageSrc(card) {
    return card.getElementsByClassName("card-value")[0].src;
  }

  canFlipCard(card) {
    return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
  }

  saveMatchedCards() {
    this.matchedCards.push(this.firstPosition);
    this.matchedCards.push(this.secondPosition);
  }

  /* Players Logic */
  setSinglePlayerMode() {
    this.totalTime = 4;
    this.remainingTime = this.totalTime;
    this.timerDiv = document.getElementById("time");
    this.timerDisplay = document.getElementById("time-remaining");
    this.countdown = setInterval(() => {
      console.log("hit");
      this.remainingTime--;
      this.timerDisplay.innerHTML = this.remainingTime;
      if (this.remainingTime === 0) {
        this.gameOver();
      }
    }, 1000);
    this.remainingTime = this.totalTime;
    this.players = "singlePlayer";
    this.record = localStorage.getItem("record") || 0;
    this.showRecord = document.getElementById("record");
    this.showRecord.innerHTML = this.record;
    this.timerDiv.style.display = "block";
    this.timerDisplay.style.display = "block";
    this.startGame();
  }

  setMultiplayerMode() {
    this.showPoints = document.getElementById("points");
    this.showPlayerOnePoints = document.getElementById("player-one-points");
    this.showPlayerTwoPoints = document.getElementById("player-two-points");
    this.showPoints = document.getElementById("points");
    this.playerOnePoints = 0;
    this.playerTwoPoints = 0;
    this.players = "multiPlayer";
    this.currentPlayer = 1;
    this.showPoints.style.display = "block";
    this.startGame();
  }

  countPoints() {
    if (this.currentPlayer === 1) {
      this.playerOnePoints++;
      this.showPlayerOnePoints.innerHTML = this.playerOnePoints;
    } else {
      this.playerTwoPoints++;
      this.showPlayerTwoPoints.innerHTML = this.playerTwoPoints;
    }
  }

  changeTurn() {
    if (this.currentPlayer === 1) {
      this.currentPlayer = 2;
    } else {
      this.currentPlayer = 1;
    }
  }

  getRecord() {
    this.record = this.remainingTime;
    localStorage.setItem("record", this.record);
    console.log("anda :D" + this.record);
  }
}

const juego = new MemoTest();
juego.initialize();
