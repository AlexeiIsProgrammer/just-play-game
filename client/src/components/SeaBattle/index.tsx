import { Box, Button, Center, Stack, Text, useToast } from '@chakra-ui/react';
import SeaBattleBoard from '../SeaBattleBoard';
import { useAppDispatch, useAppSelector } from '../../redux';
import {
  placeShips,
  seaBattleSelector,
  setIsReady,
} from '../../redux/slices/seaBattleSlice';
import getRandomShipsBoard from '../../utils/getRandomShipsBoard';
import { exitSession, userSelector } from '../../redux/slices/userSlice';
import { useEffect } from 'react';

function SeaBattle() {
  const toast = useToast();
  const dispatch = useAppDispatch();
  const {
    isReady,
    board,
    opponentBoard,
    startGame,
    winner,
    player,
    currentMove,
  } = useAppSelector(seaBattleSelector);
  const { session } = useAppSelector(userSelector);

  const generateRandomShips = () => {
    dispatch(placeShips(getRandomShipsBoard()));
  };

  const readyHandle = () => {
    if (session)
      dispatch(setIsReady({ isReady: true, session: session.id, board }));
  };

  const exitGameHandle = () => {
    dispatch(exitSession());
  };

  useEffect(() => {
    if (!winner) return;

    toast({
      position: 'top',
      title: winner === player ? `You won the game!` : `You lose the game!`,
      status: winner === player ? 'success' : 'error',
    });
  }, [winner]);

  useEffect(() => {
    if (!currentMove) return;

    if (currentMove === player && startGame) {
      toast({
        position: 'top',
        title: 'Your move!',
        status: 'info',
      });
    }
  }, [currentMove, startGame]);

  return (
    <Center>
      <Box>
        <Stack direction="row">
          <Box>
            {startGame && <Text textAlign="center">You</Text>}
            <SeaBattleBoard myBoard board={board} />
          </Box>

          {startGame && (
            <Box>
              <Text textAlign="center">Opponent</Text>
              <SeaBattleBoard board={opponentBoard} />
            </Box>
          )}
        </Stack>
        <Stack direction="row">
          {!isReady && (
            <Button w="100%" onClick={generateRandomShips}>
              Generate
            </Button>
          )}
          {!startGame && board.some((cell) => cell !== null) && (
            <Button
              isDisabled={isReady}
              colorScheme={isReady ? 'green' : 'blue'}
              w="100%"
              onClick={readyHandle}
            >
              {isReady ? 'Waiting for the opponent' : 'Ready'}
            </Button>
          )}
          {winner && (
            <Button w="100%" onClick={exitGameHandle}>
              Exit
            </Button>
          )}
        </Stack>
      </Box>
    </Center>
  );
}

export default SeaBattle;
