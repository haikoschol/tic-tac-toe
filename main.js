import AIPlayer from "./AIPlayer.js";
import EventHandler from "./EventHandler.js";
import GameLogic from "./GameLogic.js";
import GameManager from "./GameManager.js";
import Renderer from "./Renderer.js";

const boardElement = document.querySelector("#board");
const statusElement = document.querySelector("#status");
const scoreElement = document.querySelector("#scores");
const newGameButton = document.querySelector("#new-game");
const resetScoresButton = document.querySelector("#reset-scores");

if (!boardElement || !statusElement || !scoreElement || !newGameButton || !resetScoresButton) {
  throw new Error("Missing required DOM elements for Tic-Tac-Toe app initialization.");
}

const renderer = new Renderer(boardElement, statusElement, scoreElement);
const eventHandler = new EventHandler(boardElement, newGameButton, resetScoresButton);
const gameLogic = new GameLogic();
const aiPlayer = new AIPlayer();
const gameManager = new GameManager(renderer, eventHandler, gameLogic, aiPlayer);

gameManager.initializeGame();
