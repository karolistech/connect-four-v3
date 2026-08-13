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
              <svg className="board__btn-icon">
                <use href={`${sprite}#arrow`} />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="board__grid">
        {game.board.map((row, rowIndex) => row.map((cell, colIndex) => (
          <div key={`${rowIndex}-${colIndex}`} className="board__cell">
            {cell !== null && (
              <div className={getDiscClass(cell)}>
                {getDiscIcon(cell)}
              </div>
            )}
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
  if (game.status.type !== "playing") return game;

  const board = game.board.map(row => [...row]);
  const player = game.currentPlayer;

  for (let row = rows - 1; row >= 0; row--) {
    if (board[row][col] !== null) continue;

    board[row][col] = player;

    if (connectFour(board, row, col, player) === true) {
      return {
        status: { type: "won", winner: player },
        board: board,
        currentPlayer: player
      };
    }

    return {
      status: { type: "playing" },
      board: board,
      currentPlayer: player === "red" ? "yellow" : "red"
    };
  }

  return game;
}

function connectFour(board: Board, row: number, col: number, player: Player): boolean {
  const directions = [[0, 1], [1, 0], [1, 1], [1, -1]] as const;

  for (const [dr, dc] of directions) {
    let count = 1;

    for (let step = 1; step < 4; step++) {
      if (board[row + dr * step]?.[col + dc * step] === player) count++;
      else break;
    }

    for (let step = 1; step < 4; step++) {
      if (board[row - dr * step]?.[col - dc * step] === player) count++;
      else break;
    }

    if (count >= 4) return true;
  }

  return false;
}

function getDiscClass(player: Player): string {
  const base = "board__disc";
  const color = `board__disc--${player}`;

  return [base, color].join(" ");
}

function getDiscIcon(player: Player): React.JSX.Element {
  return player === "red" ? (
    <svg className="board__disc-icon">
      <use href={`${sprite}#circle`} />
    </svg>
  ) : (
    <svg className="board__disc-icon">
      <use href={`${sprite}#star`} />
    </svg>
  );
}
