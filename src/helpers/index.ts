import isPromise from 'is-promise';

export function isEnvBrowser(): boolean {
  return typeof document !== 'undefined' && Boolean(document.body);
}

export async function asyncResolve<T>(
  input: T | Promise<T> | void
): Promise<T | void> {
  if (isPromise(input)) {
    try {
      const returnValue = await input;
      return returnValue;
    } catch (e) {
      console.error(e);
    }
  }
  return input;
}
