# MessyColab

collab-app/
├── client/
│   ├── index.html
│   ├── style.css
│   ├── app.js          # UI interactions, buttons, tool selections
│   ├── whiteboard.js   # Fabric.js drawing logic
│   └── ws.js           # WebSocket connection, sending/receiving messages
├── server/
│   ├── main.py         # FastAPI app with endpoints and websocket
│   ├── gpt_utils.py    # GPT-related API calls
│   ├── session_store.py# Session and user management
│   └── requirements.txt# Python dependencies
├── shared/
│   └── .env.example    # Environment variables template
├── README.md
└── LICENSE
