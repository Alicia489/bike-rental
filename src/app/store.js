import {
  configureStore,
  combineReducers,
  getDefaultMiddleware
} from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import loaderReducer from '../components/Loader/loaderSlice';
import sessionReducer from '../modules/Home/sessionSlice';
import modalReducer from '../components/Modal/modalSlice';
import bikesReducer from '../modules/ManagersDashboard/bikesSlice';
import reserveReducer from '../modules/Reserve/reserveSlice';

const combinedReducer = combineReducers({
  counter: counterReducer,
  loader: loaderReducer,
  session: sessionReducer,
  modal: modalReducer,
  bikes: bikesReducer,
  reserve: reserveReducer
});

const rootReducer = (state, action) => {
  if (action.type === 'session/resetState') {
    state = undefined;
  }
  return combinedReducer(state, action);
};

export const store =  configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware()]
});

store.subscribe(() => console.log("Store", store.getState()))
