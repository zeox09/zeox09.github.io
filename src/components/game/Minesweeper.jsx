import React, { useState, useEffect } from "react";

export default function Minesweeper({ rows = 8, cols = 8, mines = 6 }) {
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [score, setScore] = useState(0);
  const [nickname, setNickname] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);

  // 🧱 Crear tablero
  const createBoard = () => {
    let newBoard = Array(rows)
      .fill()
      .map(() =>
        Array(cols).fill({
          revealed: false,
          mine: false,
          adjacent: 0,
          flagged: false,
        })
      );

    // Colocar minas
    let placed = 0;
    while (placed < mines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      if (!newBoard[r][c].mine) {
        newBoard[r][c] = { ...newBoard[r][c], mine: true };
        placed++;
      }
    }

    // Calcular números
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (newBoard[r][c].mine) continue;
        let count = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const nr = r + i,
              nc = c + j;
            if (
              nr >= 0 &&
              nr < rows &&
              nc >= 0 &&
              nc < cols &&
              newBoard[nr][nc].mine
            )
              count++;
          }
        }
        newBoard[r][c] = { ...newBoard[r][c], adjacent: count };
      }
    }

    return newBoard;
  };

  // 🕹️ Inicializar tablero
  useEffect(() => {
    const savedLeaderboard =
      JSON.parse(localStorage.getItem("minesweeper_scores")) || [];
    setLeaderboard(savedLeaderboard);
    setBoard(createBoard());
  }, []);

  // ⏱️ Iniciar el tiempo
  const startGame = () => {
    setStartTime(Date.now());
  };

  // 💣 Revelar celda
  const reveal = (r, c) => {
    if (gameOver || !nickname) return;

    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    const cell = newBoard[r][c];

    if (cell.revealed || cell.flagged) return;

    if (!startTime) startGame();

    const floodReveal = (x, y) => {
      if (x < 0 || y < 0 || x >= rows || y >= cols) return;
      const cell = newBoard[x][y];
      if (cell.revealed || cell.flagged) return;
      cell.revealed = true;
      if (cell.adjacent === 0 && !cell.mine) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            floodReveal(x + i, y + j);
          }
        }
      }
    };

    if (cell.mine) {
      newBoard[r][c].revealed = true;
      setBoard(newBoard);
      setGameOver(true);
      alert("💣 ¡Perdiste!");
      return;
    }

    floodReveal(r, c);
    setBoard(newBoard);

    // ✅ Comprobar victoria
    const totalCells = rows * cols;
    const revealed = newBoard.flat().filter((cell) => cell.revealed).length;

    if (revealed === totalCells - mines) {
      const time = (Date.now() - startTime) / 1000;
      const newScore = Math.max(1000 - Math.floor(time * 10), 0);
      setScore(newScore);
      setWin(true);
      setGameOver(true);
      saveScore(newScore);
      alert(`🎉 ¡Ganaste! Tu puntaje: ${newScore}`);
    }
  };

  // 🚩 Marcar bandera
  const toggleFlag = (e, r, c) => {
    e.preventDefault();
    if (gameOver || board[r][c].revealed) return;
    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    newBoard[r][c].flagged = !newBoard[r][c].flagged;
    setBoard(newBoard);
  };

  // 🧾 Guardar puntuación
  const saveScore = (points) => {
    const newEntry = { nickname, points, date: new Date().toLocaleString() };
    const updated = [...leaderboard, newEntry]
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);

    setLeaderboard(updated);
    localStorage.setItem("minesweeper_scores", JSON.stringify(updated));
  };

  // 🔁 Reiniciar
  const resetGame = () => {
    setBoard(createBoard());
    setGameOver(false);
    setWin(false);
    setScore(0);
    setStartTime(null);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 text-white">
      <h1 className="text-2xl font-bold">💣 Buscaminas React</h1>

      {/* 🔐 Pedir pseudónimo */}
      {!nickname ? (
        <div className="flex flex-col items-center gap-2">
          <p>Introduce un pseudónimo (5 caracteres):</p>
          <input
            type="text"
            maxLength={5}
            className="text-black px-2 py-1 rounded"
            onChange={(e) => setNickname(e.target.value.toUpperCase())}
          />
        </div>
      ) : (
        <>
          <p>
            Jugador: <span className="font-bold">{nickname}</span>
          </p>

          {/* 🎯 Tablero */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${cols}, 40px)`,
              gridTemplateRows: `repeat(${rows}, 40px)`,
              gap: "4px",
            }}
          >
            {board.map((row, r) =>
              row.map((cell, c) => (
                <button
                  key={`${r}-${c}`}
                  onClick={() => reveal(r, c)}
                  onContextMenu={(e) => toggleFlag(e, r, c)}
                  className={`w-10 h-10 text-sm font-bold border rounded ${
                    cell.revealed
                      ? cell.mine
                        ? "bg-red-500 text-white"
                        : "bg-gray-300 text-black"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  {cell.revealed
                    ? cell.mine
                      ? "💣"
                      : cell.adjacent > 0
                      ? cell.adjacent
                      : ""
                    : cell.flagged
                    ? "🚩"
                    : ""}
                </button>
              ))
            )}
          </div>

          {/* 🔁 Botón reiniciar */}
          <button
            onClick={resetGame}
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Reiniciar
          </button>

          {/* 🏆 Tabla de clasificación */}
          <div className="mt-6 w-64 bg-gray-900 rounded p-4">
            <h2 className="text-lg font-bold mb-2 text-center">
              🏆 Clasificación
            </h2>
            <ul className="text-sm">
              {leaderboard.length === 0 && <li>No hay puntuaciones aún</li>}
              {leaderboard.map((entry, i) => (
                <li
                  key={i}
                  className="flex justify-between border-b border-gray-700 py-1"
                >
                  <span>
                    {i + 1}. {entry.nickname}
                  </span>
                  <span>{entry.points}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
