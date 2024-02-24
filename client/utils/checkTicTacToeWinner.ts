import { winConditions } from '../src/constants';
import { PlayerType } from './../src/redux/types';

export const checkTicTacToeWinner = (board: PlayerType[]) => {
  for (const condition of winConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
};
