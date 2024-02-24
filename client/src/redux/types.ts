export type PlayerType = 'X' | 'O';

export type TypeOfGame = 'ttt' | 'sea';

export type SessionType = {
  id: string;
  type: TypeOfGame;
  users: string[];
};
