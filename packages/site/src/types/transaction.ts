export type payloadSendTransaction = {
    to: string,
    amount: number,
    memo: string,
    fee: number,
    nonce: number,
    nonceValue:string
}

export type TypeResponseSendTransaction = {
    id: string
    hash: string
    isDelegation: boolean
    kind: string
}

export type ResultTransactionList = {
    fee: number
    from: string
    to: string
    nonce: number
    amount: number
    memo: string
    hash: string
    kind: string
    dateTime: string
    failureReason: string
    status: string
}


export type TypeResponseTxHistory = Array<ResultTransactionList>

export type TypeResponseSignature = {
    field: string
    scalar: string
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

