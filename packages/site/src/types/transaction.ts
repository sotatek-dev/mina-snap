export type payloadSendTransaction = {
    to: string,
    amount: number,
    memo: string,
    fee: number,
    nonce: number,
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
}

// export type TypeResponseTxHistory = {
//     fee: number
//     from: string
//     to: string
//     nonce: number
//     amount: number
//     memo: string
//     hash: string
//     kind: string
//     dateTime: string
//     failureReason: string
// }

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