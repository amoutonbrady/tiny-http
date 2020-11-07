import { Piper, AnyObject } from '../types';

export const headers: Piper<AnyObject> = (headers) => (opts) => ({
  ...opts,
  headers,
});
