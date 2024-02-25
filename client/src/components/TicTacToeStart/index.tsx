import { Box, Button, Heading } from '@chakra-ui/react';
import { createSession, userSelector } from '../../redux/slices/userSlice';
import { useAppDispatch, useAppSelector } from '../../redux';

function TicTacToeStart() {
  const { name } = useAppSelector(userSelector);
  const dispatch = useAppDispatch();

  const createTicTacToeSessionHandle = () => {
    dispatch(createSession({ type: 'ttt', name }));
  };

  return (
    <Box>
      <Heading mb={5} as="h3">
        Tic Tac Toe
      </Heading>
      <Button w="100%" onClick={() => createTicTacToeSessionHandle()}>
        Create a game
      </Button>
    </Box>
  );
}

export default TicTacToeStart;
