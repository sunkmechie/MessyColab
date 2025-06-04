import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev; limit in production
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Current working directory:", os.getcwd())

# Adjust this path to where your client folder is located
client_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "client")
print("Serving static files from:", client_dir)

# Serve client folder static assets under /static
app.mount("/static", StaticFiles(directory=client_dir), name="static")

# Serve index.html explicitly at root
@app.get("/")
async def root():
    return FileResponse(os.path.join(client_dir, "index.html"))

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"Client connected. Total clients: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            print(f"Client disconnected. Total clients: {len(self.active_connections)}")

    async def broadcast(self, message: str, sender: WebSocket):
        # Broadcast message to all except sender
        for connection in self.active_connections:
            if connection != sender:
                try:
                    await connection.send_text(message)
                except Exception as e:
                    print(f"Error sending message: {e}")

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Received message: {data[:100]}")  # Print first 100 chars for debug
            await manager.broadcast(data, sender=websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket)
