import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { socket } from './userSlice';
import { PlayerType, SessionType, WinnerType } from '../types';

type InitialState = {
  winner: WinnerType;
  board: PlayerType[];
  currentMove: PlayerType;
};

const initialState: InitialState = {
  winner: null,
  board: Array(100).fill(null),
  currentMove: 'X',
};

const seaBattleSlice = createSlice({
  name: 'seaBattle',
  initialState,
  reducers: {
    setBoard: (state, { payload: board }: PayloadAction<PlayerType[]>) => {
      state.board = board;
    },
    setWinner: (state, { payload: winner }: PayloadAction<WinnerType>) => {
      state.winner = winner;
    },
    resetGame: (_, { payload: session }: PayloadAction<string>) => {
      socket.emit('resetGame', session);
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

export default seaBattleSlice.reducer;
export const { setBoard, setWinner, setCurrentMove, makeMove, resetGame } =
  seaBattleSlice.actions;
export const seaBattleSelector = (state: RootState) => state.seaBattle;
