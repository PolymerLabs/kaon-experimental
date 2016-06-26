export interface Constructable<T> {
  new (...args: any[]): T;
}

export interface Base {}

const _microtaskScheduler = Promise.resolve();

export function scheduleMicrotask(task) {
  _microtaskScheduler.then(task);
}
