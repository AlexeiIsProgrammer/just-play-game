import { Box, Button, Heading } from '@chakra-ui/react';
import { createSession } from '../../redux/slices/userSlice';
import { useAppDispatch } from '../../redux';

function TicTacToeStart() {
  const dispatch = useAppDispatch();

  const createTicTacToeSessionHandle = () => {
    dispatch(createSession('ttt'));
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
