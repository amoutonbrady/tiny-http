import { Piper, AnyObject } from "../types";

export const appendBody: Piper<AnyObject> = (body) => (opts) => ({
  ...opts,
  fetchOptions: { ...opts.fetchOptions, body: JSON.stringify(body) },
});
