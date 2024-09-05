'use client';
import { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import axios from 'axios';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    Stack,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    IconButton,
    Button,
    useToast,
    FormControl,
    FormLabel,
    FormHelperText,
    Input,
    VStack,
    HStack,
    Text,
    Box,
    Flex,
    useColorMode,
  } from '@chakra-ui/react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const backgroundColor = colorMode === 'light' ? 'white' : '#1E201E';

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(message);
    if (!message.trim()) return;

    setChat((prevChat) => [...prevChat, { type: 'user', text: message }]);

    try {
      const response = await axios.post('/api/chat', { message });
      const botReply = response.data.reply;

      setChat((prevChat) => [...prevChat, { type: 'bot', text: botReply }]);
    } catch (error) {
      console.error('Error communicating with bot:', error);
      toast({
        position: 'top',
        title: 'Error occurred',
        description: 'Sorry, something went wrong.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setChat((prevChat) => [...prevChat, { type: 'bot', text: 'Sorry, something went wrong.' }]);
    }

    setMessage('');
  };

  return (
    <>
      <Button
        onClick={onOpen}
        variant="outline"
        colorScheme="white"
        borderRadius="md"
        boxShadow="md"
        p={4}
        w="full"
        justifyContent="flex-start"
        _hover={{ bg: '#3C3D37' }}
        _active={{ bg: '#3C3D37' }}
        _focus={{ boxShadow: 'outline' }}
      >
        <HStack spacing={3}>
          <IconButton
            icon={<AiOutlinePlus />}
            fontSize="2xl"
            color="white"
            variant="unstyled"
            bg="transparent"
          />
          <Text fontSize="md" fontWeight="semibold" color="white">
            Chat with Gemini
          </Text>
        </HStack>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Box
              border="1px solid"
              borderColor="gray.300"
              borderRadius="md"
              p="4"
              minH="300px"
              maxH="300px" 
              mb="4"
              bg={backgroundColor}
              overflowY="auto" 
            >
              <Stack spacing="4">
                {chat.map((msg, index) => (
                  <Flex key={index} justify={msg.type === 'user' ? 'flex-end' : 'flex-start'}>
                    <Box
                      p="2"
                      borderRadius="md"
                      bg={msg.type === 'user' ? 'green.500' : '#1E201E'}
                      maxW="60%"
                      textAlign={msg.type === 'user' ? 'right' : 'left'}
                    >
                      <Text fontWeight="bold" color={msg.type === 'user' ? 'white' : 'black'}>{msg.type === 'user' ? 'You' : 'Bot'}:</Text>
                      <Text color={msg.type === 'user' ? 'white' : 'black'}>{msg.text}</Text>
                    </Box>
                  </Flex>
                ))}
              </Stack>
            </Box>
            <form onSubmit={handleSubmit}>
              <FormControl>
                <FormLabel htmlFor="message">Type your message</FormLabel>
                <Input
                  id="message"
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  variant="filled"
                  mb="4"
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="green"
                borderRadius="md"
                px="4"
                py="2"
                width="full"
              >
                Send
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
