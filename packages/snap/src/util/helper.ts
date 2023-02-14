import { Buffer } from 'safe-buffer';

export const reverse = (bytes: any) => {
  const reversed = new Buffer(bytes.length);
  for (let i = bytes.length; i > 0; i--) {
    reversed[bytes.length - i] = bytes[i - 1];
  }
  return reversed;
};
