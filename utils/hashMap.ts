export class HashMap<T> extends Map<string, number> {
  constructor(private hashFn: (x: T) => string) {
    super();
  }

  add(key: T) {
    this.set(this.hashFn(key), 1);
    return this;
  }

  contains(key: T) {
    return this.has(this.hashFn(key));
  }

  list() {
    return [...this.keys()];
  }
}
