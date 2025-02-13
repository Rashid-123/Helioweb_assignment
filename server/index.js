require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("./db_connection");
const setupSocket = require("./socket");
const { startGame } = require("./controllers/gameController");

const app = express();
const server = http.createServer(app);
const io = setupSocket(server);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.post("/start", startGame);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
