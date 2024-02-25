import { SeaBattlePlayerType } from '../redux/types';

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function placeShip(board: SeaBattlePlayerType[], shipSize: number) {
  let placed = false;
  while (!placed) {
    const randomIndex = Math.floor(Math.random() * 100);
    const direction = getRandomInt(0, 1);

    let fits = true;
    if (direction === 0) {
      if ((randomIndex % 10) + shipSize > 10) {
        fits = false;
      } else {
        for (let i = 0; i < shipSize; i++) {
          const cellIndex = randomIndex + i;
          if (board[cellIndex] !== null || isAdjacentToShip(board, cellIndex)) {
            fits = false;
            break;
          }
        }
      }
    } else {
      if (Math.floor(randomIndex / 10) + shipSize > 10) {
        fits = false;
      } else {
        for (let i = 0; i < shipSize; i++) {
          const cellIndex = randomIndex + i * 10;
          if (board[cellIndex] !== null || isAdjacentToShip(board, cellIndex)) {
            fits = false;
            break;
          }
        }
      }
    }

    if (fits) {
      placed = true;
      if (direction === 0) {
        for (let i = 0; i < shipSize; i++) {
          const cellIndex = randomIndex + i;
          board[cellIndex] = 'K';
          markAdjacentCells(board, cellIndex);
        }
      } else {
        for (let i = 0; i < shipSize; i++) {
          const cellIndex = randomIndex + i * 10;
          board[cellIndex] = 'K';
          markAdjacentCells(board, cellIndex);
        }
      }
    }
  }
}

function isAdjacentToShip(board: SeaBattlePlayerType[], cellIndex: number) {
  const adjacentIndices = [
    cellIndex - 11,
    cellIndex - 10,
    cellIndex - 9,
    cellIndex - 1,
    cellIndex + 1,
    cellIndex + 9,
    cellIndex + 10,
    cellIndex + 11,
  ];

  for (let index of adjacentIndices) {
    if (index >= 0 && index < 100 && board[index] === 'K') {
      return true;
    }
  }
  return false;
}

function markAdjacentCells(board: SeaBattlePlayerType[], cellIndex: number) {
  const adjacentIndices = [
    cellIndex - 11,
    cellIndex - 10,
    cellIndex - 9,
    cellIndex - 1,
    cellIndex + 1,
    cellIndex + 9,
    cellIndex + 10,
    cellIndex + 11,
  ];

  for (let index of adjacentIndices) {
    if (index >= 0 && index < 100 && board[index] === null) {
      board[index] = null;
    }
  }
}

export default function generateRandomShipsBoard() {
  const board = Array(100).fill(null);
  const shipSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

  for (let shipSize of shipSizes) {
    placeShip(board, shipSize);
  }

  return board;
}
