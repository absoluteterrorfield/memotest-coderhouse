class MemoTest {
  constructor() {
    this.grid = {};
    this.firstPosition;
    this.secondPosition;
    this.firstCard;
    this.secondCard;
    this.points = 0;
    this.matchedCards = [];
  }

  async getImages() {
    const images = await fetch('./images.json');
    const imagesJSON = await images.json();
    this.images = imagesJSON;
    console.log(this.images);
  }

  shuffleCards() {
    this.images = this.images.sort(function () {
      return Math.random() - 0.5;
    });

    for (let i = 0; i < this.images.length; i++) {
      this.grid[i.toString()] = this.images[i];
    }
    console.log(this.grid);
  }

  flipCard(card) {
    if (this.matchedCards.includes(card)) return;
    card.classList.add('flipped');
    console.log(card);
    console.log(this.grid[card]);
    if (!this.firstCard) {
      this.firstPosition = card;
      this.firstCard = this.grid[card];
    } else {
      if (card === this.firstPosition) return;

      this.secondPosition = card;
      this.secondCard = this.grid[card];
      this.compareCards();
    }
  }
  hideCard(card) {
    card.classList.remove('flipped');
  }
  /* jugada(card) {
    if (this.matchedCards.includes(card)) return;

    this.flipCard(card);
    console.log(card);
    console.log(this.grid[card]);
    if (!this.firstCard) {
      this.firstPosition = card;
      this.firstCard = this.grid[card];
    } else {
      if (card === this.firstPosition) return;

      this.secondPosition = card;
      this.secondCard = this.grid[card];
      this.compareCards();
    }
  }
 */
  compareCards() {
    if (this.firstCard === this.secondCard) {
      this.countPoints();
      this.saveMatchedCards();
      this.firstPosition = null;
      this.secondPosition = null;
      this.firstCard = null;
      this.secondCard = null;
    } else {
      setTimeout(() => {
        this.hideCard(this.firstPosition);
        this.hideCard(this.secondPosition);
        this.firstPosition = null;
        this.secondPosition = null;
        this.firstCard = null;
        this.secondCard = null;
      }, 700);
    }
  }

  countPoints() {
    this.points++;
    this.mostrarpoints.innerHTML = 'points: ' + this.points;
    if (this.points === 8) {
      this.tablero.style.display = 'none';
      this.mensaje.style.display = 'block';
    }
  }
  saveMatchedCards() {
    this.matchedCards.push(this.firstPosition);
    this.matchedCards.push(this.secondPosition);
  }
  playAgain() {
    for (let i = 0; i <= 15; i++) {
      this.hideCard(i.toString());
    }
    this.tablero.style.display = 'block';
    this.mensaje.style.display = 'none';
    this.points = 0;
    this.matchedCards = [];
    this.startGame();
  }
  async startGame() {
    await this.getImages();
    this.shuffleCards();
    this.images.forEach((img, index) => {
      const imgDiv = document.createElement('div');
      imgDiv.innerHTML = `<div class="card" id="card">
              <div class="card-front face" id="card-front">
                <img src="./public/images/${img}" alt="" srcset="" />
              </div>
              <div class="card-back face" id="card-back">
                <img src="./public/images/back.jpg" alt="" srcset="" />
              </div>
            </div>`;
      document.getElementById(index).innerHTML = imgDiv.innerHTML;
    });
    this.cards = Array.from(document.getElementsByClassName('card'));
    this.cards.forEach((card) => {
      card.addEventListener('click', () => {
        this.flipCard(card);
      });
    });
    /* this.botonJugarDeNuevo = document.getElementById("jugarDeNuevo");
    this.tablero = document.getElementById("tablero");
    this.mostrarPuntos = document.getElementById("puntos");
    this.mensaje = document.getElementById("mensaje");

    this.botonJugarDeNuevo.addEventListener("click", () => {
      this.playAgain();
    });

    for (let i = 0; i <= 15; i++) {
      document.getElementById(i.toString()).addEventListener("click", () => {
        this.jugada(i.toString());
      });
    } */
  }
}

const juego = new MemoTest();
juego.startGame();
