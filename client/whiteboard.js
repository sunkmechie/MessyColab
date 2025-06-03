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
});

