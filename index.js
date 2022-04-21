const imagenesOrdenadas = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
class MemoTest {
  constructor() {
    /* Esto representa las cartas del memotest, en un futuro serán imágenes */
    /*  esto representa la grilla en la que aparecen las imágenes, a cada lugar de la grilla se le asigna una "imágen" */
    this.grilla = {};
    this.primeraPosicion;
    this.segundaPosicion;
    this.seguirJugando = true;
    this.puntos = 0;
    this.posicionesAcertadas = [];
    this.imagenes = imagenesOrdenadas.sort(function () {
      return Math.random() - 0.5;
    });

    for (let i = 0; i < this.imagenes.length; i++) {
      this.grilla[i] = this.imagenes[i];
    }
    console.log(this.grilla);
  }

  cargarPrimeraPosicion() {
    this.primeraPosicion = parseInt(this.inputPrimeraPosicion.value);
    if (!this.esPosicionValida(this.primeraPosicion)) {
      const mensaje = !this.esNumero(this.primeraPosicion)
        ? "Eso no es un número. Ingresá un número"
        : "La posición no es válida. Ingresá un número del 0 al 15";
      this.primerMensaje.innerHTML = mensaje;
    } else {
      this.primerMensaje.innerHTML =
        "En la posición que ingresaste está la carta " +
        this.grilla[this.primeraPosicion];
    }
  }

  cargarSegundaPosicion() {
    this.segundaPosicion = parseInt(this.inputSegundaPosicion.value);
    if (!this.esPosicionValida(this.segundaPosicion)) {
      const mensaje = !this.esNumero(this.segundaPosicion)
        ? "Eso no es un número. Ingresá un número"
        : "La posición no es válida. Ingresá un número del 0 al 15";
      this.segundoMensaje.innerHTML = mensaje;
    } else if (this.primeraPosicion === this.segundaPosicion) {
      this.segundoMensaje.innerHTML =
        "La posición no es válida. Ingresá un número distinto a la primera posición";
    } else {
      this.segundoMensaje.innerHTML =
        "En la posición que ingresaste está la carta " +
        this.grilla[this.segundaPosicion];
    }
    this.comprobarSiFueIngresada();
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
      this.grilla[this.primeraPosicion] === this.grilla[this.segundaPosicion] &&
      this.primeraPosicion != this.segundaPosicion &&
      !this.comprobarSiFueIngresada()
    ) {
      this.tercerMensaje.innerHTML = "¡Felicitaciones! Acertaste";
      this.contarPuntos();
      this.guardarPosicionesAcertadas();
    } else if (
      this.comprobarSiFueIngresada() ||
      this.primeraPosicion === this.segundaPosicion
    ) {
      this.segundoMensaje.innerHTML = "Ya ingresaste esa posición";
    } else {
      this.tercerMensaje.innerHTML = "No acertaste:(";
    }
    this.seguirJugandoBtn.style.display = "block";
  }

  contarPuntos() {
    this.puntos++;
    this.mostrarPuntos.innerHTML = "Puntos: " + this.puntos;
  }
  guardarPosicionesAcertadas() {
    this.posicionesAcertadas.push(this.primeraPosicion);
    this.posicionesAcertadas.push(this.segundaPosicion);
  }

  comprobarSiFueIngresada() {
    if (
      this.posicionesAcertadas.includes(this.primeraPosicion) ||
      this.posicionesAcertadas.includes(this.segundaPosicion)
    ) {
      return true;
    }
  }
  jugarTurno() {}

  comenzarJuego() {
    this.inputPrimeraPosicion = document.getElementById("primeraPosicion");
    this.inputSegundaPosicion = document.getElementById("segundaPosicion");
    this.primeraPosBtn = document.getElementById("primeraPosBtn");
    this.segundaPosBtn = document.getElementById("segundaPosBtn");
    this.primerMensaje = document.getElementById("mensaje1");
    this.segundoMensaje = document.getElementById("mensaje2");
    this.tercerMensaje = document.getElementById("mensaje3");
    this.seguirJugandoBtn = document.getElementById("seguirJugandoBtn");
    this.mostrarPuntos = document.getElementById("puntos");

    this.primeraPosBtn.addEventListener("click", () => {
      this.cargarPrimeraPosicion();
    });

    this.segundaPosBtn.addEventListener("click", () => {
      this.cargarSegundaPosicion();
      this.compararImagenes();
    });
    this.seguirJugandoBtn.addEventListener("click", () => {
      this.seguirJugandoBtn.style.display = "none";
      this.primerMensaje.innerHTML = "";
      this.segundoMensaje.innerHTML = "";
      this.tercerMensaje.innerHTML = "";
      this.inputPrimeraPosicion.value = "";
      this.inputSegundaPosicion.value = "";
      console.log(this.posicionesAcertadas);
    });
  }
}

const juego = new MemoTest();
juego.comenzarJuego();
