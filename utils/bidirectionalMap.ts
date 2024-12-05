// Use something else for Key-Value
export class BidirectionalMap<K = unknown, V = unknown> {
  forward: Map<K, V>;
  reverse: Map<V, K>;

  constructor(mappings = {}) {
    // Forward mapping (key -> value)
    this.forward = new Map();

    // Reverse mapping (value -> key)
    this.reverse = new Map();

    // Populate the map if initial mappings are provided
    for (const [key, value] of Object.entries(mappings)) {
      this.set(key as K, value as V);
    }
  }

  /**
   * Add a new mapping
   */
  set(key: K, value: V) {
    // Remove any existing mappings to prevent duplicate values
    if (this.forward.has(key)) {
      const oldValue = this.forward.get(key)!;
      this.reverse.delete(oldValue);
    }
    if (this.reverse.has(value)) {
      const oldKey = this.reverse.get(value)!;
      this.forward.delete(oldKey);
    }

    // Set forward and reverse mappings
    this.forward.set(key, value);
    this.reverse.set(value, key);
  }

  /**
   * Get value by key (encoding)
   */
  get(key: K) {
    return this.forward.get(key);
  }

  /**
   * Get key by value (decoding)
   */
  getKey(value: V) {
    return this.reverse.get(value);
  }

  /**
   * Delete a mapping by key
   */
  delete(key: K) {
    const value = this.forward.get(key);
    this.forward.delete(key);
    if (value !== undefined) {
      this.reverse.delete(value);
    }
  }

  /**
   * Check if a key exists
   */
  has(key: K) {
    return this.forward.has(key);
  }

  /**
   * Check if a value exists
   */
  hasValue(value: V) {
    return this.reverse.has(value);
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
