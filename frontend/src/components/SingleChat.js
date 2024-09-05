'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useChatContext } from '../context/chatContext';
import { IoArrowBackOutline } from 'react-icons/io5';
import { getSender, getSendersFullDetails } from '../utils/helpers';
import { useUserContext } from '../context/userContext';
import axios from 'axios';
import io from 'socket.io-client';
import {
  ProfileModal,
  SpinnerLoader,
  UpdateGroupChatModal,
  ScrollableChat,
} from '.';
import {
  Box,
  IconButton,
  Flex,
  Text,
  FormControl,
  useToast,
  VStack,
  Avatar,
  HStack,
  Input,
  useColorMode,
} from '@chakra-ui/react';

let socket;
let selectedChatBackup;
let timeout;

function SingleChat() {
  const { colorMode } = useColorMode();

  const backgroundColor = colorMode === 'light' ? 'white' : '#3C3D37';

  const { currentUser } = useUserContext();
  const {
    chats,
    selectedChat,
    notification,
    setSelectedChat,
    setNotification,
    setFetchFlag,
  } = useChatContext();
  const [socketConnected, setSocketConnected] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/message/${selectedChat._id}`);
      const { data } = response.data;
      setMessages(data);
      setLoading(false);
      socket.emit('join_room', {
        room: selectedChat._id,
        users: selectedChat.users,
      });
      scrollToBottom();
    } catch (error) {
      const { message } = error.response.data;
      setLoading(false);
      return toast({
        position: 'top',
        title: 'Error occurred',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        sendImageMessage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };
  const sendImageMessage = async (base64Image) => {
    try {
      const body = {
        chatId: selectedChat._id,
        image: base64Image,
      };
      const response = await axios.post('http://localhost:5000/api/message', body);
      const { data } = response.data;
      socket.emit('new_message', data);
      setMessages((prev) => [...prev, data]);
      scrollToBottom();
    } catch (error) {
      toast({
        position: 'top',
        title: 'Error occurred',
        description: error.response?.data?.message || 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const sendMessage = async (e) => {
    if (e.key === 'Enter' && newMessage) {
      try {
        const body = {
          chatId: selectedChat._id,
          content: newMessage,
        };
        setNewMessage('');
        const response = await axios.post('http://localhost:5000/api/message', body);
        const { data } = response.data;
        socket.emit('new_message', data);
        socket.emit('stop_typing', selectedChat._id);
        setMessages((prev) => [...prev, data]);
        scrollToBottom();
      } catch (error) {
        const { message } = error.response.data;
        return toast({
          position: 'top',
          title: 'Error occurred',
          description: message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) {
      return;
    }
    setTyping(true);
    socket.emit('typing', selectedChat._id);
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      setTyping(false);
      socket.emit('stop_typing', selectedChat._id);
    }, 3000);
  };

  const handleDelete = async (messageId) => {
    try {
      await axios.delete(`http://localhost:5000/api/message/${messageId}`);
      fetchMessages();
      toast({
        position: 'top',
        title: 'Message deleted',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        position: 'top',
        title: 'Error deleting message',
        description: error.response?.data?.message || 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    socket = io('http://localhost:5000');
    socket.emit('setup', currentUser);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('user_online_status', (online) => setOnlineStatus(online));
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop_typing', () => setIsTyping(false));
    socket.on('new_message_received', (message) => {
      if (!selectedChatBackup || selectedChatBackup._id !== message.chat._id) {
        if (!notification.includes(message)) {
          setNotification((prev) => [message, ...prev]);
          setFetchFlag((prev) => !prev);
        }
      } else {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser, notification, selectedChat, setNotification, setFetchFlag]);

  useEffect(() => {
    if (selectedChatBackup) {
      socket.emit('leave_room', selectedChatBackup._id);
    }
    fetchMessages();
    selectedChatBackup = selectedChat;
    setTyping(false);
    setIsTyping(false);
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Flex flexDirection="column" w="100%" h="80vh" bg={backgroundColor}>
      {selectedChat ? (
        <>
          <Flex
            p="4"
            bg="#1E201E"
            justifyContent="space-between"
            alignItems="center"
            shadow="sm"
          >
            <IconButton
              icon={<IoArrowBackOutline />}
              display={{ base: 'flex', md: 'none', color: 'white' }}
              bg="transparent"
              color="white"
              _hover="transparent"
              onClick={() => setSelectedChat(null)}
            />
            {!selectedChat.isGroupChat ? (
              <>
                <HStack 
                  spacing="4" 
                  justifyContent="center" 
                  alignItems="center" 
                  w="100%" 
                  h="100%" 
                >
                  <Avatar
                    size="md"
                    name={getSender(currentUser, selectedChat.users)}
                    src={getSendersFullDetails(currentUser, selectedChat.users).avatar.url}
                  />
                  <VStack spacing="0" alignItems="flex-start">
                    <Text color='white'>{getSender(currentUser, selectedChat.users)}</Text>
                    <Text fontSize="sm" color="gray.400">
                      {onlineStatus ? (isTyping ? 'typing...' : 'online') : 'offline'}
                    </Text>
                  </VStack>
                </HStack>
                <ProfileModal
                  user={getSendersFullDetails(currentUser, selectedChat.users)}
                />
              </>
            ) : (
              <>
                <HStack spacing="4">
                  <Avatar size="md" name={selectedChat.chatName} />
                  <VStack spacing="0" alignItems="flex-start">
                    <Text color='white'>{selectedChat.chatName.toUpperCase()}</Text>
                    {isTyping && (
                      <Text fontSize="sm" color="gray.400">
                        typing...
                      </Text>
                    )}
                  </VStack>
                </HStack>
                <UpdateGroupChatModal fetchMessages={fetchMessages} />
              </>
            )}
          </Flex>

          {/* Messages Area */}
          <Flex
            flexDirection="column"
            flex="1"
            overflowY="auto"
            p="4"
            justifyContent="flex-end"
          >
            {loading ? (
              <SpinnerLoader size="xl" margin="auto" alignSelf="center" />
            ) : (
              <ScrollableChat messages={messages} handleDelete={handleDelete} />
            )}
            <div ref={messagesEndRef} />
          </Flex>

          <Box py="2" px="4" bg="#1E201E" borderTop="1px solid" borderColor="gray.200">
            <FormControl onKeyDown={sendMessage} isRequired>
              <Input
                bg="#1E201E"
                color="white"
                focusBorderColor="none"
                borderRadius="full"
                placeholder="Write your message"
                value={newMessage}
                onChange={handleTyping}
              />
              
              <Box mt="2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload} 
                  bg="#1E201E"
                  color="white"
                  borderRadius="full"
                />
              </Box>
            </FormControl>
          </Box>
        </>
      ) : (
        <Flex
          w="100%"
          h="100%"
          bg={backgroundColor}
          flexDirection="column"
          justifyContent="space-between"
          alignItems="center"
          overflowY="hidden"
          borderRadius='md'
        >
          <VStack
            w="80%"
            m="auto"
            spacing="4"
            justifyContent="center"
            alignItems="center"
          >
            <Text textAlign="center" fontSize="3xl" fontWeight="300">
              ChatterBox
            </Text>
            <Text textAlign="center" fontWeight="300" color="gray.400">
              Start chattering with ChatterBox
            </Text>
          </VStack>
          <Box w="100%" h="10px" alignSelf="flex-end" bg="white"></Box>
        </Flex>
      )}
    </Flex>
  );
}

export default SingleChat;
