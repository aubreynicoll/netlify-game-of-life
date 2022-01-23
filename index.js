import { Universe, Cell } from "@aubreynicoll/wasm-game-of-life";
import { memory } from "@aubreynicoll/wasm-game-of-life/wasm_game_of_life_bg";
import fps from "./classes/fps";

const CELL_SIZE = 10;
const GRID_COLOR = "#CCCCCC";
const ALIVE_COLOR = "#000000";
const DEAD_COLOR = "#FFFFFF";

let universe = Universe.new(false);
const width = universe.width();
const height = universe.height();

const canvas = document.getElementById("game-of-life-canvas");
canvas.width = (CELL_SIZE + 1) * width + 1;
canvas.height = (CELL_SIZE + 1) * height + 1;

canvas.addEventListener("click", (event) => {
  const boundingRect = canvas.getBoundingClientRect();

  const scaleX = canvas.width / boundingRect.width;
  const scaleY = canvas.height / boundingRect.height;

  const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
  const canvasTop = (event.clientY - boundingRect.top) * scaleY;

  const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
  const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);

  universe.toggle_cell(row, col);

  drawGrid();
  drawCells();
});

const ctx = canvas.getContext("2d");

const drawGrid = () => {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;
  ctx.lineWidth = 1;

  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  for (let i = 0; i <= width; i++) {
    ctx.moveTo(0, i * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width + 1, i * (CELL_SIZE + 1) + 1);
  }

  ctx.stroke();
};

const drawCells = () => {
  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

  ctx.beginPath();

  ctx.fillStyle = ALIVE_COLOR;
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);
      if (cells[idx] !== Cell.Alive) {
        continue;
      }

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  ctx.fillStyle = DEAD_COLOR;
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);
      if (cells[idx] !== Cell.Dead) {
        continue;
      }

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  ctx.stroke();
};

let animationHandle = null;

const renderLoop = async () => {
  fps.render();
  universe.tick();
  drawGrid();
  drawCells();
  animationHandle = requestAnimationFrame(renderLoop);
};

const isPaused = () => animationHandle === null;

const play = () => {
  playPauseButton.textContent = "pause";
  renderLoop();
};

const pause = () => {
  playPauseButton.textContent = "play";
  cancelAnimationFrame(animationHandle);
  animationHandle = null;
};

const playPauseButton = document.getElementById("play-pause");
playPauseButton.addEventListener("click", () => {
  isPaused() ? play() : pause();
});

const newRandomButton = document.getElementById("new-random");
newRandomButton.addEventListener("click", () => {
  universe = Universe.new(true);
  drawGrid();
  drawCells();
});

const newBlankButton = document.getElementById("new-blank");
newBlankButton.addEventListener("click", () => {
  universe = Universe.new(false);
  drawGrid();
  drawCells();
});

drawGrid();
drawCells();
pause();
