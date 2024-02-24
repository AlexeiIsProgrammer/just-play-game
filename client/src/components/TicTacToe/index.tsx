import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Heading,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../redux';
import { exitSession, userSelector } from '../../redux/slices/userSlice';
import {
  controllerSelector,
  makeMove,
  resetGame,
} from '../../redux/slices/controllerSlice';

import styles from './TicTacToe.module.scss';
import { PlayerType } from '../../redux/types';
import { useMemo } from 'react';

function TicTacToe() {
  const toast = useToast();

  const dispatch = useAppDispatch();

  const { player, session } = useAppSelector(userSelector);
  const { currentMove, winner, board } = useAppSelector(controllerSelector);

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
      title: `Player has reset the game`,
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
            : winner
              ? `Winner: ${winner}`
              : currentMove
                ? currentMove === player
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
