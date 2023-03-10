import { createSlice } from '@reduxjs/toolkit';

export interface modalState {
  infoModalVisible: boolean;
  minVersionModalVisible: boolean;
  isShowListAccount: boolean;
}

const initialState: modalState = {
  infoModalVisible: false,
  minVersionModalVisible: false,
  isShowListAccount: false
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,

  reducers: {
    setInfoModalVisible: (state, { payload }) => {
      state.infoModalVisible = payload;
    },
    setMinVersionModalVisible: (state, { payload }) => {
      state.minVersionModalVisible = payload;
    },
    setIsShowListAccount: (state, { payload }) => {
      state.isShowListAccount = payload;
      console.log(state.isShowListAccount, 'state.isShowListAccount');
    },
  },
});

export const { setInfoModalVisible, setMinVersionModalVisible, setIsShowListAccount } = modalSlice.actions;

export default modalSlice.reducer;
