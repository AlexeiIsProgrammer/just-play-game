import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { socket } from './userSlice';
import { PlayerType, SessionType } from '../types';

type WinnerType = PlayerType | null;

type InitialState = {
  sessions: SessionType[];
  winner: WinnerType;
  board: PlayerType[];
  currentMove: PlayerType;
};

const initialState: InitialState = {
  sessions: [],
  winner: null,
  board: Array(9).fill(null),
  currentMove: 'X',
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
      console.log(session);

      state.sessions.push(session);
    },
    resetGame: (_, { payload: session }: PayloadAction<string>) => {
      socket.emit('resetGame', session);
    },
    joinSession: (
      _,
      {
        payload: { session, name },
      }: PayloadAction<{ session: string; name: string }>
    ) => {
      socket.emit('joinSession', session, name);
    },
    setBoard: (state, { payload: board }: PayloadAction<PlayerType[]>) => {
      state.board = board;
    },
    setWinner: (state, { payload: winner }: PayloadAction<WinnerType>) => {
      state.winner = winner;
    },
    setCurrentMove: (state, { payload }: PayloadAction<PlayerType>) => {
      state.currentMove = payload;
    },
    makeMove: (
      _,
      {
        payload: { session, board, ind, currentMove },
      }: PayloadAction<{
        session: SessionType;
        board: PlayerType[];
        ind: number;
        currentMove: PlayerType;
      }>
    ) => {
      socket.emit('move', {
        session: session.id,
        board,
        ind,
        currentMove,
      });
    },
  },
});

export default controllerSlice.reducer;
export const {
  setSessions,
  addSession,
  resetGame,
  joinSession,
  setBoard,
  setWinner,
  setCurrentMove,
  makeMove,
} = controllerSlice.actions;
export const controllerSelector = (state: RootState) => state.controller;
