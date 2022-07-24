import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showLoader: false
};

export const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    showLoader: (state) => {
      state.showLoader = true;
    },
    hideLoader: (state) => {
        state.showLoader = false;
    },
  },
});

export const { showLoader, hideLoader } = loaderSlice.actions;
export const selectLoader = (state) => state.loader.showLoader;

export default loaderSlice.reducer;
