export class Car {
  x: number;
  y: number;
  width: number = 50;
  height: number = 80;
  speed: number = 5;
  color: string = '#ff0000';

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  update(keys: Set<string>): void {
    // Horizontal movement
    if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) {
      this.x -= this.speed;
    }
    if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) {
      this.x += this.speed;
    }
    
    // Vertical movement (limited)
    if (keys.has('ArrowUp') || keys.has('w') || keys.has('W')) {
      this.y = Math.max(this.y - this.speed / 2, this.height);
    }
    if (keys.has('ArrowDown') || keys.has('s') || keys.has('S')) {
      this.y = Math.min(this.y + this.speed / 2, 800 - this.height);
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // Car body
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.roundRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height, 10);
    ctx.fill();
    
    // Windows
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(this.x - this.width / 2 + 10, this.y - this.height / 2 + 10, this.width - 20, 15);
    
    // Wheels
    ctx.fillStyle = '#333';
    // Front left wheel
    ctx.fillRect(this.x - this.width / 2 - 5, this.y - this.height / 4, 5, 20);
    // Front right wheel
    ctx.fillRect(this.x + this.width / 2, this.y - this.height / 4, 5, 20);
    // Rear left wheel
    ctx.fillRect(this.x - this.width / 2 - 5, this.y + this.height / 4 - 20, 5, 20);
    // Rear right wheel
    ctx.fillRect(this.x + this.width / 2, this.y + this.height / 4 - 20, 5, 20);
    
    // Headlights
    ctx.fillStyle = '#FFFF00';
    ctx.fillRect(this.x - this.width / 2 + 5, this.y - this.height / 2, 10, 5);
    ctx.fillRect(this.x + this.width / 2 - 15, this.y - this.height / 2, 10, 5);
  }
}
