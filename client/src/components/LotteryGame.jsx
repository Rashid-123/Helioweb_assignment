import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  TextField,
  Typography,
  Alert,
  Box,
  Container,
} from "@mui/material";
import io from "socket.io-client";

const Backend_URL = process.env.REACT_APP_BACKEND_URL;
const socket = io(Backend_URL, {
  transports: ["websocket"],
  reconnection: true,
});

export default function LotteryGame() {
  const [grid1, setGrid1] = useState(
    Array.from({ length: 3 }, () => Array(3).fill(""))
  );
  const [grid2, setGrid2] = useState(
    Array.from({ length: 3 }, () => Array(3).fill(""))
  );
  const [gameId, setGameId] = useState(null);
  const [winner, setWinner] = useState(null);
  const [cutNumbers, setCutNumbers] = useState([]);
  const [error, setError] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const handleInputChange = (idx, rIdx, cIdx, value) => {
    if (!/^[1-9]?$/.test(value)) return;
    const newGrid = idx === 0 ? [...grid1] : [...grid2];
    if (newGrid.flat().includes(Number(value))) return;
    newGrid[rIdx][cIdx] = value ? Number(value) : "";
    idx === 0 ? setGrid1(newGrid) : setGrid2(newGrid);
  };

  const startGame = async () => {
    try {
      const res = await fetch(`${Backend_URL}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user1: grid1, user2: grid2 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setGameId(data.gameId);
      setError(null);
      setIsGameStarted(true);
      setWinner(null);
      setCutNumbers([]);
    } catch (error) {
      setError(error.message);
    }
  };

  const restartGame = () => {
    setGameId(null);
    setWinner(null);
    setCutNumbers([]);
    setGrid1(Array.from({ length: 3 }, () => Array(3).fill("")));
    setGrid2(Array.from({ length: 3 }, () => Array(3).fill("")));
    setIsGameStarted(false);
  };

  useEffect(() => {
    socket.on("update", ({ game }) => {
      setWinner(game.winner);
      setCutNumbers(game.cutNumbers);
    });
  }, []);

  const generateNumber = () => {
    if (gameId) socket.emit("generateNumber", { gameId });
  };

  return (
    <div>
      <Typography variant="h4">El Lotteria</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Container spacing={2} justifyContent="center">
        <Container>
          {[grid1, grid2].map((grid, idx) => (
            <Grid item xs={6} key={idx}>
              <Typography variant="h6">User {idx + 1}</Typography>
              {grid.map((row, rIdx) => (
                <Grid container key={rIdx} spacing={1} justifyContent="center">
                  {row.map((num, cIdx) => (
                    <Grid item key={cIdx}>
                      <TextField
                        value={num}
                        onChange={(e) =>
                          handleInputChange(idx, rIdx, cIdx, e.target.value)
                        }
                        disabled={cutNumbers.includes(num)}
                        sx={{
                          width: 55,
                          height: 55,
                          textAlign: "center",
                          backgroundColor: cutNumbers.includes(num)
                            ? "red"
                            : "white",
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              ))}
            </Grid>
          ))}
        </Container>
        <Container>
          <Button
            onClick={isGameStarted ? restartGame : startGame}
            style={{
              backgroundColor: isGameStarted ? "red" : "green",
              color: "white",
              padding: "10px 20px",
              margin: "10px",
              fontSize: "16px",
            }}
          >
            {isGameStarted ? "Restart Game" : "Start Game"}
          </Button>
          <Button
            onClick={generateNumber}
            disabled={winner !== null}
            style={{
              backgroundColor: "blue",
              color: "white",
              padding: "10px 20px",
              margin: "10px",
              fontSize: "16px",
            }}
          >
            Generate Number
          </Button>
          {winner && <Typography variant="h5">Winner: {winner}</Typography>}
          <Typography variant="h6">
            Cut Numbers: {cutNumbers.join(", ")}
          </Typography>
        </Container>
      </Container>
    </div>
  );
}
