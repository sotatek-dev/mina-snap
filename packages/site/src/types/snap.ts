export type GetSnapsResponse = Record<string, Snap>;

export type Snap = {
    permissionName: string;
    id: string;
    version: string;
    initialPermissions: Record<string, unknown>;
};


export type ResponseNetworkConfig = {
    name: string
    gqlUrl: string
    gqlTxUrl: string
    explorerUrl: string
    token: {
        name: string
        coinType: number
        symbol: string
        decimals: number
    }
}

export type ResponeseZkTransaction = {
    id: string,
    hash: string
}