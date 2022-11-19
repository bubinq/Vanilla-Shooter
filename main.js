const body = document.getElementsByTagName("body")[0];
const board = document.getElementsByClassName("board")[0];
const player = document.getElementsByClassName("player")[0];
const circle = document.getElementsByClassName("circle")[0];
const bullet = document.getElementsByClassName("bullet")[0];
const overlay = document.getElementsByClassName("overlay")[0];

let mainLoop;
let game30;
let bullets = []

const bulletPos = {
  x: -2000,
  y: -2000,
  deg: 0,
  velocity: {
    x: 0,
    y: 0,
  },
};
const position = {
  x: 100,
  y: 100,
};

const circlePos = {
  x: 0,
  y: 0,
};
function checkBoardCollision() {
  if (keys.up) {
    position.y -= SPEED;
    if (position.y < 0) {
      position.y = 700 - player_H;
    }
  } else if (keys.down) {
    position.y += SPEED;
    if (position.y > 700 - player_H) {
      position.y = 0;
    }
  } else if (keys.left) {
    position.x -= SPEED;
    if (position.x < 0) {
      position.x = 700 - player_W;
    }
  } else if (keys.right) {
    position.x += SPEED;
    if (position.x > 700 - player_W) {
      position.x = 0;
    }
  }
}

function spawnCircle() {
  circlePos.x = Math.floor(Math.random() * 650);
  circlePos.y = Math.floor(Math.random() * 650);
}

const SPEED = 3;
const player_H = 30;
const player_W = 30;

const keys = {
  up: false,
  down: false,
  left: false,
  right: false,
};
function checkWin() {
  const width = circle.getClientRects()[0].width
  const height = circle.getClientRects()[0].height 
  if (width > 2 && height > 2) {
    overlay.classList.add("invisible")
  } else {
    overlay.classList.remove("invisible")
    clearInterval(mainLoop)
    setTimeout(() => {
      if (window.confirm("Play again?")) {
        location.reload()
    }
    }, 2000)
  }
  
}
function checkStrike() {
  if(bulletPos.x < circlePos.x + circle.getClientRects()[0].width &&
    bulletPos.x + bullet.getClientRects()[0].width - 10 > circlePos.x &&
    bulletPos.y < circlePos.y + circle.getClientRects()[0].height &&
    bullet.getClientRects()[0].height - 10 + bulletPos.y > circlePos.y) {
  
    return true
  }
}

function moveBullet () {
  console.log(bulletPos.velocity);
  bullet.style.rotate = `${bulletPos.deg + 90}deg`;
  bullet.style.left = `${(bulletPos.x = bulletPos.x + bulletPos.velocity.x)}px`;
  bullet.style.top = `${(bulletPos.y = bulletPos.y + bulletPos.velocity.y)}px`;
}

function moveCircle() {
  circle.style.left = `${circlePos.x}px`;
  circle.style.top = `${circlePos.y}px`;
}

function movePlayer() {
  player.style.left = `${position.x}px`;
  player.style.top = `${position.y}px`;
}

function main() {
  moveBullet()
  moveCircle()
  movePlayer()

  if(bullets.length >= 3) {
    board.removeEventListener("mousedown", fireBullets)
  }
  checkBoardCollision();
  if (checkStrike()) {
    circle.style.width = `${(circle.getClientRects()[0].width - 0.5)}px`;
    circle.style.height = `${(circle.getClientRects()[0].height - 0.5)}px`;
  }
  checkWin()
}

mainLoop = setInterval(() => {
  main()
}, 1000 / 60);

game30 = setInterval(() => {
  spawnCircle();
}, 1000);

function reloadBullets() {
  bullets = []
  board.addEventListener("mousedown", fireBullets)
}

function fireBullets(ev) {
  const x = ev.clientX;
  const y = ev.clientY;
  const playerHorCentre = position.x + player_W / 2;
  const playerVertCentre = position.y + player_H / 2;

  let angleInRadiants = Math.atan2(y - playerVertCentre, x - playerHorCentre);

  const velocity = {
    x: Math.cos(angleInRadiants) * 15,
    y: Math.sin(angleInRadiants) * 15,
  };
  let angleinDegrees =
    (Math.atan2(playerVertCentre - y, playerHorCentre - x) * 180) / Math.PI +
    180;

  bulletPos.deg = angleinDegrees;
  bulletPos.x = position.x;
  bulletPos.y = position.y;
  bulletPos.velocity = velocity;

  bullets.push(bulletPos)
}

setInterval(reloadBullets, 1500)

board.addEventListener("mousedown", fireBullets);

window.addEventListener("keydown", (ev) => {
  const keyName = ev.key;

  if (keyName === "w" || keyName === "ArrowUp") {
    keys.up = true;
  } else if (keyName === "s" || keyName === "ArrowDown") {
    keys.down = true;
  } else if (keyName === "a" || keyName === "ArrowLeft") {
    keys.left = true;
  } else if (keyName === "d" || keyName === "ArrowRight") {
    keys.right = true;
  }
});

window.addEventListener("keyup", (ev) => {
  const keyName = ev.key;

  if (keyName === "w" || keyName === "ArrowUp") {
    keys.up = false;
  } else if (keyName === "s" || keyName === "ArrowDown") {
    keys.down = false;
  } else if (keyName === "a" || keyName === "ArrowLeft") {
    keys.left = false;
  } else if (keyName === "d" || keyName === "ArrowRight") {
    keys.right = false;
  }
});
