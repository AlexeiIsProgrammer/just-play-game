import { Divider, Stack } from '@chakra-ui/react';
import TicTacToeStart from '../TicTacToeStart';
import SeaBattleStart from '../SeaBattleStart';

function GamesPanel() {
  return (
    <Stack w="100%" direction="row" justifyContent="space-around" gap={30}>
      <TicTacToeStart />
      <Divider orientation="vertical" h={100} color="black" />
      <SeaBattleStart />
    </Stack>
  );
}

export default GamesPanel;
