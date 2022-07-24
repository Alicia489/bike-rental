import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showModal: false,
  modalContent: {
    heading: '',
    message: '',
    type: '',
    buttons: [
      {
        text: 'Cancel',
        action: () => {}
      },
      {
        text: 'OK',
        action: () => { }
      }
    ]
  },
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    showModal: (state, action) => {
      state.showModal = true;
      state.modalContent = action.payload
    },
    hideModal: (state) => {
        state.showModal = false;
        state.modalContent = initialState.modalContent
    },
  },
});

export const { showModal, hideModal } = modalSlice.actions;
export const selectModal = (state) => state.modal.showModal;
export const selectModalContent = (state) => state.modal.modalContent;

export default modalSlice.reducer;
