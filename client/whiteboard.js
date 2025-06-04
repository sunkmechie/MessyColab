// Initialize Fabric.js canvas and attach to window for ws.js access
const fabricCanvas = new fabric.Canvas('whiteboard', {
  isDrawingMode: true,
});
window.fabricCanvas = fabricCanvas;

// Setup initial tool and styles
let tool = 'pen';
let color = document.getElementById('colorPicker').value;
let thickness = parseInt(document.getElementById('thickness').value, 10);

// Resize canvas to fit screen
function resizeCanvas() {
  const toolbarHeight = document.querySelector('.toolbar').offsetHeight;
  const headerHeight = document.querySelector('header').offsetHeight;

  fabricCanvas.setWidth(window.innerWidth);
  fabricCanvas.setHeight(window.innerHeight - toolbarHeight - headerHeight);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Update Fabric.js brush properties based on tool, color, thickness
function updateBrush() {
  if (tool === 'pen') {
    fabricCanvas.isDrawingMode = true;
    fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
    fabricCanvas.freeDrawingBrush.color = color;
    fabricCanvas.freeDrawingBrush.width = thickness;
    fabricCanvas.freeDrawingBrush.decimate = 5; // smoothing
  } else if (tool === 'eraser') {
    fabricCanvas.isDrawingMode = true;
    fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
    fabricCanvas.freeDrawingBrush.color = '#ffffff'; // white eraser
    fabricCanvas.freeDrawingBrush.width = thickness * 2; // eraser a bit bigger
  } else {
    fabricCanvas.isDrawingMode = false;
  }
}
updateBrush();

// Emit Fabric.js path data on drawing complete
fabricCanvas.on('path:created', (event) => {
  const path = event.path;
  const pathData = {
    path: path.path, // Array of path commands
    options: {
      fill: path.fill,
      stroke: path.stroke,
      strokeWidth: path.strokeWidth,
      strokeLineCap: path.strokeLineCap,
      strokeLineJoin: path.strokeLineJoin,
      strokeMiterLimit: path.strokeMiterLimit,
      scaleX: path.scaleX,
      scaleY: path.scaleY,
      originX: path.originX,
      originY: path.originY,
      left: path.left,
      top: path.top,
      pathOffset: path.pathOffset,
      // Add any other relevant options you need to sync
    },
  };
  // Note: fabric.Path 'path' is an array of arrays, not an SVG string. We'll send it as JSON.
  window.emitFabricPath(pathData);
});

// Handle clear canvas button
document.getElementById('clear').addEventListener('click', () => {
  fabricCanvas.clear();
  window.emitClear();
});

// Toolbar events to update tool, color, thickness
document.getElementById('colorPicker').addEventListener('input', (e) => {
  color = e.target.value;
  updateBrush();
});

document.getElementById('thickness').addEventListener('input', (e) => {
  thickness = parseInt(e.target.value, 10);
  updateBrush();
});

document.getElementById('pen').addEventListener('click', () => {
  tool = 'pen';
  updateBrush();
  setActiveTool('pen');
});

document.getElementById('eraser').addEventListener('click', () => {
  tool = 'eraser';
  updateBrush();
  setActiveTool('eraser');
});

// Toolbar button highlight logic (unchanged)
function setActiveTool(selected) {
  document.getElementById('pen').classList.remove('active');
  document.getElementById('eraser').classList.remove('active');
  document.getElementById(selected).classList.add('active');
}
setActiveTool('pen');
