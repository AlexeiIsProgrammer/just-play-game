import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { setSession, socket } from './userSlice';
import { PlayerType, SessionType, WinnerType } from '../types';
import { Socket } from 'socket.io-client';
import { checkTicTacToeWinner } from '../../../utils/checkTicTacToeWinner';

type InitialState = {
  winner: WinnerType;
  board: PlayerType[];
  currentMove: PlayerType;
  player: PlayerType;
};

const initialState: InitialState = {
  winner: null,
  board: Array(9).fill(null),
  currentMove: 'X',
  player: 'X',
};

export const startTicTacToeListening = createAsyncThunk(
  'user/startListening',
  async ({ socket }: { socket: Socket }, { dispatch }) => {
    socket.on('tic-tac-toe:sessionFull', (session: SessionType) => {
      dispatch(setBoard(Array(9).fill(null)));
      dispatch(setSession(session));
      dispatch(setCurrentMove('X'));
    });

    socket.on(
      'tic-tac-toe:sessionJoined',
      (session: SessionType, isFirstPlayer: boolean) => {
        dispatch(setPlayer(isFirstPlayer ? 'X' : 'O'));
        dispatch(setSession(session));
      }
    );

    socket.on('tic-tac-toe:resetGame', () => {
      dispatch(setBoard(Array(9).fill(null)));
      dispatch(setWinner(null));
      dispatch(setCurrentMove('X'));
    });

    socket.on('tic-tac-toe:move', (currentMove, board) => {
      dispatch(setCurrentMove(currentMove));
      dispatch(setBoard(board));

      const winner = checkTicTacToeWinner(board);
      if (winner) dispatch(setWinner(winner));
    });
  }
);

const ticTacToeSlice = createSlice({
  name: 'ticTacToe',
  initialState,
  reducers: {
    setBoard: (state, { payload: board }: PayloadAction<PlayerType[]>) => {
      state.board = board;
    },
    setWinner: (state, { payload: winner }: PayloadAction<WinnerType>) => {
      state.winner = winner;
    },
    resetGame: (_, { payload: session }: PayloadAction<string>) => {
      socket.emit('tic-tac-toe:resetGame', session);
    },
    setCurrentMove: (state, { payload }: PayloadAction<PlayerType>) => {
      state.currentMove = payload;
    },
    setPlayer: (state, { payload }: PayloadAction<PlayerType>) => {
      state.player = payload;
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
      socket.emit('tic-tac-toe:move', {
        session: session.id,
        board,
        ind,
        currentMove,
      });
    },
  },
});

export default ticTacToeSlice.reducer;
export const {
  setBoard,
  setWinner,
  setCurrentMove,
  makeMove,
  resetGame,
  setPlayer,
} = ticTacToeSlice.actions;
export const ticTacToeSelector = (state: RootState) => state.ticTacToe;
