import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { logInWithEmailAndPassword, registerWithEmailAndPassword, logout, getUserDataFromStore, fetchAllUsersByRoleFromStore, deleteUserFromCollection, updateUserInCollection } from "../../firebase.js";

const initialState = {
    user: null,
    isLoggedIn: false,
    users: [],
    managers: []
};

export const signIn = createAsyncThunk(
    'session/signIn',
    async ({ email, password }) => {
        const response = await logInWithEmailAndPassword(email, password);
        return {
            email: response.user.email,
            uid: response.user.uid,
            accessToken: response.user.accessToken,
        }
    }
);

export const signUp = createAsyncThunk(
    'session/signUp',
    async ({ email, password, fullName, role }) => {
        const response = await registerWithEmailAndPassword(email, password, role, fullName);
        return response;
    }
);

export const signOut = createAsyncThunk(
    'session/signOut',
    async () => {
        const response = await logout();
        return response;
    }
);

export const getUserRole = createAsyncThunk(
    'session/userRole',
    async (uid) => {
        const response = await getUserDataFromStore(uid);
        return response;
    }
);

export const getUsersByRole = createAsyncThunk(
    'session/getAllUsersByRole',
    async (role) => {
        const response = await fetchAllUsersByRoleFromStore(role);
        return response;
    }
);

export const removeUser = createAsyncThunk(
    'session/user-delete',
    async (id) => {
        const response = await deleteUserFromCollection(id);
        return response;
    }
);

export const updateUser = createAsyncThunk(
    'session/user-update',
    async ({id, data}) => {
        const response = await updateUserInCollection(id, data);
        return response;
    }
);

export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        resetState: state => {},
        setUserDetails: (state, action) => {
            state.user = action.payload
            state.isLoggedIn = true;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signIn.fulfilled, (state, action) => {
                state.user = action.payload
                state.isLoggedIn = true;
            })
            .addCase(signOut.fulfilled, (state, action) => {
                state.user = null
                state.isLoggedIn = false
            })
            .addCase(getUserRole.fulfilled, (state, action) => {
                state.user.role = action.payload
            })
            .addCase(getUsersByRole.fulfilled, (state, action) => {
                console.log(action, "From store")
                if (action.payload.role === 'manager') {
                    state.managers = action.payload.users.filter(e => e.uid !== state.user.uid)
                } else {
                    state.users = action.payload.users
                }
            });
    },
});

export const {
    resetState,
    setUserDetails
  } = sessionSlice.actions;

export const selectCurrentUser = (state) => state.session.user;
export const selectLoggedInState = (state) => state.session.isLoggedIn;
export const selectUserRole = (state) => state.session.user.role;
export const selectAllUsers = (state) => state.session.users;
export const selectAllManagers = (state) => state.session.managers;


export default sessionSlice.reducer;
