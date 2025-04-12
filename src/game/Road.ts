export class Road {
  width: number;
  height: number;
  laneCount: number = 3;
  leftBoundary: number;
  rightBoundary: number;
  laneWidth: number;
  
  // Road markings
  markings: { y: number }[] = [];
  markingHeight: number = 50;
  markingGap: number = 30;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    
    // Calculate road boundaries (80% of canvas width)
    const roadWidth = this.width * 0.8;
    this.leftBoundary = (this.width - roadWidth) / 2;
    this.rightBoundary = this.leftBoundary + roadWidth;
    this.laneWidth = roadWidth / this.laneCount;
    
    // Initialize road markings
    const totalMarkings = Math.ceil(this.height / (this.markingHeight + this.markingGap)) + 1;
    for (let i = 0; i < totalMarkings; i++) {
      this.markings.push({
        y: i * (this.markingHeight + this.markingGap)
      });
    }
  }

  update(gameSpeed: number): void {
    // Move road markings down
    this.markings.forEach(marking => {
      marking.y += gameSpeed * 5;
      
      // Reset marking position when it goes off screen
      if (marking.y > this.height) {
        marking.y = -this.markingHeight;
      }
    });
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // Draw road
    ctx.fillStyle = '#444';
    ctx.fillRect(this.leftBoundary, 0, this.rightBoundary - this.leftBoundary, this.height);
    
    // Draw lane markings
    ctx.fillStyle = '#FFF';
    for (let i = 1; i < this.laneCount; i++) {
      const x = this.leftBoundary + i * this.laneWidth;
      
      this.markings.forEach(marking => {
        ctx.fillRect(x - 2, marking.y, 4, this.markingHeight);
      });
    }
    
    // Draw road boundaries
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 5;
    ctx.beginPath();
    // Left boundary
    ctx.moveTo(this.leftBoundary, 0);
    ctx.lineTo(this.leftBoundary, this.height);
    // Right boundary
    ctx.moveTo(this.rightBoundary, 0);
    ctx.lineTo(this.rightBoundary, this.height);
    ctx.stroke();
  }
}
