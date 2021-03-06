import { Piper, ResponsePiper } from '../types';

export const resolve: Piper<ResponsePiper> = (resolver) => (opts) => ({
  ...opts,
  resolvers: [...opts.resolvers, resolver],
});
