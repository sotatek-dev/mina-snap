import { createContext, Dispatch, ReactNode, Reducer, useEffect, useReducer } from 'react';
import { Snap } from 'types/snap';
import { isFlask } from 'utils/utils';
import { useMinaSnap } from 'services/useMinaSnap';

export type MetamaskState = {
  isFlask: boolean;
  installedSnap?: Snap;
  error?: Error;
};

const initialState: MetamaskState = {
  isFlask: false,
  error: undefined,
};

type MetamaskDispatch = { type: MetamaskActions; payload: any };

export const MetaMaskContext = createContext<[MetamaskState, Dispatch<MetamaskDispatch>]>([initialState, () => {}]);

export enum MetamaskActions {
  SetInstalled = 'SetInstalled',
  SetFlaskDetected = 'SetFlaskDetected',
  SetError = 'SetError',
}

const reducer: Reducer<MetamaskState, MetamaskDispatch> = (state, action) => {
  console.log(action.type, 'console.log(action.type);');
  switch (action.type) {
    case MetamaskActions.SetInstalled:
      console.log(action, 'SetInstalled');
      return {
        ...state,
        installedSnap: action.payload,
      };

    case MetamaskActions.SetFlaskDetected:
      console.log(action, 'SetFlaskDetected');
      return {
        ...state,
        isFlask: action.payload,
      };

    case MetamaskActions.SetError:
      console.log(action, 'SetError');
      return {
        ...state,
        error: action.payload,
      };

    default:
      console.log(action, 'default');
      return state;
  }
};

export const MetaMaskProvider = ({ children }: { children: ReactNode }) => {
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function detectFlask() {
      const isFlaskDetected = await isFlask();

      dispatch({
        type: MetamaskActions.SetFlaskDetected,
        payload: isFlaskDetected,
      });
    }

    async function detectSnapInstalled() {
      const { getSnap } = useMinaSnap();
      const installedSnap = await getSnap();
      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    }

    detectFlask();

    if (state.isFlask) {
      detectSnapInstalled();
    }
  }, [state.isFlask, window.ethereum]);

  useEffect(() => {
    let timeoutId: number;

    if (state.error) {
      timeoutId = window.setTimeout(() => {
        dispatch({
          type: MetamaskActions.SetError,
          payload: undefined,
        });
      }, 10000);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [state.error]);

  return <MetaMaskContext.Provider value={[state, dispatch]}>{children}</MetaMaskContext.Provider>;
};
