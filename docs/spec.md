This Software Design Document (SDD) outlines the design for "Tic-Tac-Toe," a single-player game where the user plays against a computer opponent. The primary goal is to create a functional, engaging, and visually appealing game experience.

---

## 1. Introduction & Scope

### 1.1. Introduction
This document details the architectural and design decisions for the Tic-Tac-Toe application. The game will feature a standard 3x3 grid, allowing a human player to compete against an AI opponent. The focus is on a clean user interface, intuitive gameplay, and a "cool" aesthetic, along with robust error handling and maintainability.

### 1.2. Project Goals
*   **Engaging Gameplay:** Provide a smooth and intuitive single-player experience.
*   **Visually Appealing:** Implement a modern and "cool" user interface with subtle animations.
*   **Robustness:** Handle game states, user inputs, and potential errors gracefully.
*   **Maintainability:** Design with a modular architecture for easy future enhancements.
*   **Accessibility:** Ensure basic accessibility features are considered.

### 1.3. In-Scope Features
*   3x3 Tic-Tac-Toe game board.
*   Single-player mode (Human vs. AI).
*   Player is 'X', Computer is 'O'.
*   Random first turn selection.
*   Win, Lose, and Draw detection.
*   Score tracking (Player wins, Computer wins, Draws).
*   "New Game" and "Reset Scores" functionalities.
*   Basic AI opponent (non-trivial logic, but not unbeatable).
*   Visual feedback for player moves, computer moves, win/draw states.
*   Responsive design for various screen sizes.

### 1.4. Out-of-Scope Features
*   Multi-player mode (Human vs. Human).
*   Configurable AI difficulty levels.
*   Customizable player symbols or board sizes.
*   Advanced AI algorithms (e.g., Minimax for unbeatable play).
*   Sound effects or background music.
*   User accounts or persistent score saving across sessions.

---

## 2. System Architecture

### 2.1. High-Level Architecture
The application will follow a Model-View-Controller (MVC) or Model-View-ViewModel (MVVM) inspired architecture, tailored for a client-side JavaScript application. The core idea is to separate concerns into distinct modules responsible for game logic, state management, UI rendering, and event handling.

```mermaid
graph TD
    User -->|Interacts with| UI(User Interface)
    UI -->|Triggers events| EventHandler
    EventHandler -->|Updates state/Triggers actions| GameManager
    GameManager -->|Queries/Updates game state| GameLogic
    GameManager --|>|Instructs| AIPlayer
    AIPlayer -->|Suggests move| GameLogic
    GameLogic -->|Returns new state/results| GameManager
    GameManager -->|Notifies| UI(User Interface)
    UI -->|Renders changes| User
```

### 2.2. Component Breakdown

#### 2.2.1. `index.html`
*   The main entry point, providing the basic HTML structure for the game board, status display, and control buttons.
*   Links to CSS stylesheets and JavaScript modules.

#### 2.2.2. `style.css`
*   Handles all visual styling, layout, animations, and responsiveness.
*   Uses CSS variables for theming and easy customization.

#### 2.2.3. `GameManager.js`
*   **Responsibility:** The central orchestrator. Manages the overall game flow, current `gameState`, player turns, and score. Coordinates interactions between `GameLogic`, `AIPlayer`, and `EventHandler` (via callbacks).
*   **State Management:** Holds the single source of truth for the game state (board, scores, current player, game status).
*   **Key Functions:**
    *   `initializeGame()`: Sets up the initial game state, registers event listeners.
    *   `startGame()`: Resets the board, determines first player, initiates the first turn.
    *   `handlePlayerMove(index)`: Processes a player's move, updates state, checks for game end, triggers computer turn.
    *   `handleComputerMove()`: Invokes `AIPlayer` to get a move, processes it, updates state, checks for game end.
    *   `endGame(status, winner)`: Handles win/draw conditions, updates scores, notifies UI.
    *   `resetGame()`: Clears the board for a new round without resetting scores.
    *   `resetScores()`: Resets accumulated player and computer scores to zero.

