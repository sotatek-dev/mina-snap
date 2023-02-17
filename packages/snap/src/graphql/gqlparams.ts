/* eslint-disable no-tabs */

export const sendPaymentQuery = (isRawSignature: boolean) => `
mutation sendPayment(
	$fee: UInt64!, $amount: UInt64!, $to: PublicKey!, $from: PublicKey!, $nonce: UInt32, $memo: String, $validUntil: UInt32,
	${
    isRawSignature
      ? '$rawSignature: String!'
      : '$scalar: String!, $field: String!'
  }
) {
	sendPayment(
		input: { fee: $fee, amount: $amount, to: $to, from: $from, memo: $memo, nonce: $nonce, validUntil: $validUntil },
		signature: { ${
      isRawSignature
        ? 'rawSignature: $rawSignature'
        : 'field: $field, scalar: $scalar'
    } }
	) {
		payment {
			amount
			fee
			feeToken
			from
			hash
			id
			isDelegation
			memo
			nonce
			kind
			to
		}
	}
}
`;

export const getAccountInfoQuery = `
query accountInfo($publicKey: PublicKey!) {
  account(publicKey: $publicKey) {
    balance {
      total
    },
    nonce
    inferredNonce
    delegate
    publicKey
  }
}
`;

export const getTxStatusQuery = `
query txStatus($paymentId:ID! ) {
  transactionStatus(payment: $paymentId)
}
`;
