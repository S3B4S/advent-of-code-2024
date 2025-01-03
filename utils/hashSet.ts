/**
 * A set that uses a hash function to store values.
 *
 * This is useful when you want to store more complex types in a set,
 * and want to compare them using the hash function.
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
   * @TODO fix this
   * @param other
   * @returns
   */
  unionX(other: HashSet<T>) {
    const set = this.union(other);
    const newHashSet = new HashSet(this.hashFn);
    for (const s of set.values()) {
      newHashSet.add(s);
    }
    return newHashSet;
  }

  /**
   * Explicitly disable the add method on HashSet, we want to use `include` instead
   * @deprecated Please use `include` instead
   * @returns This instance
   */
  override add(value: string) {
    return super.add(value);
  }

  /**
   * @deprecated Please use `contains` instead
   */
  override has(value: string): boolean {
    return super.has(value);
  }

  /**
   * @deprecated Please use `remove` instead
   */
  override delete(value: string): boolean {
    return super.delete(value);
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
   * Remove an element from the hash set
   * @param value
   * @returns
   */
  remove(value: T) {
    return this.delete(this.hashFn(value));
  }

  /**
   * Get a list of all values in the hash set
   * @returns
   */
  list() {
    return [...this.values()];
  }
}
