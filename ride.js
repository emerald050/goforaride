const bike = document.getElementById("bike");
const basket = document.getElementById("flowerCount");
const prompt = document.getElementById("prompt");
const game = document.getElementById("game");

let flowers = [];
let collected = [];

let bikeX = 180;
let worldOffset = 0;

const MIN_BIKE = 120;
const MAX_BIKE = 420;

const files = [
  "flower1.png","flower2.png","flower3.png","flower4.png",
  "flower5.png","flower6.png","flower7.png","flower8.png",
  "flower9.png","flower10.png","flower11.png","flower12.png"
];

/* ================= FLOWERS ================= */

files.forEach((file, index) => {
  const flower = document.createElement("img");
  flower.src = file;
  flower.className = "flower";

  const base = 700 + index * 500;
  flower.dataset.base = base;

  flower.style.left = base + "px";
  flower.style.position = "absolute";

  game.appendChild(flower);
  flowers.push(flower);
});

/* ================= CONTROLS ================= */

const controls = document.createElement("div");
controls.id = "mobileControls";

controls.innerHTML = `
  <button id="leftBtn">◀</button>
  <button id="pickBtn" style="display:none;">PICK</button>
  <button id="rightBtn">▶</button>
`;

game.appendChild(controls);

bike.style.left = bikeX + "px";

/* ================= WORLD UPDATE ================= */

function updateWorld() {
  bike.style.left = bikeX + "px";

  flowers.forEach(flower => {
    const base = parseInt(flower.dataset.base);
    flower.style.left = (base - worldOffset) + "px";
  });

  highlightFlower();
  checkFinish();
}

/* ================= MOVEMENT ================= */

function moveRight() {
  if (bikeX < MAX_BIKE) bikeX += 14;
  worldOffset += 35;
  updateWorld();
}

function moveLeft() {
  if (bikeX > MIN_BIKE) bikeX -= 14;
  if (worldOffset > 0) worldOffset -= 35;
  updateWorld();
}

/* ================= FLOWER DETECTION ================= */

function highlightFlower() {
  let found = false;
  const pickBtn = document.getElementById("pickBtn");

  flowers.forEach(flower => {
    flower.classList.remove("active");

    if (flower.dataset.done) return;

    const x = parseInt(flower.style.left);

    if (Math.abs(x - bikeX) < 110) {
      flower.classList.add("active");
      found = true;
    }
  });

  if (found) {
    if (prompt) {
      prompt.style.display = "block";
      prompt.innerHTML = "press PICK to collect";
    }
    if (pickBtn) pickBtn.style.display = "block";
  } else {
    if (prompt) prompt.style.display = "none";
    if (pickBtn) pickBtn.style.display = "none";
  }
}

/* ================= COLLECT ================= */

const MAX_FLOWERS = 5;

function collectFlower() {
  if (collected.length >= MAX_FLOWERS) return;

  let nearby = null;

  flowers.forEach(flower => {
    if (flower.dataset.done) return;

    const x = parseInt(flower.style.left);

    if (Math.abs(x - bikeX) < 110) {
      nearby = flower;
    }
  });

  if (nearby) {
    nearby.dataset.done = "1";
    nearby.style.display = "none";

    collected.push(nearby.src);
    basket.innerHTML = collected.length;

    highlightFlower();

    // 🚨 EARLY GAME END IF 5 REACHED
    if (collected.length === MAX_FLOWERS) {
      endGame();
    }
  }
}
/* ================= FINISH (FIXED) ================= */

function endGame() {
  localStorage.setItem("flowers", JSON.stringify(collected));
  window.location.href = "bouquet.html";
}

function checkFinish() {
  const lastFlower = 700 + (files.length - 1) * 500;

  if (worldOffset > lastFlower + 300) {
    endGame();
  }
}

/* ================= BUTTONS ================= */

document.getElementById("leftBtn")?.addEventListener("click", moveLeft);
document.getElementById("rightBtn")?.addEventListener("click", moveRight);
document.getElementById("pickBtn")?.addEventListener("click", collectFlower);