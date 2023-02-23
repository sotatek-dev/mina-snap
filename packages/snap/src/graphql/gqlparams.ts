/* eslint-disable no-tabs */

export const sendPaymentQuery = (isRawSignature: boolean) => `
mutation sendPayment(
	$fee: UInt64!, $amount: UInt64!, $to: PublicKey!, $from: PublicKey!, $nonce: UInt32, $memo: String, $validUntil: UInt32,
	${isRawSignature ? '$rawSignature: String!' : '$scalar: String!, $field: String!'}
) {
	sendPayment(
		input: { fee: $fee, amount: $amount, to: $to, from: $from, memo: $memo, nonce: $nonce, validUntil: $validUntil },
		signature: { ${isRawSignature ? 'rawSignature: $rawSignature' : 'field: $field, scalar: $scalar'} }
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
query txStatus($paymentId:ID!) {
  	transactionStatus(payment: $paymentId)
}
`;

export const getTxHistoryQuery = `
query history($limit: Int!, $sortBy: TransactionSortByInput!, $canonical: Boolean!, $address: String!) {
	transactions(limit: $limit, sortBy: $sortBy, query: {canonical: $canonical, OR: [{from: $address}, {to: $address}]}) {
		fee
		from
		to
		nonce
		amount
		memo
		hash
		kind
		dateTime
		failureReason
	}
}
`;

export const getTxDetailQuery = `
query transaction($hash: String!) {
	transaction(query: {hash: $hash}) {
	  amount
	  to
	  from
	  fee
	  nonce
	  dateTime
	  hash
	}
}
`;
