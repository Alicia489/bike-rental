import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createBikeinCollection, fetchAllBikesFromCollection, deleteBikeFromCollection, updateBikeInCollection } from './bikesFirebase';
import { fetchAllReservationsFromCollection } from '../Reserve/reserveFirebase';

const initialState = {
    bikes: [],
    filteredBikes: [],
    selectedBike: {},
};

export const createBike = createAsyncThunk(
    'bikes/create',
    async (bikeDetails) => {
        const response = await createBikeinCollection(bikeDetails);
        return response;
    }
);

export const getAllBikes = createAsyncThunk(
    'bikes/getAll',
    async () => {
        const response = await fetchAllBikesFromCollection();
        return response;
    }
);

export const removeBike = createAsyncThunk(
    'bikes/delete',
    async (id) => {
        const response = await deleteBikeFromCollection(id);
        return response;
    }
);

export const updateBike = createAsyncThunk(
    'bikes/edit',
    async ({ id, data }) => {
        const response = await updateBikeInCollection(id, data);
        return response;
    }
);

export const getBikesInDateRange = createAsyncThunk(
    'bikes/timeperiod',
    async ({ from, to }) => {
        const response = await fetchAllReservationsFromCollection(from, to);
        return response;
    }
);

export const bikesSlice = createSlice({
    name: 'bikes',
    initialState,
    reducers: {
        setSelectedBike: (state, action) => {
            state.selectedBike = { ...state.selectedBike, ...action.payload }
        },
        clearSelectedBike: (state, action) => {
            state.selectedBike = {}
        },
        filterBikes: (state, action) => {
            state.filteredBikes = state.bikes.filter(e => action.payload.indexOf(e.id) === -1)
        },
        clearFilteredBikes: (state) => {
            state.filteredBikes = []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllBikes.fulfilled, (state, action) => {
                state.bikes = action.payload
            })
    },
});
export const { setSelectedBike, filterBikes, clearSelectedBike, clearFilteredBikes } = bikesSlice.actions;

export const selectBikes = (state) => state.bikes.bikes;
export const selectFilteredBikes = (state) => state.bikes.filteredBikes;
export const selectBikeSelected = (state) => state.bikes.selectedBike;

export default bikesSlice.reducer;
