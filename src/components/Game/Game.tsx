import { useState } from "react";

import "./Game.css";
import sprite from "../../assets/icons/sprite.svg?no-inline";

type Player = "red" | "yellow";
type Cell = Player | null;
type Board = Cell[][];

type Status =
  | { type: "playing" }
  | { type: "won", winner: Player }
  | { type: "draw" };

type Game = {
  board: Board;
  currentPlayer: Player;
  status: Status;
};

const cols = 7;
const rows = 6;

export default function Game() {
  const [game, setGame] = useState<Game>(createGame);

  function handleDropDisc(col: number) {
    setGame(game => dropDisc(game, col));
  }

  return (
    <div className="board">
      <div className="board__controls">
        {Array.from({ length: cols }, (_, colIndex) => (
          <div key={colIndex} className="board__column">
            <button className="board__btn" onClick={() => handleDropDisc(colIndex)}>
              <svg className="board__arrow">
                <use href={`${sprite}#arrow`} />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="board__grid">
        {game.board.map((row, rowIndex) => row.map((cell, colIndex) => (
          <div key={`${rowIndex}-${colIndex}`} className="board__cell">
          </div>
        )))}
      </div>
    </div>
  );
}

function createGame(): Game {
  return {
    board: createBoard(),
    currentPlayer: "red",
    status: { type: "playing" }
  };
}

function createBoard(): Board {
  return Array.from({ length: rows }, () => Array(cols).fill(null));
}

function dropDisc(game: Game, col: number): Game {
  const board = game.board.map(row => [...row]);
  const player = game.currentPlayer;

  for (let row = rows - 1; row >= 0; row--) {
    if (board[row][col] !== null) continue;

    board[row][col] = player;

    return {
      status: { type: "playing" },
      board: board,
      currentPlayer: player === "red" ? "yellow" : "red"
    };
  }

  return game;
}
