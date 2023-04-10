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
    data: {
        message: string
        publicKey: string
    }
    signature: {
        field: string
        scalar: string
        signer: string
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

