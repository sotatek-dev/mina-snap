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

export type PayloadChangeAccount = {
    accountIndex: number,
    isImported?: boolean
}


export type TypeImportAccount = {
    name: string
    privateKey: string
}



