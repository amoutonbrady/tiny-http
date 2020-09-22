import { Piper, ErrorPiper } from "../types";

export const error: Piper<ErrorPiper> = (catcher) => (opts) => ({
  ...opts,
  catcher,
});
