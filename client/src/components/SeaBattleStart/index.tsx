import { useAppDispatch, useAppSelector } from '../../redux';
import { createSession, userSelector } from '../../redux/slices/userSlice';
import { Box, Button, Heading } from '@chakra-ui/react';

function SeaBattleStart() {
  const dispatch = useAppDispatch();
  const { name } = useAppSelector(userSelector);

  const createSeaBattleSessionHandle = () => {
    dispatch(createSession({ type: 'sea', name }));
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
