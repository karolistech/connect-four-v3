type Player = "red" | "yellow";
type Cell = Player | null;
type Board = Cell[][];

type Game = {
  board: Board;
};

const cols = 7;
const rows = 6;

export default function Game() {
  return (
    <div className="board">
    </div>
  );
}

function createBoard(): Board {
  return Array.from({ length: rows }, () => Array(cols).fill(null));
}
