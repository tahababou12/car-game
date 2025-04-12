export class InputHandler {
  keys: Set<string> = new Set();

  constructor() {
    window.addEventListener('keydown', (e) => {
      // Add key to the set
      this.keys.add(e.key);
      
      // Prevent scrolling with arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      // Remove key from the set
      this.keys.delete(e.key);
    });
  }
}
