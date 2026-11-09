/**
 * Reuses objects instead of allocating a new one per spawn, which keeps
 * garbage collection pauses out of the game loop on low-end phones.
 */
export class Pool {
  constructor(create, initialSize = 0) {
    this.create = create;
    this.available = Array.from({ length: initialSize }, create);
  }

  acquire() {
    return this.available.pop() ?? this.create();
  }

  release(item) {
    this.available.push(item);
  }
}