#### 2.2.4. `GameLogic.js`
*   **Responsibility:** Provides pure functions to manipulate and query the board state. This module is stateless.
*   **Key Functions:**
    *   `createBoard()`: Initializes an empty 3x3 board.
    *   `placeMark(board, index, playerSymbol)`: Returns a *new* board array with the mark placed.
    *   `getAvailableMoves(board)`: Returns an array of indices for empty cells.
    *   `checkWin(board, playerSymbol)`: Checks if the given player has won. Returns boolean and winning line (if any).
    *   `checkDraw(board)`: Checks if the board is full and no one has won.
    *   `getGameState(board, lastPlayerSymbol)`: High-level function to return current status (playing, win, draw) and winner based on the `board` and `lastPlayerSymbol`.

#### 2.2.5. `AIPlayer.js`
*   **Responsibility:** Implements the computer opponent's logic for making a move. This module is stateless and receives the current board state as input.
*   **Key Functions:**
    *   `getComputerMove(board, computerSymbol, playerSymbol)`: Returns the index of the cell where the AI should place its mark.
    *   **Logic:**
        1.  **Check for immediate win:** If AI can win in one move, take it.
        2.  **Block player win:** If player can win in one move, block it.
        3.  **Take center:** If center is available, take it.
        4.  **Take corner:** If any corner is available, take a random one.
        5.  **Take side:** If any side is available, take a random one.
        6.  **Fallback:** If no other option, pick a random available cell.

#### 2.2.6. `Renderer.js`
*   **Responsibility:** Handles all UI updates and animations. It receives data from `GameManager` and updates the DOM accordingly.
*   **Key Functions:**
    *   `renderBoard(board)`: Updates the display of the grid cells.
    *   `renderStatus(message)`: Displays game status (e.g., "Player X's Turn", "You Win!").
    *   `renderScores(scores)`: Updates player, computer, and draw scores.
    *   `highlightWinningLine(line)`: Applies a visual effect to the winning three cells.
    *   `resetUI()`: Clears board and status for a new game.
    *   `animateCellPlacement(index, symbol)`: Animates the placement of a mark.

#### 2.2.7. `EventHandler.js`
*   **Responsibility:** Manages all user interactions (click events). It listens for DOM events and calls appropriate methods on `GameManager`.
*   **Key Functions:**
    *   `init(gameManagerRef)`: Initializes event listeners, linking them to the `GameManager` instance.
    *   `_handleCellClick(event)`: Processes a click on a game cell.
    *   `_handleNewGameClick()`: Processes a click on the "New Game" button.
    *   `_handleResetScoresClick()`: Processes a click on the "Reset Scores" button.

### 2.3. Interaction Flow

1.  **Application Load:**
    *   `index.html` loads `main.js`.
    *   `main.js` instantiates `GameManager`, `Renderer`, `EventHandler`, `GameLogic`, `AIPlayer`.
    *   `GameManager.initializeGame()` is called, which then calls `EventHandler.init()` to set up listeners and `Renderer.renderBoard()` to display an empty board.
    *   `GameManager.startGame()` is called to begin the first round.

2.  **Player's Turn:**
    *   `GameManager` determines it's the player's turn, `Renderer` updates status.
    *   User clicks an empty cell (via `EventHandler._handleCellClick`).
    *   `EventHandler` calls `gameManagerRef.handlePlayerMove(index)`.
    *   `GameManager` validates the move (using `GameLogic.getAvailableMoves`).
    *   `GameManager` calls `GameLogic.placeMark(currentBoard, index, playerSymbol)` to get the new board state.
    *   `GameManager` updates its internal `gameState`.
    *   `Renderer.animateCellPlacement()` and `Renderer.renderBoard()` update the UI.
    *   `GameManager` calls `GameLogic.getGameState(currentBoard, playerSymbol)` to check for win/draw.
    *   If game is over: `GameManager.endGame()` updates scores, `Renderer.renderStatus()`, `Renderer.highlightWinningLine()` as appropriate.
    *   If game continues: `GameManager` sets turn to computer and triggers `handleComputerMove()`.

