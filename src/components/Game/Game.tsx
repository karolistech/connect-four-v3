import { useState } from "react";

import "./Game.css";
import sprite from "../../assets/icons/sprite.svg?no-inline";

type Player = "red" | "yellow";
type Cell = Player | null;
type Board = Cell[][];

type Mode = "7x6" | "8x7" | "9x8";

type Status =
  | { type: "playing" }
  | { type: "won", winner: Player }
  | { type: "draw" };

type Game = {
  mode: Mode;
  status: Status;
  board: Board;
  currentPlayer: Player;
};

type BoardSize = { cols: number; rows: number };

const boardSizes: Record<Mode, BoardSize> = {
  "7x6": { cols: 7, rows: 6 },
  "8x7": { cols: 8, rows: 7 },
  "9x8": { cols: 9, rows: 8 }
};

export default function Game() {
  const [game, setGame] = useState<Game>(() => createGame("7x6"));

  function handleDropDisc(col: number) {
    setGame(game => dropDisc(game, col));
  }

  return (
    <div className="board">
      <div className="board__modes">
        <button onClick={() => setGame(createGame(game.mode))}>
          New Game
        </button>

        <button onClick={() => setGame(createGame("7x6"))}>
          7 x 6
        </button>

        <button onClick={() => setGame(createGame("8x7"))}>
          8 x 7
        </button>

        <button onClick={() => setGame(createGame("9x8"))}>
          9 x 8
        </button>
      </div>

      <div className={`board__controls board__controls--${game.mode}`}>
        {Array.from({ length: boardSizes[game.mode].cols }, (_, colIndex) => (
          <div key={colIndex} className="board__column">
            <button className="board__btn" onClick={() => handleDropDisc(colIndex)}>
              <svg className="board__arrow-icon">
                <use href={`${sprite}#arrow`} />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className={`board__grid board__grid--${game.mode}`}>
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

function createGame(mode: Mode): Game {
  return {
    mode: mode,
    status: { type: "playing" },
    board: createBoard(boardSizes[mode]),
    currentPlayer: "red"
  };
}

function createBoard(boardSize: BoardSize): Board {
  return Array.from({ length: boardSize.rows }, () => Array(boardSize.cols).fill(null));
}

function dropDisc(game: Game, col: number): Game {
  if (game.status.type !== "playing") return game;

  const row = game.board.findLastIndex(row => row[col] === null);

  if (row === -1) return game;

  const mode = game.mode;
  const board = game.board.map(row => [...row]);
  const player = game.currentPlayer;

  board[row][col] = player;

  if (connectFour(board, row, col, player) === true) {
    return {
      mode: mode,
      status: { type: "won", winner: player },
      board: board,
      currentPlayer: player
    };
  }

  else if (boardFull(board) === true) {
    return {
      mode: mode,
      status: { type: "draw" },
      board: board,
      currentPlayer: player
    };
  }

  else {
    return {
      mode: mode,
      status: { type: "playing" },
      board: board,
      currentPlayer: player === "red" ? "yellow" : "red"
    };
  }
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

function boardFull(board: Board): boolean {
  return board.every(row => row.every(cell => cell !== null));
}

function getDiscClass(player: Player): string {
  const base = "board__disc";
  const color = `board__disc--${player}`;

  return [base, color].join(" ");
}

function getDiscIcon(player: Player): React.JSX.Element {
  const iconId = player === "red" ? "circle" : "star";

  return (
    <svg className="board__disc-icon">
      <use href={`${sprite}#${iconId}`} />
    </svg>
  );
}
