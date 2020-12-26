import { Piper, BaseObject } from '../types';

export const headers: Piper<BaseObject> = (headers) => (opts) => ({
  ...opts,
  headers,
});
