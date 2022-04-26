const imagenesOrdenadas = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
class MemoTest {
  constructor() {
    /* Esto representa las cartas del memotest, en un futuro serán imágenes */
    /*  esto representa la grilla en la que aparecen las imágenes, a cada lugar de la grilla se le asigna una "imágen" */
    this.grilla = {};
    this.primeraPosicion;
    this.segundaPosicion;
    this.primeraCarta;
    this.segundaCarta;
    this.puntos = 0;
    this.posicionesAcertadas = [];
  }
  mezclarCartas() {
    this.imagenes = imagenesOrdenadas.sort(function () {
      return Math.random() - 0.5;
    });

    for (let i = 0; i < this.imagenes.length; i++) {
      this.grilla[i.toString()] = this.imagenes[i];
    }
    console.log(this.grilla);
  }
  mostrarCarta(posicion) {
    document.getElementById(posicion).innerHTML = this.grilla[posicion];
  }
  ocultarCarta(posicion) {
    document.getElementById(posicion).innerHTML = "";
  }
  jugada(posicion) {
    if (this.posicionesAcertadas.includes(posicion)) return;

    this.mostrarCarta(posicion);
    console.log(posicion);
    console.log(this.grilla[posicion]);
    if (!this.primeraCarta) {
      this.primeraPosicion = posicion;
      this.primeraCarta = this.grilla[posicion];
    } else {
      if (posicion === this.primeraPosicion) return;

      this.segundaPosicion = posicion;
      this.segundaCarta = this.grilla[posicion];
      this.compararImagenes();
    }
  }

  compararImagenes() {
    if (this.primeraCarta === this.segundaCarta) {
      this.contarPuntos();
      this.guardarPosicionesAcertadas();
      this.primeraPosicion = null;
      this.segundaPosicion = null;
      this.primeraCarta = null;
      this.segundaCarta = null;
    } else {
      setTimeout(() => {
        this.ocultarCarta(this.primeraPosicion);
        this.ocultarCarta(this.segundaPosicion);
        this.primeraPosicion = null;
        this.segundaPosicion = null;
        this.primeraCarta = null;
        this.segundaCarta = null;
      }, 700);
    }
  }

  contarPuntos() {
    this.puntos++;
    this.mostrarPuntos.innerHTML = "Puntos: " + this.puntos;
    if (this.puntos === 8) {
      this.tablero.style.display = "none";
      this.mensaje.style.display = "block";
    }
  }
  guardarPosicionesAcertadas() {
    this.posicionesAcertadas.push(this.primeraPosicion);
    this.posicionesAcertadas.push(this.segundaPosicion);
  }
  volverAJugar() {
    for (let i = 0; i <= 15; i++) {
      this.ocultarCarta(i.toString());
    }
    this.tablero.style.display = "block";
    this.mensaje.style.display = "none";
    this.puntos = 0;
    this.posicionesAcertadas = [];
    this.comenzarJuego();
  }
  comenzarJuego() {
    this.botonJugarDeNuevo = document.getElementById("jugarDeNuevo");
    this.tablero = document.getElementById("tablero");
    this.mostrarPuntos = document.getElementById("puntos");
    this.mensaje = document.getElementById("mensaje");
    this.botonJugarDeNuevo.addEventListener("click", () => {
      this.volverAJugar();
    });
    this.mezclarCartas();

    for (let i = 0; i <= 15; i++) {
      document.getElementById(i.toString()).addEventListener("click", () => {
        this.jugada(i.toString());
      });
    }
  }
}

const juego = new MemoTest();
juego.comenzarJuego();
