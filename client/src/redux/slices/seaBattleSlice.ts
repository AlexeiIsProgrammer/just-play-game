import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { setSession, socket } from './userSlice';
import {
  PlayerType,
  SeaBattlePlayerType,
  SessionType,
  WinnerType,
} from '../types';
import { Socket } from 'socket.io-client';

export type OrientationType = 'vertical' | 'horizontal';

type ShipFormType = {
  shipLength: number;
  count: number;
  coordinates: number[][];
};

export type ShipsType = {
  little: ShipFormType;
  small: ShipFormType;
  medium: ShipFormType;
  large: ShipFormType;
};

type InitialState = {
  winner: WinnerType;
  board: SeaBattlePlayerType[];
  opponentBoard: SeaBattlePlayerType[];
  currentMove: PlayerType;
  player: PlayerType;
  isReady: boolean;
  startGame: boolean;
};

const initialState: InitialState = {
  winner: null,
  board: Array(100).fill(null),
  opponentBoard: Array(100).fill(null),
  currentMove: 'X',
  player: 'X',
  isReady: false,
  startGame: false,
};

export const startSeaBattleListening = createAsyncThunk(
  'seaBattle/startSeaBattleListening',
  async ({ socket }: { socket: Socket }, { dispatch }) => {
    socket.on('sea-battle:sessionFull', (session: SessionType) => {
      dispatch(setSession(session));
      dispatch(setCurrentMove('X'));
    });

    socket.on(
      'sea-battle:sessionJoined',
      (session: SessionType, isFirstPlayer: boolean) => {
        dispatch(setPlayer(isFirstPlayer ? 'X' : 'O'));
        dispatch(setSession(session));
      }
    );

    socket.on('sea-battle:resetGame', () => {
      dispatch(setStartGame(false));
      dispatch(setWinner(null));
      dispatch(setCurrentMove('X'));
    });

    socket.on('sea-battle:ready', () => {
      dispatch(setStartGame(true));
    });

    socket.on('sea-battle:win', (winner) => {
      dispatch(setWinner(winner));
    });

    socket.on(
      'sea-battle:move',
      (currentMove: PlayerType, board: SeaBattlePlayerType[]) => {
        dispatch(setCurrentMove(currentMove));
        dispatch(setOpponentBoard(board));
      }
    );

    socket.on(
      'sea-battle:changeMove',
      (currentMove: PlayerType, board: SeaBattlePlayerType[]) => {
        dispatch(setCurrentMove(currentMove));
        dispatch(setBoard(board));
      }
    );
  }
);

const seaBattleSlice = createSlice({
  name: 'seaBattle',
  initialState,
  reducers: {
    placeShips: (
      state,
      { payload: shipsBoard }: { payload: SeaBattlePlayerType[] }
    ) => {
      state.board = shipsBoard;
    },
    setBoard: (
      state,
      { payload: board }: PayloadAction<SeaBattlePlayerType[]>
    ) => {
      state.board = board;
    },
    setOpponentCell: (
      state,
      {
        payload: { ind, type },
      }: PayloadAction<{ ind: number; type: SeaBattlePlayerType }>
    ) => {
      state.opponentBoard[ind] = type;
    },
    setCell: (state, { payload: ind }: PayloadAction<number>) => {
      if (state.board[ind] === 'K') {
        state.board[ind] = 'X';
      } else {
        state.board[ind] = 'O';
      }
    },
    setOpponentBoard: (
      state,
      { payload: opponentBoard }: PayloadAction<SeaBattlePlayerType[]>
    ) => {
      state.opponentBoard = opponentBoard;
    },
    setWinner: (state, { payload: winner }: PayloadAction<WinnerType>) => {
      state.winner = winner;
    },
    setIsReady: (
      state,
      {
        payload: { isReady, session, board },
      }: PayloadAction<{
        isReady: boolean;
        session: string;
        board: SeaBattlePlayerType[];
      }>
    ) => {
      state.isReady = isReady;
      socket.emit('sea-battle:ready', session, board, socket.id);
    },
    setStartGame: (state, { payload: startGame }: PayloadAction<boolean>) => {
      state.startGame = startGame;
    },
    resetGame: (_, { payload: session }: PayloadAction<string>) => {
      socket.emit('sea-battle:resetGame', session);
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
        payload: { session, ind, currentMove },
      }: PayloadAction<{
        session: SessionType;
        ind: number;
        currentMove: PlayerType;
      }>
    ) => {
      socket.emit('sea-battle:move', {
        session: session.id,
        ind,
        currentMove,
        userId: socket.id,
      });
    },
  },
});

export default seaBattleSlice.reducer;
export const {
  setBoard,
  setCell,
  setOpponentCell,
  setWinner,
  setCurrentMove,
  makeMove,
  resetGame,
  setPlayer,
  placeShips,
  setIsReady,
  setStartGame,
  setOpponentBoard,
} = seaBattleSlice.actions;
export const seaBattleSelector = (state: RootState) => state.seaBattle;
