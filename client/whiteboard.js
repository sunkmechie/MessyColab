const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");

let drawing = false;
let tool = "pen";
let color = document.getElementById("colorPicker").value;
let thickness = document.getElementById("thickness").value;

let lastX = 0;
let lastY = 0;

// Resize canvas to fit the screen
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height =
    window.innerHeight -
    document.querySelector(".toolbar").offsetHeight -
    document.querySelector("header").offsetHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Update cursor style
function updateCursor() {
  if (tool === "pen") {
    canvas.style.cursor = "crosshair";
  } else if (tool === "eraser") {
    canvas.style.cursor = "not-allowed";
  }
}

// Handle drawing start
canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  lastX = e.offsetX;
  lastY = e.offsetY;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
});

// Handle drawing
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

  window.emitDraw(
    lastX,
    lastY,
    currentX,
    currentY,
    tool === "eraser" ? "#ffffff" : color,
    thickness
  );

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

// Color picker
document.getElementById("colorPicker").addEventListener("input", (e) => {
  color = e.target.value;
});

// Thickness slider
document.getElementById("thickness").addEventListener("input", (e) => {
  thickness = e.target.value;
});

// Switch to pen tool
document.getElementById("pen").addEventListener("click", () => {
  tool = "pen";
  updateCursor();
  setActiveTool("pen");
});

// Switch to eraser tool
document.getElementById("eraser").addEventListener("click", () => {
  tool = "eraser";
  updateCursor();
  setActiveTool("eraser");
});

// Clear canvas
document.getElementById("clear").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  window.emitClear();
});

// Update toolbar button highlight
function setActiveTool(selected) {
  document.getElementById("pen").classList.remove("active");
  document.getElementById("eraser").classList.remove("active");
  document.getElementById(selected).classList.add("active");
}

// Initial state
updateCursor();
setActiveTool("pen");
