import * as bcrypt from 'bcrypt';

export function hash(text): Promise<string> {
  return new Promise((resolve) => {
    bcrypt.hash(text, 10, (error, hash) => {
      resolve(hash);
    });
  });
}

export function compare(text, hash): Promise<boolean> {
  return new Promise((resolve) => {
    bcrypt.compare(text, hash, (error, result) => {
      resolve(result);
    });
  });
}
