/* eslint-disable no-unused-vars */

import {
    Account,
    ResultCreateAccount,
    ResultAccountList,
    PayloadChangeAccount,
    TypeImportAccount,
    TypePayloadEditAccountName,
    ResponseExportPrivateKey,

} from 'types/account';
import { TypeResponseSendTransaction, payloadSendTransaction, TypeResponseSignature, TypeResponseTxHistory, TypeResponseSwtichNetwork } from 'types/transaction';
import { ResponseNetworkConfig } from 'types/snap';
const { ethereum } = window as any;
const snapId = process.env.REACT_APP_SNAP_ID ? process.env.REACT_APP_SNAP_ID : 'npm:mina-portal';
const snapVersion = process.env.REACT_APP_SNAP_VERSION ? process.env.REACT_APP_SNAP_VERSION : '*';

type MethodsType = {
    connectToSnap: () => void
    getSnap: () => void
    getAccountInfors: () => void
    CreateAccount: (name: string) => void
    ChangeAccount: (payload: PayloadChangeAccount) => void
    AccountList: () => void
    ImportAccount: (payload: TypeImportAccount) => void
    EditAccountName: (payload: TypePayloadEditAccountName) => void
    ExportPrivateKey: (payload: PayloadChangeAccount) => void
    SendTransaction: (payload: payloadSendTransaction) => void
    getTxHistory: () => void
    Signature: (payload: string) => void
    SwitchNetwork: (payload: string) => void
    RequestSnap: () => void
    GetNetworkConfigSnap: () => void
};

export class WalletConfig {
    readonly methods: MethodsType;
    constructor(data: {
        methods: MethodsType;

    }) {
        (this.methods = data.methods)
    }
}

export const WALLET = {
    MetamaskFlask: new WalletConfig({
        methods: {
            connectToSnap: async () => {
                await ethereum.request({ method: 'wallet_requestSnaps', params: { [snapId]: { snapVersion } } })
            },

            getSnap: async () => {
                return await ethereum.request({ method: 'wallet_getSnaps' });
            },

            getAccountInfors: async (): Promise<Account> => {
                return await ethereum.request({
                    method: 'wallet_invokeSnap',
                    params: {
                        snapId: snapId,
                        request: {
                            method: 'mina_accountInfo',
                        },
                    },
                });
            },

            CreateAccount: async (name: string): Promise<ResultCreateAccount> => {
                return await ethereum.request({
                    method: 'wallet_invokeSnap',
                    params: {
                        snapId: snapId,
                        request: {
                            method: 'mina_createAccount',
                            params: {
                                name: name
                            }
                        },
                    },
                });
            },


            ChangeAccount: async (payload: PayloadChangeAccount): Promise<Array<ResultCreateAccount>> => {

                return await ethereum.request({
                    method: 'wallet_invokeSnap',
                    params: {
                        snapId: snapId,
                        request: {
                            method: 'mina_changeAccount',
                            params: {
                                accountIndex: payload.accountIndex,
                                isImported: payload.isImported
                            }
                        },
                    },
                });
            },

            AccountList: async (): Promise<Array<ResultAccountList>> => {
                return await ethereum.request({
                    method: 'wallet_invokeSnap',
                    params: {
                        snapId: snapId,
                        request: {
                            method: 'mina_accountList',
                        },
                    },
                });
            },

            ImportAccount: async (payload: TypeImportAccount): Promise<ResultCreateAccount> => {
                return await ethereum.request({
                    method: 'wallet_invokeSnap',
                    params: {
                        snapId: snapId,
                        request: {
                            method: 'mina_importAccountByPrivateKey',
                            params: {
                                name: payload.name,
                                privateKey: payload.privateKey
                            }
                        },
                    },
                });
            },

            EditAccountName: async (payload: TypePayloadEditAccountName): Promise<ResultCreateAccount> => {
                return await ethereum.request({
                    method: 'wallet_invokeSnap',
                    params: {
                        snapId: snapId,
                        request: {
                            method: 'mina_editAccountName',
                            params: {
                                name: payload.name,
                                index: payload.index,
                                isImported: payload.isImported
                            }
                        },
                    },
                });
            },

            ExportPrivateKey: async (payload: PayloadChangeAccount): Promise<ResponseExportPrivateKey> => {
                return await ethereum.request({
                    method: 'wallet_invokeSnap',
                    params: {
                        snapId: snapId,
                        request: {
                            method: 'mina_exportPrivateKey',
                            params: {
                                index: payload.accountIndex,
                                isImported: payload.isImported
                            }
                        },
                    },
                });
            },

            SendTransaction: async (payload: payloadSendTransaction): Promise<TypeResponseSendTransaction> => {
                return await ethereum.request({
                    method: 'wallet_invokeSnap',
                    params: {
                        snapId: snapId,
                        request: {
                            method: 'mina_sendPayment',
                            params: {
                                to: payload.to,
                                amount: payload.amount,
                                fee: payload.fee,
                                memo: payload.memo,
                                nonce: payload.nonce,
                                validUntil: 0
                            }
                        },
                    },
                });
            },

            getTxHistory: async (): Promise<TypeResponseTxHistory> => {
                return await ethereum.request({
                    method: 'wallet_invokeSnap',
                    params: {
                        snapId: snapId,
                        request: {
                            method: 'mina_getTxHistory',
                            params: {
                                limit: 51,
                                sortBy: "DATETIME_DESC",
                                canonical: true
                            }
                        },
                    },
                });
            },

            Signature: async (payload: string): Promise<TypeResponseSignature> => {
                return await ethereum.request({
                    method: 'wallet_invokeSnap',
                    params: {
                        snapId: snapId,
                        request: {
                            method: 'mina_signMessage',
                            params: {
                                message: payload
                            }
                        },
                    },
                });
            },

            SwitchNetwork: async (payload: string): Promise<TypeResponseSwtichNetwork> => {
                return await ethereum.request({
                    method: 'wallet_invokeSnap',
                    params: {
                        snapId: snapId,
                        request: {
                            method: 'mina_changeNetwork',
                            params: {
                                networkName: payload
                            }
                        },
                    },
                });
            },

            RequestSnap: async (): Promise<any> => {
                return await ethereum.request({
                    method: 'wallet_requestSnaps',
                    params: {
                        'npm:mina-portal': {
                        },
                    },
                });
            },

            GetNetworkConfigSnap: async (): Promise<ResponseNetworkConfig> => {
                return await ethereum.request({
                    method: 'wallet_invokeSnap',
                    params: {
                        snapId: snapId,
                        request: {
                            method: 'mina_networkConfig',

                        },
                    },
                });
            },

        },

    })

};
