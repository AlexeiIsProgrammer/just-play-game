import {SeaBattlePlayerType} from "../types";

export default function isShipFullyDestroyed(board: SeaBattlePlayerType[], attackedIndex: number) {
  if (isDestroyed(board, attackedIndex, -1)) {
    fillAround(board, attackedIndex, -1);

    return board;
  } else {
    return false;
  }
}

function fillAround(board: SeaBattlePlayerType[], cellIndex: number, prevCellIndex: number) {
  const adjacentIndices = [-11, -10, -9, -1, 1, 9, 10, 11];
  for (let index of adjacentIndices) {
    const adjacentIndex = cellIndex + index;
    if (!(adjacentIndex >= 0 && adjacentIndex < 100)) continue;

    if (board[adjacentIndex] !== "X") {
      board[adjacentIndex] = "O";
    } else {
      if (adjacentIndex !== prevCellIndex) fillAround(board, adjacentIndex, cellIndex);
    }
  }
  return true;
}

function isDestroyed(board: SeaBattlePlayerType[], cellIndex: number, prevCellIndex: number) {
  const adjacentIndices = [-11, -10, -9, -1, 1, 9, 10, 11];

  for (let index of adjacentIndices) {
    const adjacentIndex = cellIndex + index;
    if (!(adjacentIndex >= 0 && adjacentIndex < 100 && adjacentIndex !== prevCellIndex)) continue;

    if (board[adjacentIndex] === "K" || (board[adjacentIndex] === "X" && !isDestroyed(board, adjacentIndex, cellIndex))) {
      return false;
    }
  }
  return true;
}
