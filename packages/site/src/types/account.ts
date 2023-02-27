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
    balance: { total: string }
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

export type TypePayloadEditAccountName = {
    index: number
    name: string
    isImported: boolean
}


