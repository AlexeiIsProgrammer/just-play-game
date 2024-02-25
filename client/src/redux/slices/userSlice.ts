import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { io } from 'socket.io-client';
import { addSession, setSessions } from './controllerSlice';
import { SessionType, TypeOfGame } from '../types';
import { setBoard, setWinner, startTicTacToeListening } from './ticTacToeSlice';
import {
  setBoard as setSeaBoard,
  setWinner as setSeaWinner,
  setOpponentBoard,
  startSeaBattleListening,
  setStartGame,
} from './seaBattleSlice';

export const socket = io(import.meta.env.VITE_BACKEND_URL);

type InitialState = {
  name: string;
  session: SessionType | null;
};

const initialState: InitialState = {
  name: '',
  session: null,
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

    socket.on('userDisconnect', () => {
      dispatch(removeSessionUser());

      dispatch(setBoard([]));
      dispatch(setWinner(null));

      dispatch(setStartGame(false));
      dispatch(setOpponentBoard([]));
      dispatch(setSeaBoard([]));
      dispatch(setSeaWinner(null));
    });

    socket.on('sessionNotFound', () => {
      alert('Session not found!');
    });

    dispatch(startTicTacToeListening({ socket }));
    dispatch(startSeaBattleListening({ socket }));
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    createSession: (
      _,
      {
        payload: { type, name },
      }: PayloadAction<{ type: TypeOfGame; name: string }>
    ) => {
      socket.emit('createSession', type, name);
    },
    exitSession: () => {
      socket.emit('disconnectUser');
    },
    setSession: (state, { payload: user }: PayloadAction<SessionType>) => {
      state.session = user;
    },
    removeSessionUser: (state) => {
      state.session = null;
    },
    setName: (state, { payload: name }: PayloadAction<string>) => {
      state.name = name;
    },
  },
});

export default userSlice.reducer;
export const {
  setSession,
  createSession,
  removeSessionUser,
  exitSession,
  setName,
} = userSlice.actions;
export const userSelector = (state: RootState) => state.user;
