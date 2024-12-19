export class EncodedQueue<T> {
  private queue: string[] = [];

  constructor(
    private encoding: (value: T) => string,
    private decoding: (encoded: string) => T
  ) {}

  enqueue(value: T) {
    this.queue.push(this.encoding(value));
  }

  dequeue(): T | undefined {
    const encoded = this.queue.shift();
    if (!encoded) return undefined;
    return this.decoding(encoded);
  }

  get size(): number {
    return this.queue.length;
  }

  contains(value: T): boolean {
    return this.queue.includes(this.encoding(value));
  }
}

export class PriorityEncodedQueue<T> {
  private queue: { value: string; priority: number }[] = [];

  constructor(
    private encoding: (value: T) => string,
    private decoding: (encoded: string) => T
  ) {}

  enqueue(value: T, priority: number) {
    this.queue.push({
      value: this.encoding(value),
      priority,
    });
    this.queue.sort((a, b) => a.priority - b.priority);
  }

  dequeue(): T | undefined {
    const encoded = this.queue.shift();
    if (!encoded) return undefined;
    return this.decoding(encoded.value);
  }

  get size(): number {
    return this.queue.length;
  }

  contains(value: T): boolean {
    return this.queue.some((item) => item.value === this.encoding(value));
  }

  list(): T[] {
    return this.queue.map((item) => this.decoding(item.value));
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }
}
