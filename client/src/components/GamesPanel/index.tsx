import { Button, Divider, Stack, useColorMode } from '@chakra-ui/react';
import TicTacToeStart from '../TicTacToeStart';
import SeaBattleStart from '../SeaBattleStart';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useEffect } from 'react';

function GamesPanel() {
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (colorMode === 'light') toggleColorMode();
  }, []);

  return (
    <Stack
      w="100%"
      direction="row"
      justifyContent="space-around"
      alignItems="center"
      gap={30}
    >
      <TicTacToeStart />
      <Divider orientation="vertical" h={100} color="black" />
      <Button onClick={() => toggleColorMode()}>
        {colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
      </Button>
      <Divider orientation="vertical" h={100} color="black" />
      <SeaBattleStart />
    </Stack>
  );
}

export default GamesPanel;
