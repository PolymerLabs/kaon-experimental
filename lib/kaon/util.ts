export interface Constructable<T> {
  new (...args: any[]): T;
}

const _microtaskScheduler = Promise.resolve();

export function scheduleMicrotask(task) {
  _microtaskScheduler.then(task);
}
