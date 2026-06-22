from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict, Any

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: Dict[str, Any]):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"Error broadcasting to client: {e}")
                self.disconnect(connection)

manager = ConnectionManager()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Just keep the connection alive, wait for client messages if needed
            data = await websocket.receive_text()
            # We don't necessarily need to respond to client messages here, 
            # this is mostly for broadcasting server events.
    except WebSocketDisconnect:
        manager.disconnect(websocket)
