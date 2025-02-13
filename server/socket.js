const { Server } = require("socket.io");
const Game = require("./Models/gameSchema");

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("generateNumber", async ({ gameId }) => {
      console.log(`Generate number request from: ${socket.id}`);
      try {
        const randomNum = Math.floor(Math.random() * 9) + 1;
        console.log(`Generated Number: ${randomNum}`);

        const game = await Game.findById(gameId);
        if (!game || game.cutNumbers.includes(randomNum)) return;

        game.cutNumbers.push(randomNum);
        await game.save();

        const checkWinner = (grid) => {
          for (let i = 0; i < 3; i++) {
            if (grid[i].every((num) => game.cutNumbers.includes(num)))
              return true;
            if ([0, 1, 2].every((j) => game.cutNumbers.includes(grid[j][i])))
              return true;
          }
          return false;
        };

        if (checkWinner(game.user1)) game.winner = "User 1";
        else if (checkWinner(game.user2)) game.winner = "User 2";

        await game.save();
        io.emit("update", { game });

        console.log("Game Updated & Emitted");
      } catch (error) {
        console.error("Error in generateNumber:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  // ---------- STREAM LISTNER -------------------
  Game.watch().on("change", async (change) => {
    try {
      if (change.operationType === "update") {
        const updatedGame = await Game.findById(change.documentKey._id);
        io.emit("update", { game: updatedGame });
      }
    } catch (error) {
      console.error("Error in MongoDB Change Stream:", error);
    }
  });

  return io;
}

module.exports = setupSocket;
