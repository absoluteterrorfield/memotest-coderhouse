class MemoTest {
  constructor() {
    /* Esto representa las cartas del memotest, en un futuro serán imágenes */
    this.imagenes = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
    /*  esto representa la grilla en la que aparecen las imágenes, a cada lugar de la grilla se le asigna una "imágen" */
    this.grilla = {};
    this.primeraPosicion;
    this.segundaPosicion;
    this.seguirJugando = true;

    this.imagenes = this.imagenes.sort(function () {
      return Math.random() - 0.5;
    });

    for (let i = 0; i < this.imagenes.length; i++) {
      this.grilla[i] = this.imagenes[i];
    }
    console.log(this.grilla);
  }

  pedirPrimeraPosicion() {
    this.primeraPosicion = parseInt(
      prompt("Ingresá la posición de la primera carta")
    );
    while (!this.esPosicionValida(this.primeraPosicion)) {
      const mensaje = !this.esNumero(this.primeraPosicion)
        ? "Eso no es un número. Ingresá un número"
        : "La posición no es válida. Ingresá un número del 0 al 15";
      this.primeraPosicion = parseInt(prompt(mensaje));
    }
  }

  pedirSegundaPosicion() {
    this.segundaPosicion = parseInt(
      prompt(
        `En la posición que ingresaste primero está la imagen ${
          this.grilla[this.primeraPosicion]
        }.Ahora ingresá la posición de la segunda carta`
      )
    );
    while (!this.esPosicionValida(this.segundaPosicion)) {
      const mensaje = !this.esNumero(this.segundaPosicion)
        ? "Eso no es un número. Ingresá un número"
        : "La posición no es válida. Ingresá un número del 0 al 15";
      this.segundaPosicion = parseInt(prompt(mensaje));
    }
  }

  esNumero(dato) {
    return !isNaN(dato);
  }

  esPosicionValida(dato) {
    if (this.esNumero(dato)) {
      if (dato >= 0 && dato <= 15) {
        return true;
      }
    }
  }

  compararImagenes() {
    if (
      this.grilla[this.primeraPosicion] === this.grilla[this.segundaPosicion]
    ) {
      alert(
        `Las imágenes que ingresaste son la ${
          this.grilla[this.primeraPosicion]
        } y la ${this.grilla[this.segundaPosicion]}. Acertaste!`
      );
    } else {
      alert(
        `Las imágenes que ingresaste son la ${
          this.grilla[this.primeraPosicion]
        } y la ${this.grilla[this.segundaPosicion]}. No acertaste:(`
      );
    }
  }

  jugarTurno() {
    this.pedirPrimeraPosicion();
    this.pedirSegundaPosicion();
    while (this.primeraPosicion === this.segundaPosicion) {
      alert("No se puede ingresar dos veces la misma posición");
      this.pedirSegundaPosicion();
    }
    this.compararImagenes();
    this.seguirJugando = confirm("Desea seguir jugando?");
  }

  comenzarJuego() {
    alert("Hola! Vamos a jugar al memotest");
    this.jugarTurno();
    while (this.seguirJugando) {
      this.jugarTurno();
    }
    alert("Gracias por jugar!! Nos vemos la próxima :3");
  }
}

const juego = new MemoTest();
juego.comenzarJuego();
