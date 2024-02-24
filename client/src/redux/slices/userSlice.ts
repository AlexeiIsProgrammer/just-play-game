import { checkTicTacToeWinner } from './../../../utils/checkTicTacToeWinner';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { io } from 'socket.io-client';
import {
  addSession,
  setBoard,
  setCurrentMove,
  setSessions,
  setWinner,
} from './controllerSlice';
import { PlayerType, SessionType } from '../types';

export const socket = io(import.meta.env.VITE_BACKEND_URL);

type InitialState = {
  session: SessionType | null;
  player: PlayerType;
};

const initialState: InitialState = {
  session: null,
  player: 'X',
};

export const startListening = createAsyncThunk(
  'user/startListening',
  async (_, { dispatch }) => {
    socket.on('showSessions', (sessions: SessionType[]) => {
      dispatch(setSessions(sessions));
    });

    socket.on('sessionCreated', (session: SessionType) => {
      dispatch(addSession(session));
    });

    socket.on(
      'sessionJoined',
      (session: SessionType, isFirstPlayer: boolean) => {
        dispatch(setPlayer(isFirstPlayer ? 'X' : 'O'));
        dispatch(setSession(session));
      }
    );

    socket.on('userDisconnect', (userId: string) => {
      dispatch(removeSessionUser(userId));
    });

    socket.on('sessionFull', (session: SessionType) => {
      dispatch(setSession(session));
      dispatch(setCurrentMove('X'));
    });

    socket.on('resetGame', () => {
      dispatch(setBoard(Array(9).fill(null)));
      dispatch(setWinner(null));
      dispatch(setCurrentMove('X'));
    });

    socket.on('sessionNotFound', () => {
      alert('Session not found!');
    });

    socket.on('move', (currentMove, board) => {
      dispatch(setCurrentMove(currentMove));
      dispatch(setBoard(board));

      const winner = checkTicTacToeWinner(board);
      if (winner) dispatch(setWinner(winner));
    });
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    createSession: () => {
      socket.emit('createSession');
    },
    setSession: (state, { payload: user }: PayloadAction<SessionType>) => {
      state.session = user;
    },
    removeSessionUser: (state, { payload: userId }: PayloadAction<string>) => {
      if (state.session)
        state.session.users = state.session?.users.filter(
          (user) => user !== userId
        );
    },
    setPlayer: (state, { payload }: PayloadAction<PlayerType>) => {
      state.player = payload;
    },
  },
});

export default userSlice.reducer;
export const { setSession, createSession, setPlayer, removeSessionUser } =
  userSlice.actions;
export const userSelector = (state: RootState) => state.user;
