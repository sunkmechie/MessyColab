const socket = new WebSocket("ws://localhost:8000/ws");
const statusIndicator = document.getElementById("status-indicator");

// --- WebSocket status handling ---
socket.addEventListener("open", () => {
  console.log("Connected to WebSocket server.");
  updateStatus("connected");
});

socket.addEventListener("close", () => {
  console.log("WebSocket connection closed.");
  updateStatus("disconnected");
});

socket.addEventListener("error", () => {
  console.log("WebSocket error occurred.");
  updateStatus("disconnected");
});

// --- Message handling ---
socket.addEventListener("message", (event) => {
  const msg = JSON.parse(event.data);

  if (msg.type === "draw") {
    drawFromServer(msg.data);
  } else if (msg.type === "clear") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
});

// --- UI updater for status ---
function updateStatus(status) {
  if (!statusIndicator) return;

  if (status === "connected") {
    statusIndicator.textContent = "● Connected";
    statusIndicator.classList.remove("status-disconnected");
    statusIndicator.classList.add("status-connected");
  } else {
    statusIndicator.textContent = "● Disconnected";
    statusIndicator.classList.remove("status-connected");
    statusIndicator.classList.add("status-disconnected");
  }
}

// --- Drawing and clearing functions ---
function emitDraw(x0, y0, x1, y1, color, thickness) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        type: "draw",
        data: { x0, y0, x1, y1, color, thickness },
      })
    );
  }
}

function emitClear() {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "clear" }));
  }
}

function drawFromServer({ x0, y0, x1, y1, color, thickness }) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;
  ctx.lineCap = "round";
  ctx.stroke();
}

window.emitDraw = emitDraw;
window.emitClear = emitClear;