3.  **Computer's Turn:**
    *   `GameManager` calls `AIPlayer.getComputerMove(currentBoard, computerSymbol, playerSymbol)`.
    *   `AIPlayer` returns an `index`.
    *   `GameManager` calls `GameLogic.placeMark(currentBoard, index, computerSymbol)` to get the new board state.
    *   `GameManager` updates its internal `gameState`.
    *   `Renderer.animateCellPlacement()` and `Renderer.renderBoard()` update the UI.
    *   `GameManager` calls `GameLogic.getGameState(currentBoard, computerSymbol)` to check for win/draw.
    *   If game is over: `GameManager.endGame()` updates scores, `Renderer.renderStatus()`, `Renderer.highlightWinningLine()` as appropriate.
    *   If game continues: `GameManager` sets turn to player, `Renderer.renderStatus()` accordingly.

4.  **New Game Button:**
    *   User clicks "New Game" (via `EventHandler._handleNewGameClick`).
    *   `EventHandler` calls `gameManagerRef.resetGame()`.
    *   `GameManager` clears the board state, resets the current player, and calls `Renderer.resetUI()` and `Renderer.renderBoard()`.
    *   `GameManager.startGame()` is called to commence a new round.

5.  **Reset Scores Button:**
    *   User clicks "Reset Scores" (via `EventHandler._handleResetScoresClick`).
    *   `EventHandler` calls `gameManagerRef.resetScores()`.
    *   `GameManager` resets the `playerScore`, `computerScore`, and `draws` to 0.
    *   `Renderer.renderScores()` is called to update the UI.

---

## 3. Data Storage & Models

### 3.1. Game State Model (`GameManager.js`)
The primary game state will be held within the `GameManager` module.

```javascript
const gameState = {
    board: [null, null, null,
            null, null, null,
            null, null, null], // Array representing 3x3 grid, null for empty, 'X' or 'O' for marks
    currentPlayer: null,      // 'X' or 'O'
    playerSymbol: 'X',        // Human player's symbol
    computerSymbol: 'O',      // Computer player's symbol
    gameActive: false,        // True if game is ongoing
    status: 'playing',        // 'playing', 'win', 'draw'
    winner: null,             // 'player', 'computer', or null
    winningLine: [],          // Array of indices [0, 1, 2] for winning cells
    scores: {
        player: 0,
        computer: 0,
        draws: 0
    }
};
```

### 3.2. Data Flow within Components
*   `GameManager` owns `gameState`.
*   `GameLogic` functions receive `board` (and other necessary state) as arguments and return *new* `board` arrays or status objects, ensuring immutability where possible for predictable state changes.
*   `AIPlayer` functions receive `board` and player/computer symbols as arguments.
*   `Renderer` functions receive parts of `gameState` (e.g., `board`, `status`, `scores`) as arguments to update the UI.
*   `EventHandler` does not manage data directly, but passes user input (e.g., cell index) to `GameManager`.

---

## 4. UI/UX Flow

### 4.1. Visual Design Principles
*   **Clean & Modern:** Minimalist design with clear typography and spacing.
*   **Interactive & Engaging:** Subtle animations for moves, win lines, and state changes.
*   **Responsive:** Adapts well to different screen sizes (mobile, tablet, desktop).
*   **Themed:** Use a cohesive color palette that evokes a "cool" aesthetic.

### 4.2. Initial Load State
*   A clear, centered 3x3 grid.
*   A status display area (e.g., "Press 'New Game' to start" or "Player X's Turn").
*   Score display for Player, Computer, and Draws.
*   A prominent "New Game" button.
*   A "Reset Scores" button.

### 4.3. Game Play States

