import { Buffer } from 'safe-buffer';

export const reverse = (bytes: any) => {
  const reversed = Buffer.alloc(bytes.length);
  for (let i = bytes.length; i > 0; i--) {
    reversed[bytes.length - i] = bytes[i - 1];
  }
  return reversed;
};

/**
 * Get GraphQL operation name.
 *
 * @param query - GraphQL query.
 * @returns `string`
 */
export function getOperationName(query: string) {
  const queryMatch = query.match(/(query|mutation) (\w+)(?=[(\s{])/u);

  if (queryMatch?.[2]) {
    return queryMatch[2];
  }

  throw new Error('GQL not valid');
}
