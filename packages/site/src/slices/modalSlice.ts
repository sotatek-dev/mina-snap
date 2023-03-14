import { createSlice } from '@reduxjs/toolkit';

export interface modalState {
  infoModalVisible: boolean;
  minVersionModalVisible: boolean;
  isShowListAccount: boolean;
  isShowKebabMenu: boolean;
}

const initialState: modalState = {
  infoModalVisible: false,
  minVersionModalVisible: false,
  isShowListAccount: false,
  isShowKebabMenu: false,
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
    },
    setIsShowKebabMenu: (state, { payload }) => {
      state.isShowKebabMenu = payload;
    },
  },
});

export const { setInfoModalVisible, setMinVersionModalVisible, setIsShowListAccount, setIsShowKebabMenu} = modalSlice.actions;

export default modalSlice.reducer;
