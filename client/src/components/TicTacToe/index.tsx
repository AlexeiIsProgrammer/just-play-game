import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Button, Center, Heading, Stack, useToast } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../redux';
import { exitSession, userSelector } from '../../redux/slices/userSlice';

import styles from './TicTacToe.module.scss';
import { PlayerType } from '../../redux/types';
import { useEffect, useMemo } from 'react';
import {
  makeMove,
  resetGame,
  ticTacToeSelector,
} from '../../redux/slices/ticTacToeSlice';

function TicTacToe() {
  const toast = useToast();

  const dispatch = useAppDispatch();

  const { session } = useAppSelector(userSelector);
  const { player, currentMove, winner, board } =
    useAppSelector(ticTacToeSelector);

  useEffect(() => {
    if (!winner) return;

    toast({
      position: 'top',
      title: winner === player ? `You won the game!` : `You lose the game!`,
      status: winner === player ? 'success' : 'error',
    });
  }, [winner]);

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

  const shouldBeGameResetted = useMemo(
    () => board.filter((cell) => cell === null).length !== board.length,
    [board]
  );

  const resetGameHandle = () => {
    dispatch(resetGame(session?.id || ''));
    toast({
      position: 'top',
      title: `Game has been resetted`,
      status: 'info',
      isClosable: true,
    });
  };

  const exitGameHandle = () => {
    dispatch(exitSession());
  };

  const getUserIcon = (type: PlayerType) =>
    type === 'X' ? <SunIcon /> : type === 'O' && <MoonIcon />;

  return (
    <Center>
      <Stack alignItems="center">
        <Heading textAlign="center">You are {getUserIcon(player)}!</Heading>
        <div className={styles.board}>
          {board.map((cell, ind) => (
            <div
              key={ind}
              className={[
                styles.cell,
                cell ? styles.clicked : '',
                cell === 'O' ? styles.o : cell === 'X' ? styles.x : '',
              ].join(' ')}
              onClick={() => makeMoveHandle(ind)}
            >
              {getUserIcon(cell)}
            </div>
          ))}
        </div>
        <Heading as="h5" textAlign="center">
          {session && session.users.length < 2
            ? 'Waiting for the second player..'
            : currentMove
              ? winner
                ? ''
                : currentMove === player
                  ? 'Your move'
                  : "Opponent's move"
              : ''}
        </Heading>
        <Stack spacing={4} direction="column" align="center">
          {shouldBeGameResetted && (
            <Button w={'100%'} onClick={resetGameHandle}>
              Reset Game
            </Button>
          )}
          <Button w={'100%'} onClick={exitGameHandle}>
            Exit game
          </Button>
        </Stack>
      </Stack>
    </Center>
  );
}

export default TicTacToe;
