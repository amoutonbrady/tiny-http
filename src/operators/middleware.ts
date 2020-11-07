import { Piper, Pipe } from '../types';

export const middleware: Piper<Pipe> = (pipe) => (opts) => pipe(opts);
