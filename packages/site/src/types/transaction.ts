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