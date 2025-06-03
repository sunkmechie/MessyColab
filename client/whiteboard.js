const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");

let drawing = false;
let tool = "pen";
let color = document.getElementById("colorPicker").value;
let thickness = document.getElementById("thickness").value;

let lastX = 0;
let lastY = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - document.querySelector(".toolbar").offsetHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  lastX = e.offsetX;
  lastY = e.offsetY;
});

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;

  const currentX = e.offsetX;
  const currentY = e.offsetY;

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(currentX, currentY);
  ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
  ctx.lineWidth = thickness;
  ctx.lineCap = "round";
  ctx.stroke();

  // Send drawing data to server
  if (tool !== "eraser") {
    emitDraw(lastX, lastY, currentX, currentY, color, thickness);
  } else {
    emitDraw(lastX, lastY, currentX, currentY, "#ffffff", thickness);
  }

  lastX = currentX;
  lastY = currentY;
});

canvas.addEventListener("mouseup", () => {
  drawing = false;
});

document.getElementById("colorPicker").addEventListener("input", (e) => {
  color = e.target.value;
});

document.getElementById("thickness").addEventListener("input", (e) => {
  thickness = e.target.value;
});

document.getElementById("pen").addEventListener("click", () => {
  tool = "pen";
});

document.getElementById("eraser").addEventListener("click", () => {
  tool = "eraser";
});

document.getElementById("clear").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  emitClear();
});
