import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setName } from '../../redux/slices/userSlice';

function NameModal() {
  const dispatch = useDispatch();
  const [value, setValue] = useState<string>('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    onOpen();
  }, []);

  const onSaveHandle = () => {
    if (value !== '') {
      dispatch(setName(value));
      onClose();
    } else {
      toast({
        position: 'top-left',
        title: `You didn't write your name!`,
        status: 'error',
        isClosable: true,
      });
    }
  };

  const changeHandle = (e) => setValue(e.target.value);

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Write your name</ModalHeader>
        <ModalBody pb={3}>
          <Input
            value={value}
            onChange={changeHandle}
            placeholder="John Lennon"
            size="lg"
          />
        </ModalBody>

        <ModalFooter>
          <Button onClick={() => onSaveHandle()} colorScheme="blue" w="100%">
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default NameModal;
