export type Account = {
    balance: { total: string }
    delegate: string
    inferredNonce: string
    nonce: string
    publicKey: string
    name: string
}

export type ResultCreateAccount = {
    name: string
    address: string
    balance: string
    inferredNonce: string
}

export type ResultAccountList = {
    name: string
    address: string
    index?: number
    balance?: { total: string }
    isImported?: boolean
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

export type ResponseExportPrivateKey = {
    privateKey: string
}



export type payloadActiveAccount = {
    activeAccount: string
    balance: string
    accountName: string
    inferredNonce: string
}

