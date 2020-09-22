import { Piper, ResponsePiper } from "../types";

export const resolve: Piper<ResponsePiper> = (resolver) => (opts) => ({
  ...opts,
  resolver,
});
