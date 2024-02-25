import {SeaBattlePlayerType} from "../types";

export const checkSeaBattleWinner = (board: SeaBattlePlayerType[]): boolean => {
  return !board.some((cell) => cell === "K");
};
