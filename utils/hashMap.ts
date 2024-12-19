export class HashMap<K, V> {
  private map = new Map<string, V>();

  constructor(private readonly hashFn: (value: K) => string) {}

  get(key: K): V | undefined {
    return this.map.get(this.hashFn(key));
  }

  set(key: K, value: V): void {
    this.map.set(this.hashFn(key), value);
  }

  delete(key: K): void {
    this.map.delete(this.hashFn(key));
  }

  get size(): number {
    return this.map.size;
  }
}
