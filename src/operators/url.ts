import { Piper } from '../types';

export const url: Piper<string> = (url) => (opts) => ({ ...opts, url });
