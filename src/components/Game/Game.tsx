import { useState } from "react";

import "./Game.css";
import sprite from "../../assets/icons/sprite.svg?no-inline";

type Player = "red" | "yellow";
type Cell = Player | null;
type Board = Cell[][];

type BoardSize = "7x6" | "8x7" | "9x8";

type Status =
  | { type: "playing" }
  | { type: "won", winner: Player }
  | { type: "draw" };

type Game = {
  boardSize: BoardSize;
  status: Status;
  board: Board;
  currentPlayer: Player;
};

type Dimensions = { cols: number; rows: number };

const boardSizes: Record<BoardSize, Dimensions> = {
  "7x6": { cols: 7, rows: 6 },
  "8x7": { cols: 8, rows: 7 },
  "9x8": { cols: 9, rows: 8 }
};

export default function Game() {
  const [game, setGame] = useState<Game>(() => createGame("7x6"));

  function handleDropDisc(col: number) {
    setGame(game => dropDisc(game, col));
  }

  function changeBoardSize(boardSize: BoardSize) {
    setGame(createGame(boardSize));
  }

  function newGame() {
    setGame(createGame(game.boardSize));
  }

  return (
    <div className="board">
      <div className="board__controls">
        <div className="board__sizes">
          <span className="board__size-label">Board Size:</span>

          <button className={getBoardSizeButtonClass("7x6", game.boardSize)} onClick={() => changeBoardSize("7x6")}>
            7 x 6
          </button>

          <button className={getBoardSizeButtonClass("8x7", game.boardSize)} onClick={() => changeBoardSize("8x7")}>
            8 x 7
          </button>

          <button className={getBoardSizeButtonClass("9x8", game.boardSize)} onClick={() => changeBoardSize("9x8")}>
            9 x 8
          </button>
        </div>

        <div className="board__actions">
          <button className="board__new-game-button" onClick={newGame}>
            New Game
          </button>

          <button className="board__rules-button">Rules</button>
        </div>
      </div>

      <div className={`board__columns board__columns--${game.boardSize}`}>
        {Array.from({ length: boardSizes[game.boardSize].cols }, (_, colIndex) => (
          <div key={colIndex} className="board__column">
            <button className="board__drop-button" onClick={() => handleDropDisc(colIndex)}>
              <svg className="board__arrow-icon">
                <use href={`${sprite}#arrow`} />
              </svg>
            </button>

            {game.status.type === "playing" && (
              <div className="board__disc--preview">
                <div className={getPreviewDiscClass(game.currentPlayer)}>
                  {getDiscIcon(game.currentPlayer)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={`board__grid board__grid--${game.boardSize}`}>
        {game.board.map((row, rowIndex) => row.map((cell, colIndex) => (
          <div key={`${rowIndex}-${colIndex}`} className="board__cell">
            {cell !== null && (
              <div className={getBoardDiscClass(cell, game.status)}>
                {getDiscIcon(cell)}
              </div>
            )}
          </div>
        )))}
      </div>
    </div>
  );
}

function createGame(boardSize: BoardSize): Game {
  return {
    boardSize: boardSize,
    status: { type: "playing" },
    board: createBoard(boardSizes[boardSize]),
    currentPlayer: "red"
  };
}

function createBoard(dimensions: Dimensions): Board {
  return Array.from({ length: dimensions.rows }, () => Array(dimensions.cols).fill(null));
}

function dropDisc(game: Game, col: number): Game {
  if (game.status.type !== "playing") return game;

  const row = game.board.findLastIndex(row => row[col] === null);

  if (row === -1) return game;

  const boardSize = game.boardSize;
  const board = game.board.map(row => [...row]);
  const player = game.currentPlayer;

  board[row][col] = player;

  if (connectFour(board, row, col, player) === true) {
    return {
      boardSize: boardSize,
      status: { type: "won", winner: player },
      board: board,
      currentPlayer: player
    };
  }

  else if (boardFull(board) === true) {
    return {
      boardSize: boardSize,
      status: { type: "draw" },
      board: board,
      currentPlayer: player
    };
  }

  else {
    return {
      boardSize: boardSize,
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

function getBoardSizeButtonClass(boardSize: BoardSize, currentBoardSize: BoardSize): string {
  const base = "board__size-button";
  const active = boardSize === currentBoardSize && "board__size-button--active";

  return [base, active].filter(Boolean).join(" ");
}

function getPreviewDiscClass(player: Player): string {
  return `board__disc board__disc--${player}`;
}

function getBoardDiscClass(player: Player, status: Status): string {
  const base = "board__disc";
  const color = `board__disc--${player}`;
  const faded = (status.type === "won" && status.winner !== player) && "board__disc--faded";

  return [base, color, faded].filter(Boolean).join(" ");
}

function getDiscIcon(player: Player): React.JSX.Element {
  const iconId = player === "red" ? "circle" : "star";

  return (
    <svg className="board__disc-icon">
      <use href={`${sprite}#${iconId}`} />
    </svg>
  );
}
