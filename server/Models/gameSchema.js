const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  user1: [[Number]],
  user2: [[Number]],
  cutNumbers: { type: [Number], default: [] },
  winner: { type: String, default: null },
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
