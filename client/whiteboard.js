const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");

let drawing = false;
let tool = "pen";
let color = document.getElementById("colorPicker").value;
let thickness = document.getElementById("thickness").value;

let lastX = 0;
let lastY = 0;

// Resize canvas to fill the window minus toolbar height
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - document.querySelector(".toolbar").offsetHeight - document.querySelector("header").offsetHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Start drawing
canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  lastX = e.offsetX;
  lastY = e.offsetY;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
});

// Draw and emit draw event for synchronization
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

  // Emit draw event to WebSocket server
  window.emitDraw(lastX, lastY, currentX, currentY, tool === "eraser" ? "#ffffff" : color, thickness);

  lastX = currentX;
  lastY = currentY;
});

// Stop drawing
canvas.addEventListener("mouseup", () => {
  drawing = false;
});

canvas.addEventListener("mouseout", () => {
  drawing = false;
});

// Update color when user picks a new color
document.getElementById("colorPicker").addEventListener("input", (e) => {
  color = e.target.value;
});

// Update thickness when user changes range slider
document.getElementById("thickness").addEventListener("input", (e) => {
  thickness = e.target.value;
});

// Switch to pen tool
document.getElementById("pen").addEventListener("click", () => {
  tool = "pen";
});

// Switch to eraser tool
document.getElementById("eraser").addEventListener("click", () => {
  tool = "eraser";
});

// Clear canvas locally and emit clear event to server
document.getElementById("clear").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  window.emitClear();
});
