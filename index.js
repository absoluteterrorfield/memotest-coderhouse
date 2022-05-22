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
    this.finalMessageContainer = document.getElementById("final-msg-container");
    this.statusMessage = document.getElementById("status-message");
    this.cards = Array.from(document.getElementsByClassName("card"));
    this.singlePlayerBtn = document.getElementById("single-player");
    this.multiPlayerBtn = document.getElementById("multi-player");
    this.menu = document.getElementById("menu");
    this.gameDiv = document.getElementById("game");
    this.backToMenuBtn = document.getElementById("back-to-menu-btn");
    this.singlePlayerFeatures = document.getElementById(
      "single-player-features"
    );
    this.multiPlayerFeatures = document.getElementById("multi-player-features");
    this.timerDisplay = document.getElementById("time-remaining");
    this.showTurn = document.getElementById("turn");
    this.showPoints = document.getElementById("points");
    this.showPlayerOnePoints = document.getElementById("player-one-points");
    this.showPlayerTwoPoints = document.getElementById("player-two-points");
    this.showRecord = document.getElementById("record");
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
    this.singlePlayerBtn.addEventListener("click", () => {
      this.setSinglePlayerMode();
    });
    this.multiPlayerBtn.addEventListener("click", () => {
      this.setMultiplayerMode();
    });
    this.backToMenuBtn.addEventListener("click", () => {
      this.backToMenu();
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
     this.cards.forEach((card) => {
      card.addEventListener("click", () => {
        this.flipCard(card);
      });
    });
    this.shuffleCards();
    this.gameDiv.style.display = "block";
    this.finalMessageContainer.style.display = "none";
    this.menu.style.display = "none";
  }

  victory() {
    this.gameDiv.style.display = "none";
    this.finalMessageContainer.style.display = "block";

    if (this.players === "singlePlayer") {
      clearInterval(this.countdown);
      this.statusMessage.innerHTML = "EEAEAEAEAEAEAE ganaste :D";
      if (this.remainingTime > this.record) {
        this.setRecord();
        Swal.fire({
          title: "Rompiste tu record! Felicitaciones!",
          imageUrl: "./public/images/congratulations.gif",
          confirmButtonText: "Joya!",
        });
      }
    } else {
      if (this.playerOnePoints > this.playerTwoPoints) {
        this.statusMessage.innerHTML =
          "Jugador 1 gana con " + this.playerOnePoints + " puntos";
      } else if(this.playerOnePoints<this.playerTwoPoints){
        this.statusMessage.innerHTML =
          "Jugador 2 gana con " + this.playerTwoPoints + " puntos";
      }else{
        this.statusMessage.innerHTML = "Empataron! Hora de la revancha"
      }
    }
  }

  gameOver() {
    clearInterval(this.countdown);
    this.gameDiv.style.display = "none";
    this.finalMessageContainer.style.display = "block";
    this.statusMessage.innerHTML = "No lograste evitar el tercer impacto. El proyecto de instrumentalización humana ha comenzado";
  }

  backToMenu() {
    this.gameDiv.style.display = "none";
    this.singlePlayerFeatures.style.display = "none";
    this.multiPlayerFeatures.style.display = "none";
    this.menu.style.display = "block";
    this.finalMessageContainer.style.display = "none";
  }

  playAgain() {
    this.hideAllCards();
    this.gameDiv.style.display = "block";
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
      this.countdown = setInterval(() => {
        this.remainingTime--;
        this.timerDisplay.innerHTML = this.remainingTime;
        if (this.remainingTime === 0) {
          this.gameOver();
        }
      }, 1000);
    }

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
    return (
      !this.busy &&
      !this.matchedCards.includes(card) &&
      card !== this.cardToCheck
    );
  }

  saveMatchedCards() {
    this.matchedCards.push(this.firstPosition);
    this.matchedCards.push(this.secondPosition);
  }

  /* Players Logic */
  setSinglePlayerMode() {
    clearInterval(this.countdown);
    this.totalTime = 60;
    this.remainingTime = this.totalTime;
    this.singlePlayerFeatures.style.display = "block";
    this.timerDisplay.innerHTML = this.remainingTime;
    this.countdown = setInterval(() => {
      this.remainingTime--;
      this.timerDisplay.innerHTML = this.remainingTime;
      if (this.remainingTime === 0) {
        this.gameOver();
      }
    }, 1000);
    this.remainingTime = this.totalTime;
    this.players = "singlePlayer";
    this.record = localStorage.getItem("record") || 0;

    this.showRecord.innerHTML = this.record;
    this.startGame();
  }

  setMultiplayerMode() {
    this.playerOnePoints = 0;
    this.playerTwoPoints = 0;
    this.players = "multiPlayer";
    this.currentPlayer = 1;
    this.showTurn.innerHTML = "Jugador " + this.currentPlayer;
    this.multiPlayerFeatures.style.display = "block";
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
    this.showTurn.innerHTML = "Jugador " + this.currentPlayer;
  }

  setRecord() {
    this.record = this.totalTime-this.remainingTime;
    localStorage.setItem("record", this.record);
    this.showRecord.innerHTML = this.record;

  }
}

const juego = new MemoTest();
juego.initialize();
