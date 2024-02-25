import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import SeaBattleIcon from '../../img/sea-battle.svg';
import TicTacToeIcon from '../../img/tic-tac-toe.svg';

import { useAppDispatch, useAppSelector } from '../../redux';
import {
  controllerSelector,
  joinSession,
} from '../../redux/slices/controllerSlice';

import { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { userSelector } from '../../redux/slices/userSlice';
import { TypeOfGame } from '../../redux/types';

function GamesSlider() {
  const dispatch = useAppDispatch();
  const { name } = useAppSelector(userSelector);
  const { sessions } = useAppSelector(controllerSelector);
  const [swiper, setSwiper] = useState<any>();

  const joinSessionHandle = (sessionId: string, type: TypeOfGame) => {
    dispatch(joinSession({ session: sessionId, name, type }));
  };

  useEffect(() => {
    if (swiper) {
      swiper.updateSlides();
    }
  }, [sessions]);

  return (
    <Box w="100%" marginY={sessions.length !== 0 ? '0' : 'auto'}>
      <Heading m="5" textAlign="center" as="h2">
        {sessions.length !== 0
          ? 'Choose a game you want'
          : "There aren't any games to play, create a new one"}
      </Heading>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={50}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        onSwiper={(swiper) => {
          setSwiper(swiper);
        }}
      >
        {sessions.map((session, ind) => (
          <SwiperSlide key={session.id}>
            <Card>
              <CardBody display="flex" flexDirection="column" gap={5}>
                <Stack
                  direction="row"
                  alignItems="flex-start"
                  justifyContent="space-between"
                >
                  <Stack direction="row" alignItems="center">
                    <Text>
                      {session.users[0].name} game #{ind + 1}
                    </Text>
                    {session.type === 'ttt' ? (
                      <Image
                        boxSize="20px"
                        src={TicTacToeIcon}
                        alt="Tic tac toe icon"
                      />
                    ) : (
                      <Image
                        boxSize="20px"
                        src={SeaBattleIcon}
                        alt="Sea battle icon"
                      />
                    )}
                  </Stack>
                  {session.users.length > 1 ? (
                    <Badge colorScheme="red">Game has started</Badge>
                  ) : (
                    <Badge colorScheme="green">Players: 1/2</Badge>
                  )}
                </Stack>
                <Button
                  isDisabled={session.users.length > 1}
                  w="100%"
                  onClick={() => joinSessionHandle(session.id, session.type)}
                >
                  Join
                </Button>
              </CardBody>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}

export default GamesSlider;
