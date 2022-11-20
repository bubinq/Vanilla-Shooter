const body = document.getElementsByTagName("body")[0];
const board = document.getElementsByClassName("board")[0];
const player = document.getElementsByClassName("player")[0];
const circle = document.getElementsByClassName("circle")[0];
const bullet = document.getElementsByClassName("bullet")[0];
const enemyBullet = document.getElementsByClassName("enemyBullet")[0];
const overlay = document.getElementsByClassName("overlay")[0];
const shot = document.querySelector("audio")

shot.load()

let mainLoop;
let game30;
let bullets = [];

const bulletPos = {
  x: -2000,
  y: -2000,
  deg: 0,
  velocity: {
    x: 0,
    y: 0,
  },
};
const enemyBulletPos = {
  x: -2000,
  y: -2000,
  deg: 0,
  velocity: {
    x: 0,
    y: 0,
  },
}
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
      position.y = board.getClientRects()[0].height - player_H;
    }
  } else if (keys.down) {
    position.y += SPEED;
    if (position.y > board.getClientRects()[0].height - player_H) {
      position.y = 0;
    }
  } else if (keys.left) {
    position.x -= SPEED;
    if (position.x < 0) {
      position.x = board.getClientRects()[0].width- player_W;
    }
  } else if (keys.right) {
    position.x += SPEED;
    if (position.x > board.getClientRects()[0].width - player_W) {
      position.x = 0;
    }
  }
}

function spawnCircle() {
  circlePos.x =
    Math.random() *
    (board.getClientRects()[0].width / 2 - circle.getClientRects()[0].width);
  circlePos.y =
    Math.random() *
    (board.getClientRects()[0].height / 2 - circle.getClientRects()[0].height);
}

function fireEnemyBullets() {
  let target = Math.atan2(position.y + player_H/2 - circlePos.y, position.x + player_H/2 - circlePos.x)
  let angleinDegrees =
    (Math.atan2(position.y + 15 - circlePos.y, position.x + 15 - circlePos.x) * 180) / Math.PI +
    180;

  const velocity = {
    x: Math.cos(target) * Math.random() * 30,
    y: Math.sin(target) * Math.random() * 30
  }
  enemyBulletPos.x = circlePos.x
  enemyBulletPos.y = circlePos.y
  enemyBulletPos.deg = angleinDegrees
  enemyBulletPos.velocity = velocity
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
  const width = circle.getClientRects()[0].width;
  const height = circle.getClientRects()[0].height;
  if (width > 2 && height > 2) {
    overlay.classList.add("invisible");
  } else {
    overlay.classList.remove("invisible");
    clearInterval(mainLoop);
    setTimeout(() => {
      if (window.confirm("Play again?")) {
        location.reload();
      }
    }, 2000);
  }
}
function checkStrike() {
  const dist = Math.hypot(circlePos.x - bulletPos.x, circlePos.y - bulletPos.y)
  if (dist - (circle.getClientRects()[0].width / 2) - (bullet.getClientRects()[0].width / 2) < 1) {
    return true;
  }
}

function moveBullet() {
  bullet.style.rotate = `${bulletPos.deg + 90}deg`;
  bullet.style.left = `${(bulletPos.x = bulletPos.x + bulletPos.velocity.x)}px`;
  bullet.style.top = `${(bulletPos.y = bulletPos.y + bulletPos.velocity.y)}px`;
}

function moveEnemeyBullets() {
  enemyBullet.style.rotate = `${enemyBulletPos.deg + 90}deg`;
  enemyBullet.style.left = `${(enemyBulletPos.x = enemyBulletPos.x + enemyBulletPos.velocity.x)}px`;
  enemyBullet.style.top = `${(enemyBulletPos.y = enemyBulletPos.y + enemyBulletPos.velocity.y)}px`;
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
  moveBullet();
  moveCircle();
  moveEnemeyBullets();
  movePlayer();

  if (bullets.length >= 3) {
    board.removeEventListener("mousedown", fireBullets);
  }
  checkBoardCollision();
  if (checkStrike()) {
    circle.style.width = `${circle.getClientRects()[0].width - 0.5}px`;
    circle.style.height = `${circle.getClientRects()[0].height - 0.5}px`;
  }
  checkWin();
}

mainLoop = setInterval(() => {
  main();
}, 1000 / 60);

game30 = setInterval(() => {
  spawnCircle();
  fireEnemyBullets();
}, 1000);

function reloadBullets() {
  bullets = [];
  board.addEventListener("mousedown", fireBullets);
}

function fireBullets(ev) {
  shot.currentTime = 0
  const x = ev.clientX;
  const y = ev.clientY;
  const playerHorCentre = position.x + player_W / 2;
  const playerVertCentre = position.y + player_H / 2;

  let angleInRadiants = Math.atan2(y - playerVertCentre, x - playerHorCentre);

  const velocity = {
    x: Math.cos(angleInRadiants) * 30,
    y: Math.sin(angleInRadiants) * 30,
  };
  let angleinDegrees =
    (Math.atan2(playerVertCentre - y, playerHorCentre - x) * 180) / Math.PI +
    180;

  bulletPos.deg = angleinDegrees;
  bulletPos.x = position.x;
  bulletPos.y = position.y;
  bulletPos.velocity = velocity;

  bullets.push(bulletPos);
  shot.play()
}

setInterval(reloadBullets, 1500);

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
