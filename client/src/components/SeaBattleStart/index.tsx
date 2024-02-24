import { useAppDispatch } from '../../redux';
import { createSession } from '../../redux/slices/userSlice';
import { Box, Button, Heading } from '@chakra-ui/react';

function SeaBattleStart() {
  const dispatch = useAppDispatch();

  const createSeaBattleSessionHandle = () => {
    dispatch(createSession('sea'));
  };

  return (
    <Box>
      <Heading mb={5} as="h3">
        Sea battle
      </Heading>
      <Button w="100%" onClick={createSeaBattleSessionHandle}>
        Create a game
      </Button>
    </Box>
  );
}

export default SeaBattleStart;
