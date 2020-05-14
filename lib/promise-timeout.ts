export class PromiseTimeoutError extends Error {
  constructor(ms: number) {
    super(`Timeout after ${ms}ms.`);
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

export function throwAfter<T = void>(ms: number): Promise<T> {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new PromiseTimeoutError(ms)), ms)
  );
}

export function promiseTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([p, throwAfter<T>(ms)]);
}
