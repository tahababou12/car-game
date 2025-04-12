export class UI {
  private scoreElement: HTMLElement;
  private livesElement: HTMLElement;
  private levelElement: HTMLElement | null;

  constructor() {
    this.scoreElement = document.getElementById('score')!;
    this.livesElement = document.getElementById('lives')!;
    
    // Create level element if it doesn't exist
    if (!document.getElementById('level')) {
      const gameHeader = document.querySelector('.game-header');
      if (gameHeader) {
        const levelDiv = document.createElement('div');
        levelDiv.className = 'level';
        levelDiv.innerHTML = 'Level: <span id="level">1</span>';
        gameHeader.appendChild(levelDiv);
      }
    }
    
    this.levelElement = document.getElementById('level');
  }

  updateScore(score: number): void {
    this.scoreElement.textContent = score.toString();
  }

  updateLives(lives: number): void {
    this.livesElement.textContent = lives.toString();
  }
  
  updateLevel(level: number): void {
    if (this.levelElement) {
      this.levelElement.textContent = level.toString();
    }
  }
}
