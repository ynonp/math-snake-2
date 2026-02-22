/**
 * Generic event emitter utility
 * Manages typed listeners with subscribe/unsubscribe and emit
 */
export class EventEmitter<T> {
  private listeners: ((event: T) => void)[] = [];

  /** Subscribe to events. Returns an unsubscribe function. */
  subscribe(listener: (event: T) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /** Emit an event to all current listeners. */
  emit(event: T): void {
    this.listeners.forEach((listener) => listener(event));
  }
}
