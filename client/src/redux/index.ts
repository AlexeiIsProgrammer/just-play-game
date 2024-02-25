import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import userReducer from './slices/userSlice.ts';
import controllerReducer from './slices/controllerSlice.ts';
import ticTacToeReducer from './slices/ticTacToeSlice.ts';
import seaBattleReducer from './slices/seaBattleSlice.ts';

export const store = configureStore({
  reducer: {
    user: userReducer,
    controller: controllerReducer,
    ticTacToe: ticTacToeReducer,
    seaBattle: seaBattleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
