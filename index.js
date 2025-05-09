const express = require("express");
const path = require("path");

const app = express();
const port = 3002;

//checa se o jogo esta rodando

let gameIsRunning = false;

//variaveis do jogo

let raquete1Y = 120;
let raquete2Y = 120;
let bolaX = 250;
let bolaY = 150;
let bolaVelX = 7;
let bolaVelY = 7;
let pontuacao1 = 0;
let pontuacao2 = 0;

//dimensões

const canvasWidth = 500;
const canvasHeight = 300;
const raqueteWidth = 10;
const raqueteHeight = 60;

app.get("/move", (req, res) => {
  const { player, direction } = req.query;

  if (!player || !direction) {
    return res.status(400).send("Parametros invalido");
  }

  gameIsRunning = true;
  const velocidadeRaquete = 10;

  if (player === "1") {
    if (direction === "down" && raquete1Y < canvasHeight - raqueteHeight) {
      raquete1Y += velocidadeRaquete;
    }
    if (direction === "up" && raquete1Y > 0) {
      raquete1Y -= velocidadeRaquete;
    }
  } else if (player === "2") {
    if (direction === "down" && raquete2Y < canvasHeight - raqueteHeight) {
      raquete2Y += velocidadeRaquete;
    }
    if (direction === "up" && raquete2Y > 0) {
      raquete2Y -= velocidadeRaquete;
    }
  }

  res.status(200).send("movimento registrado");
});

function atualizarJogo() {
  if (gameIsRunning) {
    bolaX += bolaVelX;
    bolaY += bolaVelY;

    if (bolaY <= 0 || bolaY >= canvasHeight) bolaVelY *= -1;

    if (
      bolaX <= raqueteWidth &&
      bolaY >= raquete1Y &&
      bolaY <= raquete1Y + raqueteHeight
    )
      bolaVelX *= -1;
    if (
      bolaX >= canvasWidth - raqueteWidth &&
      bolaY >= raquete2Y &&
      bolaY <= raquete2Y + raqueteHeight
    )
      bolaVelX *= -1;

    if (bolaX >= canvasWidth) {
      pontuacao1++;
      resetarBola();
    }
    if (bolaX <= 0) {
      pontuacao2++;
      resetarBola();
    }

    if (pontuacao1 >= 10 || pontuacao2 >= 10) {
      pontuacao1 = 0;
      pontuacao2 = 0;
      gameIsRunning = false;
    }
  }
}

function resetarBola() {
  bolaX = canvasWidth / 2;
  bolaY = canvasHeight / 2;
  bolaVelX *= -1;
}

app.get("/estado", (req, res) => {
  res.json({ bolaX, bolaY, raquete1Y, raquete2Y, pontuacao1, pontuacao2 });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "templete", "index.html"));
});

setInterval(atualizarJogo, 50);

app.listen(port, () => {
  console.log(`Servidor rodando em http://192.168.1.15:${port}`);
});
