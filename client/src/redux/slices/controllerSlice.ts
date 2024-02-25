import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { socket } from './userSlice';
import { SessionType, TypeOfGame } from '../types';

type InitialState = {
  sessions: SessionType[];
};

const initialState: InitialState = {
  sessions: [],
};

const controllerSlice = createSlice({
  name: 'controller',
  initialState,
  reducers: {
    setSessions: (
      state,
      { payload: sessions }: PayloadAction<SessionType[]>
    ) => {
      state.sessions = sessions;
    },
    addSession: (state, { payload: session }: PayloadAction<SessionType>) => {
      state.sessions.push(session);
    },
    joinSession: (
      _,
      {
        payload: { session, name, type },
      }: PayloadAction<{ session: string; name: string; type: TypeOfGame }>
    ) => {
      socket.emit('joinSession', session, name, type);
    },
  },
});

export default controllerSlice.reducer;
export const { setSessions, addSession, joinSession } = controllerSlice.actions;
export const controllerSelector = (state: RootState) => state.controller;
