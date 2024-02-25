import { useEffect } from 'react';
import { Container } from '@chakra-ui/react';
import GamesSlider from '../components/GamesSlider';
import { useAppDispatch, useAppSelector } from '../redux';
import { startListening, userSelector } from '../redux/slices/userSlice';
import GamesPanel from '../components/GamesPanel';
import TicTacToe from '../components/TicTacToe';
import SeaBattle from '../components/SeaBattle';
import NameModal from '../components/NameModal';

function App() {
  const dispatch = useAppDispatch();
  const { session } = useAppSelector(userSelector);

  useEffect(() => {
    dispatch(startListening());
  }, []);

  return (
    <>
      <NameModal />
      <Container
        display="flex"
        flexDirection="column"
        justifyContent="center"
        h="100%"
        maxW="1280px"
        bg="blue.600"
        color="white"
      >
        {session ? (
          session.type === 'ttt' ? (
            <TicTacToe />
          ) : (
            <SeaBattle />
          )
        ) : (
          <>
            <GamesPanel />
            <GamesSlider />
          </>
        )}
      </Container>
    </>
  );
}

export default App;
