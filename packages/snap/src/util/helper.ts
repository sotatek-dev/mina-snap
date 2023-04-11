import { Buffer } from 'safe-buffer';
import bs58check from 'bs58check';

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

export const decodeMemo = (encode: string) => {
  try {
    const encoded = bs58check.decode(encode);
    const res = encoded.slice(3, 3 + encoded[2]).toString('utf-8');
    return res;
  } catch (err) {
    return encode;
  }
};

export const formatZkAppTxList = (zkApptxs: any[]) => {
  return zkApptxs.map((tx) => {
    return {
      amount: 0,
      dateTime: tx.dateTime || '',
      failureReason: tx.failureReason,
      fee: tx.zkappCommand.feePayer.body.fee,
      id: '',
      hash: tx.hash,
      kind: 'ZKAPP',
      from: tx.zkappCommand.feePayer.body.publicKey,
      nonce: tx.zkappCommand.feePayer.body.nonce,
      receiver: {
        publicKey: tx.zkappCommand.accountUpdates[0]?.body?.publicKey || ''
      },
      source: {
        publicKey: tx.zkappCommand.feePayer.body.publicKey
      },
      memo: tx.zkappCommand.memo,
      to: tx.zkappCommand.accountUpdates[0]?.body?.publicKey || ''
    };
  });
}
