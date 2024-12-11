export class BijectiveMap<X = unknown, Y = unknown> {
  forward: Map<X, Y>;
  reverse: Map<Y, X>;

  constructor(mappings = {}) {
    // Forward mapping (X -> Y)
    this.forward = new Map();

    // Reverse mapping (Y -> X)
    this.reverse = new Map();

    // Populate the map if initial mappings are provided
    for (const [x, y] of Object.entries(mappings) as [X, Y][]) {
      this.set(x, y);
    }
  }

  /**
   * Add a new mapping
   */
  set(x: X, y: Y) {
    // Remove any existing mappings to prevent duplicate values
    if (this.forward.has(x)) {
      const oldY = this.forward.get(x)!;
      this.reverse.delete(oldY);
    }
    if (this.reverse.has(y)) {
      const oldX = this.reverse.get(y)!;
      this.forward.delete(oldX);
    }

    // Set forward and reverse mappings
    this.forward.set(x, y);
    this.reverse.set(y, x);
  }

  /**
   * Get y by x
   */
  getY(x: X) {
    return this.forward.get(x);
  }

  /**
   * Get x by y
   */
  getX(y: Y) {
    return this.reverse.get(y);
  }

  /**
   * Delete a mapping by x
   */
  deleteByX(x: X) {
    const value = this.forward.get(x);
    this.forward.delete(x);
    if (value !== undefined) {
      this.reverse.delete(value);
    }
  }

  /**
   * Delete a mapping by y
   */
  deleteByY(y: Y) {
    const key = this.reverse.get(y);
    this.reverse.delete(y);
    if (key !== undefined) {
      this.forward.delete(key);
    }
  }

  /**
   * Check if x exists
   */
  hasX(x: X) {
    return this.forward.has(x);
  }

  /**
   * Check if y exists
   */
  hasY(y: Y) {
    return this.reverse.has(y);
  }

  /**
   * List all x values
   */
  listX() {
    return Array.from(this.forward.keys());
  }

  /**
   * List all y values
   */
  listY() {
    return Array.from(this.reverse.keys());
  }

  /**
   * Clear all mappings
   */
  clear() {
    this.forward.clear();
    this.reverse.clear();
  }

  /**
   * Get the size of the map
   */
  get size() {
    return this.forward.size;
  }
}
