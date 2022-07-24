import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    createReservationInCollection, deleteReservationFromCollection, fetchAllReservationsByBike,
    fetchAllReservationsFromCollection, updateBikeRatingInCollection, updateHasRatedInCollection
} from './reserveFirebase';

const initialState = {
    reservations: [],
};

export const createReservation = createAsyncThunk(
    'reservations/create',
    async (data) => {
        const response = await createReservationInCollection(data);
        return response;
    }
);

export const getAllReservations = createAsyncThunk(
    'reservations/getAll',
    async (uid) => {
        const response = await fetchAllReservationsFromCollection(uid);
        return response;
    }
);

export const getAllReservationsByBike = createAsyncThunk(
    'reservations/getAllByBike',
    async (bikeId) => {
        const response = await fetchAllReservationsByBike(bikeId);
        return response;
    }
);

export const removeReservation = createAsyncThunk(
    'reservations/delete',
    async (id) => {
        const response = await deleteReservationFromCollection(id);
        return response;
    }
);

export const rateBike = createAsyncThunk(
    'bikes/rate',
    async ({ id, rating }) => {
        const response = await updateBikeRatingInCollection(id, rating);
        return response;
    }
);

export const updateHasRated = createAsyncThunk(
    'reservations/hasRated',
    async (id) => {
        const response = await updateHasRatedInCollection(id);
        return response;
    }
);

// export const updateBike = createAsyncThunk(
//     'bikes/edit',
//     async ({id, data}) => {
//         const response = await updateBikeInCollection(id, data);
//         return response;
//     }
// );

export const reserveSlice = createSlice({
    name: 'reservations',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllReservations.fulfilled, (state, action) => {
                state.reservations = action.payload
            })
            .addCase(getAllReservationsByBike.fulfilled, (state, action) => {
                state.reservations = action.payload
            })
    },
});

export const selectReservations = (state) => state.reserve.reservations;

export default reserveSlice.reducer;
