import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  List,
  ListItem,
  Text,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../redux';
import {
  controllerSelector,
  joinSession,
} from '../../redux/slices/controllerSlice';

function GamesSlider() {
  const dispatch = useAppDispatch();
  const { sessions } = useAppSelector(controllerSelector);

  const joinSessionHandle = (sessionId: string) => {
    dispatch(joinSession(sessionId));
  };

  return (
    <Box>
      <Heading as="h2">Join game:</Heading>
      <List>
        {sessions
          .filter((session) => session.users.length < 2)
          .map((session) => (
            <ListItem key={session.id}>
              <Card>
                <CardBody>
                  <Text>Game has started.</Text>
                  <Button onClick={() => joinSessionHandle(session.id)}>
                    Join {session.id}
                  </Button>
                </CardBody>
              </Card>
            </ListItem>
          ))}
      </List>
    </Box>
  );
}

export default GamesSlider;
