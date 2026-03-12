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

export default class AIPlayer {
  getComputerMove(board, computerSymbol, playerSymbol) {
    const availableMoves = this._getAvailableMoves(board);

    if (!availableMoves.length) {
      return -1;
    }

    const winningMove = this._findImmediateWin(board, computerSymbol);
    if (winningMove !== null) {
      return winningMove;
    }

    const blockingMove = this._findImmediateWin(board, playerSymbol);
    if (blockingMove !== null) {
      return blockingMove;
    }

    if (availableMoves.includes(4)) {
      return 4;
    }

    const cornerMoves = availableMoves.filter((move) => [0, 2, 6, 8].includes(move));
    if (cornerMoves.length) {
      return this._pickRandom(cornerMoves);
    }

    const sideMoves = availableMoves.filter((move) => [1, 3, 5, 7].includes(move));
    if (sideMoves.length) {
      return this._pickRandom(sideMoves);
    }

    return this._pickRandom(availableMoves);
  }

  _findImmediateWin(board, symbol) {
    for (const [a, b, c] of WINNING_LINES) {
      const line = [board[a], board[b], board[c]];
      const symbolCount = line.filter((cell) => cell === symbol).length;
      const emptyCount = line.filter((cell) => cell === null).length;

      if (symbolCount === 2 && emptyCount === 1) {
        if (board[a] === null) {
          return a;
        }
        if (board[b] === null) {
          return b;
        }
        return c;
      }
    }

    return null;
  }

  _getAvailableMoves(board) {
    return board.reduce((moves, value, index) => {
      if (value === null) {
        moves.push(index);
      }
      return moves;
    }, []);
  }

  _pickRandom(moves) {
    return moves[Math.floor(Math.random() * moves.length)];
  }
}