#### 4.3.1. Player's Turn
*   Status displays "Player X's Turn".
*   Empty cells are visually distinct and interactive (e.g., hover effect).
*   Filled cells are non-interactive.

#### 4.3.2. Computer's Turn
*   Status displays "Computer O's Turn" (or similar).
*   Input is blocked (cells non-interactive) during computer's thinking time.
*   A brief delay before the computer makes its move for better user experience.

#### 4.3.3. Win/Lose State
*   Status displays "You Win!", "Computer Wins!", or "It's a Draw!".
*   The winning line of three cells is highlighted with an animation (e.g., color change, slight scale).
*   Scores are updated.
*   Board becomes non-interactive.
*   "New Game" button becomes active to start a new round.

#### 4.3.4. Draw State
*   Status displays "It's a Draw!".
*   Scores are updated (draw count increases).
*   Board becomes non-interactive.
*   "New Game" button becomes active.

### 4.4. Animations & Transitions
*   **Mark Placement:** Subtle scale-in or fade-in animation when 'X' or 'O' appears in a cell.
*   **Winning Line:** A distinct animation (e.g., background pulse, border highlight) for the three cells forming the winning line.
*   **Button Hovers:** Standard hover effects for interactive elements.

### 4.5. Responsiveness
*   The game board will maintain its aspect ratio and scale appropriately.
*   Font sizes and button sizes will adjust for readability across devices.
*   Flexbox or CSS Grid will be used for layout management.

### 4.6. Visual Feedback
*   Hover states for clickable cells.
*   Clear messaging for game status.
*   Visual indication of placed marks.

### 4.7. Accessibility Considerations
*   **Semantic HTML:** Use appropriate HTML elements (`<button>`, `<div>` with `role="grid"`, `aria-label` where necessary).
*   **Keyboard Navigation:** `Tab` navigation for buttons (New Game, Reset Scores) will be supported. Clicking cells is the primary interaction for the grid.
*   **Color Contrast:** Ensure sufficient color contrast for text and interactive elements.
*   **Screen Reader Support:** Provide `aria-label` or `sr-only` text for important status updates or interactive elements where visual cues might not be enough.

---

## 5. API/Integration Specifications

### 5.1. JavaScript Module APIs

#### `GameManager.js` API
```javascript
class GameManager {
    constructor(renderer, eventHandler, gameLogic, aiPlayer) { /* ... */ }
    initializeGame(): void // Sets up initial state, binds events
    startGame(): void      // Resets board, determines first player, initiates first turn
    handlePlayerMove(index: number): void // Processes player move, updates state, checks end, triggers computer turn
    handleComputerMove(): void // Triggers AI move, processes, updates state, checks end
    endGame(status: 'win' | 'draw', winner: 'player' | 'computer' | null, winningLine?: number[]): void // Handles end game logic
    resetGame(): void // Clears the board, resets current player, starts a new round (does not reset scores)
    resetScores(): void // Resets player, computer, and draw scores to zero
}
```

#### `GameLogic.js` API
```javascript
class GameLogic {
    createBoard(): (string | null)[] // Returns new empty board array
    placeMark(board: (string | null)[], index: number, symbol: string): (string | null)[] // Returns new board with mark
    getAvailableMoves(board: (string | null)[]): number[] // Returns array of available cell indices
    checkWin(board: (string | null)[], symbol: string): { isWin: boolean, line: number[] } // Checks for win, returns winning line
    checkDraw(board: (string | null)[]): boolean // Checks for draw
    getGameState(board: (string | null)[], lastPlayerSymbol: string): { status: 'playing' | 'win' | 'draw', winner: 'player' | 'computer' | null, winningLine: number[] } // Consolidated status check
}
```

#### `AIPlayer.js` API
```javascript
class AIPlayer {
    getComputerMove(board: (string | null)[], computerSymbol: string, playerSymbol: string): number // Returns index for AI's move
}
```

