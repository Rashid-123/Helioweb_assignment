const Game = require("../Models/gameSchema");

const startGame = async (req, res) => {
  console.log("Start Game API Called");
  try {
    const { user1, user2 } = req.body;
    if (!isValidGrid(user1) || !isValidGrid(user2)) {
      return res.status(400).json({ message: "Invalid grid input" });
    }

    const newGame = new Game({ user1, user2, cutNumbers: [], winner: null });
    await newGame.save();
    console.log("New Game Created:", newGame);

    res.json({ gameId: newGame._id, message: "Game started!" });
  } catch (error) {
    console.error("Error in /start:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

function isValidGrid(grid) {
  const flatGrid = grid.flat();
  return (
    flatGrid.length === 9 &&
    new Set(flatGrid).size === 9 &&
    flatGrid.every((n) => n >= 1 && n <= 9)
  );
}

module.exports = { startGame };
