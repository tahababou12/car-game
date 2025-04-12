export class Obstacle {
  x: number;
  y: number;
  width: number = 60;
  height: number = 60;
  speed: number = 3;
  color: string = '#00aa00';
  
  // Different obstacle types
  type: 'car' | 'rock' | 'oil' | 'truck' | 'barrier';
  
  // Animation properties
  rotationAngle: number = 0;
  rotationSpeed: number = 0;
  pulseSize: number = 0;
  pulseDirection: number = 1;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    
    // Randomly select obstacle type with weighted probabilities
    const rand = Math.random();
    if (rand < 0.25) {
      this.type = 'car';
    } else if (rand < 0.45) {
      this.type = 'rock';
    } else if (rand < 0.65) {
      this.type = 'oil';
    } else if (rand < 0.85) {
      this.type = 'truck';
    } else {
      this.type = 'barrier';
    }
    
    // Set properties based on type
    if (this.type === 'car') {
      this.color = '#0000ff';
      this.width = 50;
      this.height = 80;
    } else if (this.type === 'rock') {
      this.color = '#888888';
      this.width = 40;
      this.height = 40;
      this.rotationSpeed = (Math.random() - 0.5) * 0.1;
    } else if (this.type === 'oil') {
      this.color = '#333333';
      this.width = 70;
      this.height = 30;
      this.pulseSize = 1;
    } else if (this.type === 'truck') {
      this.color = '#880000';
      this.width = 60;
      this.height = 120;
    } else if (this.type === 'barrier') {
      this.color = '#ff8800';
      this.width = 100;
      this.height = 30;
    }
  }

  update(gameSpeed: number): void {
    this.y += this.speed * gameSpeed;
    
    // Update animation properties
    if (this.rotationSpeed) {
      this.rotationAngle += this.rotationSpeed;
    }
    
    if (this.pulseSize) {
      this.pulseSize += 0.05 * this.pulseDirection;
      if (this.pulseSize > 1.2 || this.pulseSize < 0.8) {
        this.pulseDirection *= -1;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    
    // Apply rotation if needed
    if (this.rotationAngle) {
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotationAngle);
      ctx.translate(-this.x, -this.y);
    }
    
    // Apply pulse if needed
    let width = this.width;
    let height = this.height;
    if (this.pulseSize) {
      width *= this.pulseSize;
      height *= this.pulseSize;
    }
    
    if (this.type === 'car') {
      // Enemy car
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.roundRect(this.x - width / 2, this.y - height / 2, width, height, 10);
      ctx.fill();
      
      // Windows
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(this.x - width / 2 + 10, this.y - height / 2 + 10, width - 20, 15);
      
    } else if (this.type === 'rock') {
      // Rock obstacle
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, width / 2, height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Add some details to the rock
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.x - 10, this.y - 5);
      ctx.lineTo(this.x - 5, this.y + 10);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(this.x + 5, this.y - 10);
      ctx.lineTo(this.x + 10, this.y + 5);
      ctx.stroke();
      
    } else if (this.type === 'oil') {
      // Oil slick
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, width / 2, height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Oil shine
      ctx.fillStyle = '#555';
      ctx.beginPath();
      ctx.ellipse(this.x - 10, this.y - 5, 10, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      
    } else if (this.type === 'truck') {
      // Truck obstacle (larger than car)
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.roundRect(this.x - width / 2, this.y - height / 2, width, height, 10);
      ctx.fill();
      
      // Truck cab
      ctx.fillStyle = '#660000';
      ctx.fillRect(this.x - width / 2, this.y - height / 2, width, height / 3);
      
      // Windows
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(this.x - width / 2 + 10, this.y - height / 2 + 10, width - 20, 15);
      
      // Wheels
      ctx.fillStyle = '#000';
      ctx.fillRect(this.x - width / 2 - 5, this.y - height / 3, 5, 20);
      ctx.fillRect(this.x + width / 2, this.y - height / 3, 5, 20);
      ctx.fillRect(this.x - width / 2 - 5, this.y + height / 3 - 20, 5, 20);
      ctx.fillRect(this.x + width / 2, this.y + height / 3 - 20, 5, 20);
      
    } else if (this.type === 'barrier') {
      // Road barrier
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.roundRect(this.x - width / 2, this.y - height / 2, width, height, 5);
      ctx.fill();
      
      // Stripes
      ctx.fillStyle = '#000';
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(
          this.x - width / 2 + i * (width / 3) + 5, 
          this.y - height / 2 + 5, 
          width / 3 - 10, 
          height - 10
        );
      }
    }
    
    ctx.restore();
  }
}
