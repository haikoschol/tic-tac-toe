const PLACEMENT_ANIMATION_MS = 220;

export default class Renderer {
  constructor(boardElement, statusElement, scoreElement) {
    this.boardElement = boardElement;
    this.statusElement = statusElement;
    this.scoreElement = scoreElement;
    this.cells = Array.from(this.boardElement.querySelectorAll(".cell"));

    this.playerScoreElement = this.scoreElement.querySelector("#score-player");
    this.computerScoreElement = this.scoreElement.querySelector("#score-computer");
    this.drawScoreElement = this.scoreElement.querySelector("#score-draws");
  }

  renderBoard(board) {
    this.cells.forEach((cell, index) => {
      const symbol = board[index];
      cell.textContent = symbol ?? "";
      cell.dataset.symbol = symbol ?? "";
      cell.classList.toggle("filled", symbol !== null);
      cell.setAttribute(
        "aria-label",
        symbol ? `Row ${Math.floor(index / 3) + 1} Column ${(index % 3) + 1}: ${symbol}` : `Row ${Math.floor(index / 3) + 1} Column ${(index % 3) + 1}`,
      );
    });
  }

  renderStatus(message) {
    this.statusElement.textContent = message;
  }

  renderScores(scores) {
    this.playerScoreElement.textContent = String(scores.player);
    this.computerScoreElement.textContent = String(scores.computer);
    this.drawScoreElement.textContent = String(scores.draws);
  }

  highlightWinningLine(line) {
    line.forEach((index) => {
      const cell = this.cells[index];
      if (cell) {
        cell.classList.add("win");
      }
    });
  }

  animateCellPlacement(index, symbol) {
    const cell = this.cells[index];
    if (!cell) {
      return Promise.resolve();
    }

    cell.textContent = symbol;
    cell.classList.add("placed");

    return new Promise((resolve) => {
      window.setTimeout(() => {
        cell.classList.remove("placed");
        resolve();
      }, PLACEMENT_ANIMATION_MS);
    });
  }

  resetUI() {
    this.cells.forEach((cell) => {
      cell.classList.remove("win", "placed");
    });
    this.boardElement.classList.remove("shake");
  }

  setBoardInteractivity(isEnabled) {
    this.boardElement.classList.toggle("board-disabled", !isEnabled);
  }

  showInvalidMoveFeedback() {
    this.boardElement.classList.remove("shake");
    void this.boardElement.offsetWidth;
    this.boardElement.classList.add("shake");
  }
}
