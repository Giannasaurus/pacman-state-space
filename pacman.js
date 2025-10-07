const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')
const info = document.getElementById('info');
const scaredSign = document.getElementById('scared');
const tileSize = 20;

const map = [
    "###############################",
    "#.#....o....##  o#. o####.....#",
    "#.# #######.###.## #######o## #",
    "# o..        #o..#............#",
    "#####  .###..   o ..#o#...#.###",
    "#o###.#####.#######.###.#.#####",
    "#    ..o.... ...o   #  o#    .#",
    "###############################"
]

let pacman = { x: 1, y: 3, dx: 0, dy: 0 }
let dotsEaten = 0;
let pelletsEaten = 0;
let scaredTime = 0;
let totalDots = 0;
let totalPellets = 0;
let elapsedTime = 0;

for (let row of map) {
    for (let c of row) {
        if (c === '.') totalDots++;
        if (c === 'o') totalPellets++;
    }
}

function drawMap() {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            const char = map[y][x];
            if (char === '#') {
                ctx.strokeStyle = "blue";
                ctx.lineWidth = 2;
                ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
            else if (char === '.') {
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(x * tileSize + 10, y * tileSize + 10, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            else if (char === 'o') {
                ctx.fillStyle = "white";
                ctx.beginPath();
                ctx.arc(x * tileSize + 10, y * tileSize + 10, 5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

function drawPacman() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(pacman.x * tileSize + 10, pacman.y * tileSize + 10, 10, 0.25 * Math.PI, 1.75 * Math.PI);
    ctx.lineTo(pacman.x * tileSize + 10, pacman.y * tileSize + 10);
    ctx.fill();
}

function canMove(x, y) {
    return map[y][x] !== '#' && map[y][x] !== ' ';
}

document.addEventListener('keydown', e => {
    let nextX = pacman.x;
    let nextY = pacman.y;

    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") nextY--;
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") nextY++;
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") nextX--;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") nextX++;

    if (map[nextY][nextX] !== '#') {
        pacman.x = nextX;
        pacman.y = nextY;
        elapsedTime++;

        const tile = map[nextY][nextX];
        let atePellet = false;

        if (tile === '.') {
            dotsEaten++;
            map[nextY] = map[nextY].substring(0, nextX) + ' ' + map[nextY].substring(nextX + 1);
        } else if (tile === 'o') {
            pelletsEaten++;
            scaredTime = 16;
            atePellet = true;
            map[nextY] = map[nextY].substring(0, nextX) + ' ' + map[nextY].substring(nextX + 1);
        }

        // Only decrement if not just ate a pellet
        if (scaredTime > 0 && !atePellet) scaredTime--;
    }

    updateInfo();
});

function updateInfo() {
    const cartesian = `(${pacman.x}, ${pacman.y})`;
    info.innerHTML = `
        ⏱️ Time: ${elapsedTime}s<br>
        📍 Position: ${cartesian}<br>
        🍬 Dots Eaten: ${dotsEaten}/${totalDots}<br>
        🍒 Power Pellets: ${pelletsEaten}/${totalPellets}<br>
        👻 Scared Time Left: ${scaredTime > 0 ? scaredTime : 0}s
      `;
    scaredSign.textContent = scaredTime > 0 ? 'SCARED!' : 'NOT SCARED :(';
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawPacman();
    requestAnimationFrame(gameLoop);
}

updateInfo();
gameLoop();