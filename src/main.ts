import './style.css'
import { Game } from './game/Game'

// Remove template content and create game container
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="game-container">
    <div class="game-header">
      <div class="score">Score: <span id="score">0</span></div>
      <div class="lives">Lives: <span id="lives">3</span></div>
      <div class="level">Level: <span id="level">1</span></div>
    </div>
    <canvas id="gameCanvas"></canvas>
    <div class="controls">
      <p>Use arrow keys or WASD to control the car</p>
      <button id="startButton">Start Game</button>
    </div>
  </div>
`

// Initialize the game
const game = new Game('gameCanvas');
const startButton = document.getElementById('startButton') as HTMLButtonElement;

startButton.addEventListener('click', () => {
  game.start();
  startButton.disabled = true;
  startButton.textContent = 'Game Running';
});

// Handle window resize
window.addEventListener('resize', () => {
  game.resize();
});
