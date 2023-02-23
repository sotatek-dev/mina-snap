export enum EMinaMethod {
  ACCOUNT_INFO = 'mina_accountInfo',
  CREATE_ACCOUNT = 'mina_createAccount',
  IMPORT_ACCOUNT_PK = 'mina_importAccountByPrivateKey',
  CHANGE_ACCOUNT = 'mina_changeAccount',
  CHANGE_NETWORK = 'mina_changeNetwork',
  HELLO = 'hello',
  NETWORK_CONFIG = 'mina_networkConfig',
  RESET_CONFIG = 'mina_resetSnapConfig',
  SEND_PAYMENT = 'mina_sendPayment',
  SIGN_MESSAGE = 'mina_signMessage',
  GET_TX_HISTORY = 'mina_getTxHistory',
  GET_TX_DETAIL = 'mina_getTxDetail',
  GET_TX_STATUS = 'mina_getTxStatus',
  EDIT_ACCOUNT_NAME = 'mina_editAccountName',
  ACCOUNT_LIST = 'mina_accountList'
}