import { Car } from './Car';
import { Road } from './Road';
import { Obstacle } from './Obstacle';
import { InputHandler } from './InputHandler';
import { UI } from './UI';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private car: Car;
  private road: Road;
  private obstacles: Obstacle[] = [];
  private input: InputHandler;
  private ui: UI;
  private animationId: number = 0;
  private lastTime: number = 0;
  private obstacleTimer: number = 0;
  private obstacleInterval: number = 1500; // Reduced from 2000 for more frequent obstacles
  private gameSpeed: number = 1.2; // Increased initial speed
  private score: number = 0;
  private lives: number = 3;
  private gameOver: boolean = false;
  private gameStarted: boolean = false;
  private difficultyLevel: number = 1;
  private nextDifficultyScore: number = 100;
  private multiSpawnChance: number = 0.3; // 30% chance to spawn multiple obstacles at once

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.resize();
    
    this.road = new Road(this.canvas.width, this.canvas.height);
    this.car = new Car(this.canvas.width / 2, this.canvas.height - 100);
    this.input = new InputHandler();
    this.ui = new UI();
  }

  resize(): void {
    this.canvas.width = 600;
    this.canvas.height = 800;
    
    // If game is already initialized, update positions
    if (this.car) {
      this.car.x = this.canvas.width / 2;
      this.car.y = this.canvas.height - 100;
    }
    
    if (this.road) {
      this.road.width = this.canvas.width;
      this.road.height = this.canvas.height;
    }
  }

  start(): void {
    if (!this.gameStarted) {
      this.gameStarted = true;
      this.gameOver = false;
      this.score = 0;
      this.lives = 3;
      this.obstacles = [];
      this.gameSpeed = 1.2;
      this.obstacleInterval = 1500;
      this.difficultyLevel = 1;
      this.nextDifficultyScore = 100;
      this.multiSpawnChance = 0.3;
      this.ui.updateScore(this.score);
      this.ui.updateLives(this.lives);
      this.ui.updateLevel(this.difficultyLevel);
      this.animate(0);
    }
  }

  restart(): void {
    this.gameStarted = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    const startButton = document.getElementById('startButton') as HTMLButtonElement;
    startButton.disabled = false;
    startButton.textContent = 'Start Game';
  }

  private animate(timeStamp: number): void {
    const deltaTime = timeStamp - this.lastTime;
    this.lastTime = timeStamp;
    
    this.update(deltaTime);
    this.draw();
    
    if (!this.gameOver) {
      this.animationId = requestAnimationFrame(this.animate.bind(this));
    } else {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.fillStyle = 'white';
      this.ctx.font = '40px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
      
      this.ctx.font = '25px Arial';
      this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 50);
      this.ctx.fillText(`Level Reached: ${this.difficultyLevel}`, this.canvas.width / 2, this.canvas.height / 2 + 90);
      
      setTimeout(() => this.restart(), 3000);
    }
  }

  private update(deltaTime: number): void {
    this.road.update(this.gameSpeed);
    this.car.update(this.input.keys);
    
    // Keep car within road boundaries
    if (this.car.x < this.road.leftBoundary + this.car.width / 2) {
      this.car.x = this.road.leftBoundary + this.car.width / 2;
    }
    if (this.car.x > this.road.rightBoundary - this.car.width / 2) {
      this.car.x = this.road.rightBoundary - this.car.width / 2;
    }
    
    // Check for difficulty increase
    if (this.score >= this.nextDifficultyScore) {
      this.difficultyLevel++;
      this.nextDifficultyScore += this.difficultyLevel * 100;
      this.gameSpeed += 0.2;
      this.obstacleInterval = Math.max(300, this.obstacleInterval - 200);
      this.multiSpawnChance = Math.min(0.8, this.multiSpawnChance + 0.1);
      this.ui.updateLevel(this.difficultyLevel);
    }
    
    // Spawn obstacles
    this.obstacleTimer += deltaTime;
    if (this.obstacleTimer > this.obstacleInterval) {
      this.spawnObstacles();
      this.obstacleTimer = 0;
    }
    
    // Update obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obstacle = this.obstacles[i];
      obstacle.update(this.gameSpeed);
      
      // Check collision
      if (this.checkCollision(this.car, obstacle)) {
        this.obstacles.splice(i, 1);
        this.lives--;
        this.ui.updateLives(this.lives);
        
        if (this.lives <= 0) {
          this.gameOver = true;
        }
        continue;
      }
      
      // Remove obstacles that are off screen
      if (obstacle.y > this.canvas.height) {
        this.obstacles.splice(i, 1);
        this.score += 10;
        this.ui.updateScore(this.score);
      }
    }
  }

  private spawnObstacles(): void {
    const roadWidth = this.road.rightBoundary - this.road.leftBoundary;
    
    // Determine if we should spawn multiple obstacles
    const spawnMultiple = Math.random() < this.multiSpawnChance;
    
    if (spawnMultiple && this.difficultyLevel >= 2) {
      // Spawn obstacles in a pattern based on difficulty
      if (this.difficultyLevel >= 4 && Math.random() < 0.3) {
        // Wall of obstacles with a single gap
        this.spawnObstacleWall();
      } else if (this.difficultyLevel >= 3 && Math.random() < 0.4) {
        // Diagonal line of obstacles
        this.spawnDiagonalObstacles();
      } else {
        // Random multiple obstacles
        const count = Math.min(Math.floor(Math.random() * this.difficultyLevel) + 1, 3);
        for (let i = 0; i < count; i++) {
          const x = this.road.leftBoundary + Math.random() * roadWidth;
          this.obstacles.push(new Obstacle(x, -100 - i * 80));
        }
      }
    } else {
      // Spawn a single obstacle
      const x = this.road.leftBoundary + Math.random() * roadWidth;
      this.obstacles.push(new Obstacle(x, -100));
    }
  }

  private spawnObstacleWall(): void {
    const gapPosition = Math.floor(Math.random() * this.road.laneCount);
    const gapWidth = 80;
    
    for (let i = 0; i < this.road.laneCount; i++) {
      const laneCenter = this.road.leftBoundary + (i + 0.5) * this.road.laneWidth;
      
      // Skip creating obstacle at the gap position
      if (i === gapPosition) continue;
      
      this.obstacles.push(new Obstacle(laneCenter, -100));
    }
  }

  private spawnDiagonalObstacles(): void {
    const direction = Math.random() < 0.5 ? 1 : -1; // Left-to-right or right-to-left
    const count = Math.min(this.difficultyLevel, 5);
    const startX = direction > 0 ? this.road.leftBoundary + 50 : this.road.rightBoundary - 50;
    
    for (let i = 0; i < count; i++) {
      const x = startX + direction * i * 80;
      const y = -100 - i * 100;
      
      // Only add if within road boundaries
      if (x >= this.road.leftBoundary && x <= this.road.rightBoundary) {
        this.obstacles.push(new Obstacle(x, y));
      }
    }
  }

  private draw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.road.draw(this.ctx);
    this.obstacles.forEach(obstacle => obstacle.draw(this.ctx));
    this.car.draw(this.ctx);
  }

  private checkCollision(car: Car, obstacle: Obstacle): boolean {
    const dx = car.x - obstacle.x;
    const dy = car.y - obstacle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (car.width / 2 + obstacle.width / 2);
  }
}
