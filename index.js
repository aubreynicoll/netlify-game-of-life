import { Universe, Cell } from "@aubreynicoll/wasm-game-of-life";
import { memory } from "@aubreynicoll/wasm-game-of-life/wasm_game_of_life_bg";
import sleep from "./helpers/sleep";

const CELL_SIZE = 10;
const GRID_COLOR = "#CCCCCC";
const ALIVE_COLOR = "#000000";
const DEAD_COLOR = "#FFFFFF";

const universe = Universe.new();
const width = universe.width();
const height = universe.height();

const canvas = document.getElementById("game-of-life-canvas");
canvas.width = (CELL_SIZE + 1) * width + 1;
canvas.height = (CELL_SIZE + 1) * height + 1;

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

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const i = universe.get_index(row, col);
      ctx.fillStyle = cells[i] === Cell.Alive ? ALIVE_COLOR : DEAD_COLOR;
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

const renderLoop = async () => {
  universe.tick();

  drawGrid();
  drawCells();

  await sleep(100);

  requestAnimationFrame(renderLoop);
};

drawGrid();
drawCells();
requestAnimationFrame(renderLoop);
