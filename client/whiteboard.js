const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");

let drawing = false;
let tool = "pen";
let color = document.getElementById("colorPicker").value;
let thickness = document.getElementById("thickness").value;

// Resize canvas to fill the window
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - document.querySelector(".toolbar").offsetHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
  ctx.lineWidth = thickness;
  ctx.lineCap = "round";
  ctx.stroke();
});

canvas.addEventListener("mouseup", () => {
  drawing = false;
});

// Update color and thickness
document.getElementById("colorPicker").addEventListener("input", (e) => {
  color = e.target.value;
});

document.getElementById("thickness").addEventListener("input", (e) => {
  thickness = e.target.value;
});

// Tool selection logic with active button highlight
const buttons = document.querySelectorAll(".toolbar button");

function setActiveTool(selected) {
  buttons.forEach(btn => btn.classList.remove("active"));
  selected.classList.add("active");
}

document.getElementById("pen").addEventListener("click", (e) => {
  tool = "pen";
  setActiveTool(e.target);
});

document.getElementById("eraser").addEventListener("click", (e) => {
  tool = "eraser";
  setActiveTool(e.target);
});

document.getElementById("clear").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
