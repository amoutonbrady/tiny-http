import { Piper, BaseObject } from '../types';

export const appendBody: Piper<BaseObject> = (body) => (opts) => ({
  ...opts,
  fetchOptions: { ...opts.fetchOptions, body: JSON.stringify(body) },
});
