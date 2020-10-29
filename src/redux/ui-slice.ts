// @ts-nocheck
/* eslint-disable prefer-destructuring */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
// immer wraps around redux-toolkit so we can 'directly' mutate state'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { processGraphResponse } from './graph-slice';

export type Selection = {
  label: string;
  id: string;
  type: string;
  selected: boolean;
};

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
  nodeSelection: Selection[];
  edgeSelection: Selection[];
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
  nodeSelection: [{ label: 'id', id: 'id', type: 'string', selected: true }],
  edgeSelection: [
    { label: 'id', id: 'id', type: 'string', selected: true },
    { label: 'source', id: 'source', type: 'string', selected: true },
    { label: 'target', id: 'target', type: 'string', selected: true },
  ],
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
    updateNodeSelection(
      state,
      action: PayloadAction<{ index: number; status: boolean }>,
    ) {
      const { index, status } = action.payload;
      state.nodeSelection[index].selected = status;
    },
    updateEdgeSelection(
      state,
      action: PayloadAction<{ index: number; status: boolean }>,
    ) {
      const { index, status } = action.payload;
      state.edgeSelection[index].selected = status;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(processGraphResponse, (state, action) => {
      const { data } = action.payload;
      const currentNodeFields = state.nodeSelection.map((x) => x.id);
      const currentEdgeFields = state.edgeSelection.map((x) => x.id);
      for (const field of data.metadata.fields.nodes) {
        if (!currentNodeFields.includes(field.name)) {
          state.nodeSelection.push({
            label: field.name,
            id: field.name,
            type: field.type,
            selected: false,
          });
        }
      }
      for (const field of data.metadata.fields.edges) {
        if (!currentEdgeFields.includes(field.name)) {
          state.edgeSelection.push({
            label: field.name,
            id: field.name,
            type: field.type,
            selected: false,
          });
        }
      }
    });
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
  updateNodeSelection,
  updateEdgeSelection,
} = ui.actions;

export default ui.reducer;
