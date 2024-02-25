export type PlayerType = 'X' | 'O';

export type SeaBattlePlayerType = PlayerType | 'K' | null;

export type WinnerType = PlayerType | null;

export type TypeOfGame = 'ttt' | 'sea';

export type UserType = {
  id: string;
  name: string;
};

export type SessionType = {
  id: string;
  type: TypeOfGame;
  users: UserType[];
};