#### `Renderer.js` API
```javascript
class Renderer {
    constructor(boardElement: HTMLElement, statusElement: HTMLElement, scoreElement: HTMLElement) { /* ... */ }
    renderBoard(board: (string | null)[]): void // Updates grid cell visuals
    renderStatus(message: string): void // Updates status message display
    renderScores(scores: { player: number, computer: number, draws: number }): void // Updates score display
    highlightWinningLine(line: number[]): void // Applies visual effect to winning cells
    animateCellPlacement(index: number, symbol: string): Promise<void> // Animates mark placement
    resetUI(): void // Clears board visuals, status, and winning line highlights
}
```

#### `EventHandler.js` API
```javascript
class EventHandler {
    constructor(gameBoardElement: HTMLElement, newGameButton: HTMLElement, resetScoresButton: HTMLElement) { /* ... */ }
    init(gameManagerRef: GameManager): void // Sets up event listeners, binds them to GameManager methods
    _handleCellClick(event: Event): void // Private; handles click on a grid cell
    _handleNewGameClick(): void // Private; handles click on the New Game button
    _handleResetScoresClick(): void // Private; handles click on the Reset Scores button
}
```

---

## 6. Edge Cases & Error Handling

### 6.1. Invalid User Input
*   **Clicking an occupied cell:** `GameManager.handlePlayerMove()` will check if the cell is available using `GameLogic.getAvailableMoves()`. If not, the move will be ignored, and no state change will occur. `Renderer` might provide a subtle "invalid move" visual feedback (e.g., a momentary shake of the board), but no error message is strictly necessary for this common interaction.
*   **Clicking after game ends:** All cell clicks will be ignored if `gameState.gameActive` is `false`.

### 6.2. Game State Inconsistencies
*   **Multiple wins:** `GameLogic.getGameState()` is designed to check for win conditions first, then draw. In Tic-Tac-Toe, only one win condition can ever be met by a single player, and a draw means no win condition was met. This prevents inconsistent states.
*   **Undefined `currentPlayer`:** `GameManager.startGame()` always initializes `currentPlayer` to 'X' or 'O'. `GameManager.handlePlayerMove()` and `handleComputerMove()` ensure the `currentPlayer` alternates.

### 6.3. UI Synchronization Issues
*   **Stale UI:** `GameManager` is responsible for explicitly calling `Renderer` methods whenever the `gameState` changes. This ensures the UI is always a reflection of the current internal state. Promises can be used for animations to ensure sequence if needed (e.g., `animateCellPlacement` returns a Promise that resolves when animation is done, before triggering next turn).
*   **Race conditions:** Given this is a single-player, client-side application without heavy asynchronous operations beyond AI delay and animations, race conditions are less of a concern. `GameManager` will gate processing player/computer moves via `gameActive` flag.

### 6.4. AI Behavior
*   **AI making invalid move:** `AIPlayer.getComputerMove()` is designed to only select from `GameLogic.getAvailableMoves()`. This should prevent the AI from attempting to place a mark on an occupied cell. If, for any unforeseen reason, it returns an invalid index, `GameManager.handleComputerMove()` will still validate the move against `GameLogic.getAvailableMoves()` and handle it gracefully by logging an error and potentially trying again or falling back to a random valid move.
*   **Unreachable AI:** The AI module is synchronously called by `GameManager`. No network or complex async operations are involved.

### 6.5. Browser Compatibility
*   **Modern JavaScript:** The code will use ES6+ features. A build step (e.g., Babel) might be considered for wider browser support if older browser compatibility becomes a requirement, but for a modern web application, native support for most features is assumed.
*   **CSS:** Use standard CSS properties and possibly vendor prefixes for newer features if necessary.

### 6.6. Reset Functionality
*   **"New Game" after a game ends:** The "New Game" button is always available and simply resets the board and starts a new round, preserving scores.
*   **"Reset Scores" at any time:** The "Reset Scores" button can be clicked independently of game state, immediately zeroing out the scores and updating the UI.

