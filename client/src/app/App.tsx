import { useEffect } from 'react';
import styles from './App.module.scss';
import { Button, Container, Stack } from '@chakra-ui/react';
import GamesSlider from '../components/GamesSlider';
import { useAppDispatch, useAppSelector } from '../redux';
import {
  createSession,
  startListening,
  userSelector,
} from '../redux/slices/userSlice';
import {
  controllerSelector,
  makeMove,
  resetGame,
} from '../redux/slices/controllerSlice';

function App() {
  const dispatch = useAppDispatch();
  const { session, player } = useAppSelector(userSelector);
  const { winner, currentMove, board } = useAppSelector(controllerSelector);

  useEffect(() => {
    dispatch(startListening());
  }, []);

  const createSessionHandle = () => {
    dispatch(createSession());
  };

  const makeMoveHandle = (ind: number) => {
    if (
      board[ind] === null &&
      session &&
      session.users.length > 1 &&
      !winner &&
      currentMove === player
    ) {
      dispatch(makeMove({ session, board, ind, currentMove }));
    }
  };

  const resetGameHandle = () => {
    dispatch(resetGame(session?.id || ''));
  };
  console.log(session);

  return (
    <Container centerContent maxW="2xl" bg="blue.600" color="white">
      <h1>Tic Tac Toe</h1>
      {session ? (
        <>
          <div className={styles.board}>
            {board.map((cell, ind) => (
              <div
                key={ind}
                className={styles.cell}
                onClick={() => makeMoveHandle(ind)}
              >
                {cell}
              </div>
            ))}
          </div>
          <div className="status">
            {winner
              ? `Winner: ${winner}`
              : currentMove
                ? `Next Player: ${currentMove}`
                : ''}
          </div>
          <Stack spacing={4} direction="row" align="center">
            <Button onClick={resetGameHandle}>Reset Game</Button>
          </Stack>
        </>
      ) : (
        <>
          <h2>Create or Join a Session</h2>
          <Button onClick={() => createSessionHandle()}>Create Session</Button>
          <div>
            <GamesSlider />
          </div>
        </>
      )}
    </Container>
  );
}

export default App;
