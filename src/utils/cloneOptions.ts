import { Options } from '../types';

export function cloneOptions(opts: Options) {
  return Object.entries(opts).reduce<any>((cloned, [key, value]) => {
    cloned[key] =
      value instanceof URLSearchParams ? new URLSearchParams(value) : value;
    return cloned;
  }, {});
}
