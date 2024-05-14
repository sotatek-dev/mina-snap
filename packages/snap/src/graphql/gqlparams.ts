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
		  id
			hash
			kind
			nonce
			source {
			  publicKey
			}
			receiver {
			  publicKey
			}
			amount
			fee
			memo
			failureReason
		}
	}
}
`;

export const getAccountInfoQuery = (isBerkeley?: boolean) => `
query accountInfo($publicKey: PublicKey!) {
  account(publicKey: $publicKey) {
    publicKey
    balance {
      total
    }
    nonce
    inferredNonce
    delegateAccount {
      publicKey
    }
    publicKey
    ${ isBerkeley ? 'zkappState' : '' }
  }
}
`;

export const getTokenAccountInfoQuery = () => `
query accountInfo($publicKey: PublicKey!, $token: TokenId) {
  account(publicKey: $publicKey, token: $token) {
    publicKey
    balance {
      total
    }
    nonce
    inferredNonce
    delegateAccount {
      publicKey
    }
    publicKey
  }
}
`;

export const getTxStatusQuery = () => `
query txStatus($paymentId:ID!) {
  	transactionStatus(payment: $paymentId)
}
`;

export const getTxHistoryQuery = () => `
query history($limit: Int!, $sortBy: TransactionSortByInput!, $canonical: Boolean!, $address: String!) {
	transactions(limit: $limit, sortBy: $sortBy, query: {canonical: $canonical, OR: [{from: $address}, {to: $address}]}) {
		amount
		dateTime
		failureReason
		fee
		feeToken
		hash
		id
		kind
		memo
		nonce
		from
		to
		receiver {
      publicKey
		}
		source {
		  publicKey
		}
	}
}
`;

export const TxPendingQuery = () => `
query pendingTx($address: PublicKey!) {
  pooledUserCommands(publicKey: $address) {
		id
		hash
		kind
		nonce
		source {
		  publicKey
		}
		receiver {
		  publicKey
		}
		amount
		fee
		memo
		failureReason
		feeToken
  }
}
`;

export const getTxDetailQuery = () => `
query transaction($hash: String!) {
	transaction(query: {hash: $hash}) {
	  amount
	  dateTime
	  failureReason
	  fee
	  hash
	  kind
	  memo
	  nonce
	  receiver {
	    publicKey
	  }
	  source {
	    publicKey
	  }
	  from
	  to
	}
}
`;

export const sendStakeDelegationGql = (isRawSignature: boolean) => `
mutation stakeTx(
  $fee:UInt64!,
  $to: PublicKey!,
  $from: PublicKey!,
  $nonce:UInt32,
  $memo: String,
  $validUntil: UInt32,
  ${isRawSignature ? '$rawSignature: String' : '$scalar: String, $field: String'}
) {
    sendDelegation(
      input: {
        fee: $fee,
        to: $to,
        from: $from,
        memo: $memo,
        nonce: $nonce,
        validUntil: $validUntil
      },
      signature: {
        ${isRawSignature ? 'rawSignature: $rawSignature' : 'field: $field, scalar: $scalar'}
      }
    ) {
      delegation {
        id
        hash
        kind
        nonce
        source {
          publicKey
        }
        receiver {
          publicKey
        }
        amount
        feeToken
        fee
        memo
        failureReason
      }
    }
  }
`;

export const getPartyBody = () =>
   `
  mutation sendZkapp($zkappCommandInput:ZkappCommandInput!){
    sendZkapp(input: {
      zkappCommand: $zkappCommandInput
    }) {
      zkapp {
        hash
        id
        zkappCommand {
          memo
        }
        failureReason {
          failures
        }
      }
    }
  }
  `

  export const getZkAppTransactionListBody = () => {
    return `
    query zkApps($address: String,$limit:Int) {
      zkapps(limit: $limit, query: {
        zkappCommand: {feePayer:
        {body: {publicKey: $address}}}}, sortBy: DATETIME_DESC) {
          hash
      dateTime
      failureReason {
        failures
      }
      zkappCommand {
        feePayer {
          authorization
          body {
            nonce
            publicKey
            fee
          }
        }
        memo
        accountUpdates {
          body {
            publicKey

          }
        }
      }
      }
    }
    `
  }

  export function getPendingZkAppTxBody() {
    return `
    query pendingZkTx($address: PublicKey){
      pooledZkappCommands(publicKey: $address) {
      hash
      failureReason{
        index
        failures
      }
      zkappCommand{
        feePayer{
          body{
            publicKey
            fee
            validUntil
            nonce
          }
          authorization
        }
        accountUpdates{
          body{
            publicKey
          }
        }
        memo
      }
    }
  }
    `
  }
