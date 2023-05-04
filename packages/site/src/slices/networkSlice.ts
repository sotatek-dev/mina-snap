import { createSlice } from '@reduxjs/toolkit';
import { ResponseNetworkConfig } from 'types/snap';

export interface NetworkState {
  items: ResponseNetworkConfig;
  activeNetwork: string;
}

const initialState: NetworkState = {
  items: {} as ResponseNetworkConfig,
  activeNetwork: '',
};

export const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setNetworks: (state, action) => {
      state.items = action.payload;
    },
    setActiveNetwork: (state, action) => {
      state.activeNetwork = action.payload;
    },
    resetNetwork: () => {
      return {
        ...initialState,
      };
    },
  },
});

export const { setNetworks, setActiveNetwork, resetNetwork } = networkSlice.actions;

export default networkSlice.reducer;
