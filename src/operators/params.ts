import { Piper, BaseObject } from '../types';

export const params: Piper<BaseObject<any>> = (params) => (opts) => {
  if (!params) return opts;
  for (const [key, value] of Object.entries(params)) {
    opts.params.append(key, JSON.stringify(value));
  }
  return opts;
};
