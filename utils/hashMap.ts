export class HashMap<T> {
  private hashMap: Record<string, number> = {};

  constructor(private hashFn: (x: T) => string) {}

  add(key: T) {
    this.hashMap[this.hashFn(key)] = 1;
  }

  has(key: T) {
    return !!this.hashMap[this.hashFn(key)];
  }

  list() {
    return Object.keys(this.hashMap);
  }

  size() {
    return this.list().length;
  }
}
