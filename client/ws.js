const socket = new WebSocket("ws://localhost:8000/ws");

socket.addEventListener("open", () => {
  console.log("Connected to WebSocket server.");
});

socket.addEventListener("message", (event) => {
  const msg = JSON.parse(event.data);

  if (msg.type === "draw") {
    drawFromServer(msg.data);
  } else if (msg.type === "clear") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
});

// Function to send drawing data to server
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

// Function to send clear command to server
function emitClear() {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "clear" }));
  }
}

// Function to draw on canvas when receiving data from server
function drawFromServer({ x0, y0, x1, y1, color, thickness }) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;
  ctx.lineCap = "round";
  ctx.stroke();
}

// Expose functions globally so whiteboard.js can call them
window.emitDraw = emitDraw;
window.emitClear = emitClear;
