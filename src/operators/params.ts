import { Piper, AnyObject } from "../types";

export const params: Piper<AnyObject<any>> = (params) => (opts) => {
  if (!params) return opts;
  for (const [key, value] of Object.entries(params)) {
    opts.params.append(key, JSON.stringify(value));
  }
  return opts;
};
