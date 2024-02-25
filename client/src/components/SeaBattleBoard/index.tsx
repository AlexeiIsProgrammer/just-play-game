import { useAppDispatch, useAppSelector } from '../../redux';
import { makeMove, seaBattleSelector } from '../../redux/slices/seaBattleSlice';
import { userSelector } from '../../redux/slices/userSlice';
import { SeaBattlePlayerType } from '../../redux/types';
import styles from './SeaBattleBoard.module.scss';

type SeaBattleBoardType = {
  board: SeaBattlePlayerType[];
  myBoard?: boolean;
};

function SeaBattleBoard({ board, myBoard }: SeaBattleBoardType) {
  const dispatch = useAppDispatch();
  const { session } = useAppSelector(userSelector);
  const { winner, currentMove, player } = useAppSelector(seaBattleSelector);

  const makeMoveHandle = (ind: number) => {
    if (
      !myBoard &&
      board[ind] === null &&
      session &&
      session.users.length > 1 &&
      !winner &&
      currentMove === player
    ) {
      dispatch(makeMove({ session, ind, currentMove }));
    }
  };

  const rows = [];
  for (let row = 0; row < 10; row++) {
    const cells = [];
    for (let col = 0; col < 10; col++) {
      const index = row * 10 + col;

      const cellContent =
        board[index] === 'K'
          ? '⬜'
          : board[index] === 'X'
            ? '❌'
            : board[index] === 'O'
              ? '⛆'
              : '';

      cells.push(
        <td
          key={index}
          onClick={() => makeMoveHandle(index)}
          className={[
            styles.cell,
            cellContent !== '' || myBoard ? styles.disabled : '',
          ].join(' ')}
        >
          {cellContent}
        </td>
      );
    }
    rows.push(cells);
  }

  const columnHeaders = [];
  for (let col = 0; col < 10; col++) {
    columnHeaders.push(
      <th key={`col-${col}`} className={styles['col-header']}>
        {String.fromCharCode(65 + col)}
      </th>
    );
  }

  const rowHeaders: JSX.Element[] = [];
  for (let row = 0; row < 10; row++) {
    rowHeaders.push(
      <th key={`row-${row}`} className={styles['row-header']}>
        {row + 1}
      </th>
    );
  }

  return (
    <table className={styles['sea-battle-board']}>
      <thead>
        <tr>
          <th></th>
          {columnHeaders}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {rowHeaders[index]}
            {row}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SeaBattleBoard;
