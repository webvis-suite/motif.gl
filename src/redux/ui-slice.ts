// @ts-nocheck
/* eslint-disable prefer-destructuring */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
// immer wraps around redux-toolkit so we can 'directly' mutate state'
import { createSlice } from '@reduxjs/toolkit';

export interface UiState {
  name: string;
  currency: string;
  loading: boolean;
  modalMsg: string;
  modalOpen: boolean;
  modalImportOpen: boolean;
  clickedId: any;
  timeLock: boolean;
  bottomOpen: boolean;
  score: any;
}

const initialState: UiState = {
  name: '',
  currency: '',
  loading: false,
  modalMsg: '',
  modalOpen: false,
  modalImportOpen: true,
  clickedId: null,
  timeLock: false,
  bottomOpen: false,
  score: null,
};

const ui = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    fetchBegin(state) {
      state.loading = true;
      state.modalMsg = '';
      state.modalOpen = false;
    },
    fetchError(state, action) {
      state.loading = false;
      state.modalMsg = action.payload.message;
      state.modalOpen = true;
    },
    fetchDone(state) {
      state.loading = false;
    },
    closeModal(state) {
      state.modalOpen = false;
    },
    openImportModal(state) {
      state.modalImportOpen = true;
    },
    closeImportModal(state) {
      state.modalImportOpen = false;
    },
    postMessage(state, action) {
      state.modalOpen = true;
      state.modalMsg = action.payload;
    },
    setTimeLock(state) {
      state.timeLock = true;
    },
    setBottomOpen(state, action) {
      state.bottomOpen = action.payload;
    },
    setClickedId(state, action) {
      const id = action.payload;
      state.clickedId = id;
    },
    setScore(state, action) {
      state.score = action.payload;
    },
    setName(state, action) {
      state.name = action.payload;
    },
    setCurrency(state, action) {
      state.currency = action.payload;
    },
  },
});

export const {
  fetchBegin,
  fetchError,
  fetchDone,
  closeModal,
  openImportModal,
  closeImportModal,
  postMessage,
  setTimeLock,
  setBottomOpen,
  setClickedId,
  setScore,
  setName,
  setCurrency,
} = ui.actions;

export default ui.reducer;
