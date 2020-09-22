import { Piper } from "../types";

export const appendUrl: Piper<string> = (url) => (opts) => ({
  ...opts,
  url: opts.url + url,
});
