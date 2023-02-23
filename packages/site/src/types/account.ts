export type Account = {
    balance: { total: string }
    delegate: string
    inferredNonce: string
    nonce: string
    publicKey: string
}
export type ResultCreateAccount = {
    name: string
    address: string
}

export type ResultAccountList = {
    name: string
    address: string
    index: number
    isImported: boolean
}