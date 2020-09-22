import { Piper, Method } from "../types";

export const method: Piper<Method> = (type) => (opts) => ({
  ...opts,
  fetchOptions: { ...opts.fetchOptions, method: type },
});
