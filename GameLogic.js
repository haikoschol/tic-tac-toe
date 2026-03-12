const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default class GameLogic {
  createBoard() {
    return Array(9).fill(null);
  }

  placeMark(board, index, symbol) {
    if (!Array.isArray(board) || index < 0 || index > 8 || board[index] !== null) {
      return [...board];
    }

    const nextBoard = [...board];
    nextBoard[index] = symbol;
    return nextBoard;
  }

  getAvailableMoves(board) {
    return board.reduce((moves, value, index) => {
      if (value === null) {
        moves.push(index);
      }
      return moves;
    }, []);
  }

  checkWin(board, symbol) {
    for (const line of WINNING_LINES) {
      const [a, b, c] = line;
      if (board[a] === symbol && board[b] === symbol && board[c] === symbol) {
        return { isWin: true, line };
      }
    }

    return { isWin: false, line: [] };
  }

  checkDraw(board) {
    const hasEmptyCells = board.some((cell) => cell === null);
    if (hasEmptyCells) {
      return false;
    }

    return !WINNING_LINES.some(([a, b, c]) => board[a] && board[a] === board[b] && board[b] === board[c]);
  }

  getGameState(board, lastPlayerSymbol) {
    const { isWin, line } = this.checkWin(board, lastPlayerSymbol);

    if (isWin) {
      return {
        status: "win",
        winner: lastPlayerSymbol === "X" ? "player" : "computer",
        winningLine: line,
      };
    }

    if (this.checkDraw(board)) {
      return {
        status: "draw",
        winner: null,
        winningLine: [],
      };
    }

    return {
      status: "playing",
      winner: null,
      winningLine: [],
    };
  }
}
