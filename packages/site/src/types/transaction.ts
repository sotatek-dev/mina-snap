export type payloadSendTransaction = {
    to: string,
    amount: number,
    memo: string,
    fee: number,
    nonce: number,
    nonceValue:string
}

export type payloadSendZkTransaction = {
    transaction: string
    feePayer: {
      fee: string
      memo?: string
    }
}

export type TypeResponseSendTransaction = {
    id: string
    hash: string
    isDelegation: boolean
    kind: string
}

export type ResultTransactionList = {
    amount: number
    dateTime: string
    failureReason: string
    fee: number
    feeToken: string
    hash: string
    id: string
    isDelegation: boolean
    kind: string
    memo: string
    nonce: number
    receiver : {
        publicKey: string
    }
    source: {
        publicKey: string
    }
    status: string
}


export type TypeResponseTxHistory = Array<ResultTransactionList>

export type TypeResponseSignature = {
    data: any,
    publickey: string,
    signature: {
        field: string
        scalar: string
    }
}

export type TypeResponseSwtichNetwork = {
    name: string
    gqlUrl: string
    gqlTxUrl: string
    token: {
        name: string
        coinType: number
        symbol: string
        decimals: number
    }
}

export type TypeResponseCustomToken = {
  tokenId: string
  tokenSymbol: string
  balance: {
    total: string
  }
}
