export type TypeOfGame = "ttt" | "sea";

export type PlayerType = "X" | "O";

export type SeaBattlePlayerType = PlayerType | "K" | null;

export type UserType = {
  id: string;
  board?: SeaBattlePlayerType[];
  name: string;
};

export type SessionType = {
  users: UserType[];
  ready?: number;
  type: "ttt" | "sea";
};

export type SessionsType = {
  [key: string]: SessionType;
};
