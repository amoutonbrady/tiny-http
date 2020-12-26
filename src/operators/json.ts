import { ArgumentlessPiper } from '../types';

export const json: ArgumentlessPiper = () => (opts) => ({
  ...opts,
  response: 'json',
});
