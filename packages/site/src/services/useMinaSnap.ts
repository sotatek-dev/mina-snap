// import { useAppDispatch } from "hooks/redux";
// import { setWalletConnection, setForceReconnect } from 'slices/walletSlice';
// import { disableLoading, enableLoadingWithMessage } from '../slices/UISlice';

export const useStarkNetSnap = () => {
  const { ethereum } = window as any;
  const snapId = process.env.REACT_APP_SNAP_ID ? process.env.REACT_APP_SNAP_ID : 'local:http://localhost:8080/';
  const snapVersion = process.env.REACT_APP_SNAP_VERSION ? process.env.REACT_APP_SNAP_VERSION : '*';
  // const dispatch = useAppDispatch();

  const connectToSnap = async () => {
    await ethereum.request({ method: 'wallet_requestSnaps', params: { [snapId]: { snapVersion } } })
  };
  const testCallHello = () => {
    ethereum
      .request({
        method: 'wallet_invokeSnap',

        params: {
          snapId: snapId,
          request: {
            method: 'hello',
          },
        },
      })

  };
  const getSnaps = async () => {
    await ethereum.request({ method: 'wallet_getSnaps' });
  };

  return {
    testCallHello,
    connectToSnap,
    getSnaps
  };
};