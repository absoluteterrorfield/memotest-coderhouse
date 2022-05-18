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

  startCountdown() {
    return setInterval(() => {
      this.remainingTime--;
      this.timerDisplay.innerHTML = this.remainingTime;
      if (this.remainingTime === 0) {
        this.gameOver();
      }
    }, 1000);
  }

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
    console.log(this.currentPlayer);
    console.log(this.playerOnePoints);
    console.log(this.playerTwoPoints);
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

  countPoints() {
    if (this.currentPlayer === 1) {
      this.playerOnePoints++;
    } else {
      this.playerTwoPoints++;
    }
  }

  changeTurn() {
    if (this.currentPlayer === 1) {
      this.currentPlayer = 2;
    } else {
      this.currentPlayer = 1;
    }
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

  gameOver() {
    clearInterval(this.countdown);
    this.board.style.display = "none";
    this.finalMessageContainer.style.display = "block";
    this.statusMessage.innerHTML = "Qué sad :( Perdiste u.u";
  }

  victory() {
    
    this.board.style.display = "none";
    this.finalMessageContainer.style.display = "block";
    
    if(this.players === "singlePlayer"){
      clearInterval(this.countdown);
      this.statusMessage.innerHTML = "EEAEAEAEAEAEAE ganaste :D";
      if(this.remainingTime>this.record){
        this.getRecord();
      }
    }else{
      if(this.playerOnePoints>this.playerTwoPoints){
        this.statusMessage.innerHTML = "Jugador 1 gana con " + this.playerOnePoints + " puntos";
      }else{
        this.statusMessage.innerHTML = "Jugador 2 gana con " + this.playerTwoPoints + " puntos";
      }
    }
  }

  saveMatchedCards() {
    this.matchedCards.push(this.firstPosition);
    this.matchedCards.push(this.secondPosition);
  }

  setSinglePlayerMode() {
    this.totalTime = 100;
    this.remainingTime = this.totalTime;
    this.timerDisplay = document.getElementById("time-remaining");
    this.countdown = this.startCountdown();
    this.remainingTime = this.totalTime;
    this.players = "singlePlayer";
    this.record;
    this.timerDisplay.style.display = "block";
    this.startGame(this.players);
  }
  
  getRecord() {
    this.record = this.remainingTime;
    localStorage.setItem("record", this.record);
    console.log("anda :D"+this.record);
    
}


  setMultiplayerMode() {
    this.showPoints = document.getElementById("points");
    this.showPlayerOnePoints = document.getElementById("player-one-points");
    this.showPlayerTwoPoints = document.getElementById("player-two-points");
    this.playerOnePoints = 0;
    this.playerTwoPoints = 0;
    this.players = "multiPlayer";
    this.currentPlayer = 1;
    this.showPlayerOnePoints.style.display = "block";
    this.showPlayerTwoPoints.style.display = "block";
    this.startGame(this.players);
  }


  async playAgain() {
    this.hideAllCards();
    this.board.style.display = "block";
    this.finalMessageContainer.style.display = "none";
    this.remainingTime = this.totalTime;
    this.timerDisplay.innerHTML = this.remainingTime;
    this.matchedCards = [];
    this.points = 0;
    this.busy = false;
    await this.startGame();
  }

  async initialize() {
    await this.getImages();
    this.shuffleCards();
    this.createCardElements();
    this.getHtmlElements();
    this.addListeners();
  }

  startGame(players) {
    this.gameDiv.style.display = "block";
    this.board.style.display = "block";
    this.finalMessageContainer.style.display = "none";
    this.menu.style.display = "none";
    if(players === "singlePlayer"){
    
    }else{
      
    }
  }
}

const juego = new MemoTest();
juego.initialize();
