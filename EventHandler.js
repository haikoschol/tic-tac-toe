export default class EventHandler {
  constructor(gameBoardElement, newGameButton, resetScoresButton) {
    this.gameBoardElement = gameBoardElement;
    this.newGameButton = newGameButton;
    this.resetScoresButton = resetScoresButton;
    this.gameManagerRef = null;
  }

  init(gameManagerRef) {
    this.gameManagerRef = gameManagerRef;
    this.gameBoardElement.addEventListener("click", (event) => this._handleCellClick(event));
    this.newGameButton.addEventListener("click", () => this._handleNewGameClick());
    this.resetScoresButton.addEventListener("click", () => this._handleResetScoresClick());
  }

  _handleCellClick(event) {
    const targetCell = event.target.closest(".cell");
    if (!targetCell || !this.gameBoardElement.contains(targetCell)) {
      return;
    }

    const index = Number(targetCell.dataset.index);
    if (!Number.isNaN(index)) {
      this.gameManagerRef.handlePlayerMove(index);
    }
  }

  _handleNewGameClick() {
    this.gameManagerRef.resetGame();
  }

  _handleResetScoresClick() {
    this.gameManagerRef.resetScores();
  }
}
