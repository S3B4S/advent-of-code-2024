/**
 * A set that uses a hash function to store values
 * This is useful when you want to store more complex types in a set,
 * and want to compare them using the hash function
 * @param T The type of the values to store
 */
export class HashSet<T> extends Set<string> {
  constructor(private hashFn: (x: T) => string) {
    super();
  }

  /**
   * Add a value to the hash set, will be hashed using the hashFn provided in the constructor
   * @param value
   * @returns This instance
   */
  include(value: T) {
    super.add(this.hashFn(value));
    return this;
  }

  /**
   * Explicitly disable the add method on HashSet, we want to use `include` instead
   * @deprecated Please use `include` instead
   * @returns This instance
   */
  override add() {
    return this;
  }

  /**
   * Check if the hash set contains a value
   * @param value
   * @returns
   */
  contains(value: T) {
    return this.has(this.hashFn(value));
  }

  /**
   * Get a list of all values in the hash set
   * @returns
   */
  list() {
    return [...this.values()];
  }
}
