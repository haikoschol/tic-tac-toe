const COMPUTER_DELAY_MS = 550;

export default class GameManager {
  constructor(renderer, eventHandler, gameLogic, aiPlayer) {
    this.renderer = renderer;
    this.eventHandler = eventHandler;
    this.gameLogic = gameLogic;
    this.aiPlayer = aiPlayer;
    this.computerTurnTimer = null;

    this.gameState = {
      board: this.gameLogic.createBoard(),
      currentPlayer: null,
      playerSymbol: "X",
      computerSymbol: "O",
      gameActive: false,
      status: "playing",
      winner: null,
      winningLine: [],
      scores: {
        player: 0,
        computer: 0,
        draws: 0,
      },
      aiThinking: false,
    };
  }

  initializeGame() {
    this.eventHandler.init(this);
    this.renderer.renderBoard(this.gameState.board);
    this.renderer.renderScores(this.gameState.scores);
    this.startGame();
  }

  startGame() {
    this._clearComputerTimer();
    this.gameState.board = this.gameLogic.createBoard();
    this.gameState.currentPlayer = Math.random() < 0.5 ? this.gameState.playerSymbol : this.gameState.computerSymbol;
    this.gameState.gameActive = true;
    this.gameState.status = "playing";
    this.gameState.winner = null;
    this.gameState.winningLine = [];
    this.gameState.aiThinking = false;

    this.renderer.resetUI();
    this.renderer.renderBoard(this.gameState.board);

    if (this.gameState.currentPlayer === this.gameState.playerSymbol) {
      this.renderer.renderStatus("Your turn (X)");
      this.renderer.setBoardInteractivity(true);
    } else {
      this.renderer.renderStatus("Computer starts (O)");
      this.renderer.setBoardInteractivity(false);
      this.handleComputerMove();
    }
  }

  handlePlayerMove(index) {
    if (
      !this.gameState.gameActive ||
      this.gameState.currentPlayer !== this.gameState.playerSymbol ||
      this.gameState.aiThinking
    ) {
      return;
    }

    const availableMoves = this.gameLogic.getAvailableMoves(this.gameState.board);
    if (!availableMoves.includes(index)) {
      this.renderer.showInvalidMoveFeedback();
      return;
    }

    this.gameState.board = this.gameLogic.placeMark(this.gameState.board, index, this.gameState.playerSymbol);
    this.renderer.renderBoard(this.gameState.board);
    void this.renderer.animateCellPlacement(index, this.gameState.playerSymbol);

    const stateAfterMove = this.gameLogic.getGameState(this.gameState.board, this.gameState.playerSymbol);
    if (stateAfterMove.status === "win" || stateAfterMove.status === "draw") {
      this.endGame(stateAfterMove.status, stateAfterMove.winner, stateAfterMove.winningLine);
      return;
    }

    this.gameState.currentPlayer = this.gameState.computerSymbol;
    this.renderer.renderStatus("Computer is thinking...");
    this.renderer.setBoardInteractivity(false);
    this.handleComputerMove();
  }

  handleComputerMove() {
    if (!this.gameState.gameActive || this.gameState.currentPlayer !== this.gameState.computerSymbol) {
      return;
    }

    this.gameState.aiThinking = true;
    this._clearComputerTimer();

    this.computerTurnTimer = window.setTimeout(() => {
      if (!this.gameState.gameActive) {
        return;
      }

      const availableMoves = this.gameLogic.getAvailableMoves(this.gameState.board);
      if (!availableMoves.length) {
        this.endGame("draw", null, []);
        return;
      }

      let aiMove = this.aiPlayer.getComputerMove(
        this.gameState.board,
        this.gameState.computerSymbol,
        this.gameState.playerSymbol,
      );

      if (!availableMoves.includes(aiMove)) {
        aiMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      }

      this.gameState.board = this.gameLogic.placeMark(this.gameState.board, aiMove, this.gameState.computerSymbol);
      this.renderer.renderBoard(this.gameState.board);
      void this.renderer.animateCellPlacement(aiMove, this.gameState.computerSymbol);

      const stateAfterMove = this.gameLogic.getGameState(this.gameState.board, this.gameState.computerSymbol);
      if (stateAfterMove.status === "win" || stateAfterMove.status === "draw") {
        this.endGame(stateAfterMove.status, stateAfterMove.winner, stateAfterMove.winningLine);
        return;
      }

      this.gameState.currentPlayer = this.gameState.playerSymbol;
      this.gameState.aiThinking = false;
      this.renderer.renderStatus("Your turn (X)");
      this.renderer.setBoardInteractivity(true);
    }, COMPUTER_DELAY_MS);
  }

  endGame(status, winner, winningLine = []) {
    this._clearComputerTimer();
    this.gameState.gameActive = false;
    this.gameState.status = status;
    this.gameState.winner = winner;
    this.gameState.winningLine = winningLine;
    this.gameState.aiThinking = false;

    let statusMessage = "It's a draw!";
    if (status === "win" && winner === "player") {
      this.gameState.scores.player += 1;
      statusMessage = "You win!";
    } else if (status === "win" && winner === "computer") {
      this.gameState.scores.computer += 1;
      statusMessage = "Computer wins!";
    } else if (status === "draw") {
      this.gameState.scores.draws += 1;
    }

    this.renderer.renderScores(this.gameState.scores);
    this.renderer.renderStatus(statusMessage);
    this.renderer.setBoardInteractivity(false);
    if (status === "win") {
      this.renderer.highlightWinningLine(winningLine);
    }
  }

  resetGame() {
    this.startGame();
  }

  resetScores() {
    this.gameState.scores = {
      player: 0,
      computer: 0,
      draws: 0,
    };
    this.renderer.renderScores(this.gameState.scores);
  }

  _clearComputerTimer() {
    if (this.computerTurnTimer) {
      window.clearTimeout(this.computerTurnTimer);
      this.computerTurnTimer = null;
    }
  }
}
