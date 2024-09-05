'use client';
import React, { useState, useEffect } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { useUserContext } from '../context/userContext';
import { getLocalStorage } from '../utils/helpers';
import { UserListItem, UserBadgeItem, SkeletonLoader } from '.';
import axios from 'axios';
import {
  Modal,
  ModalOverlay,
  ModalContent,
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
  Text,
  Box,
  HStack,
  Flex,
} from '@chakra-ui/react';
import { useChatContext } from '../context/chatContext';

axios.defaults.headers.common['Authorization'] = `Bearer ${getLocalStorage(
  'token'
)}`;

function UpdateGroupChatModal({ fetchMessages }) {
  const { currentUser } = useUserContext();
  const { selectedChat, setSelectedChat, setFetchFlag } = useChatContext();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (selectedChat) {
      setGroupChatName(selectedChat.chatName);
    }
  }, [selectedChat]);

  const handleSearch = async (query) => {
    setSearchText(query);
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/user?search=${query}`);
      const { data } = response.data;
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      return toast({
        position: 'top',
        title: 'Error occured',
        description: 'Failed to load search result',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAdd = async (userToBeAdded) => {
    if (selectedChat?.users.find((user) => user._id === userToBeAdded._id)) {
      return toast({
        position: 'top',
        title: 'Warning',
        description: 'User already added',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }
    if (selectedChat?.groupAdmin._id !== currentUser.id) {
      return toast({
        position: 'top',
        title: 'Warning',
        description: 'Only admin can add/remove users',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }
    try {
      setLoading(true);
      const body = {
        chatId: selectedChat._id,
        userId: userToBeAdded._id,
      };
      const response = await axios.post('http://localhost:5000/api/chat/groupadd', body);
      const { data } = response.data;
      setSelectedChat(data);
      setFetchFlag((prev) => !prev);
      setLoading(false);
    } catch (error) {
      const { message } = error.response.data;
      setLoading(false);
      return toast({
        position: 'top',
        title: 'Error occured',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRemove = async (userToBeRemoved) => {
    if (selectedChat?.groupAdmin._id !== currentUser.id) {
      return toast({
        position: 'top',
        title: 'Warning',
        description: 'Only admin can add/remove users',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }
    try {
      setLoading(true);
      const body = {
        chatId: selectedChat._id,
        userId: userToBeRemoved._id,
      };
      const response = await axios.post('http://localhost:5000/api/chat/groupremove', body);
      const { data } = response.data;
      setSelectedChat(data);
      setFetchFlag((prev) => !prev);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      const { message } = error.response.data;
      setLoading(false);
      return toast({
        position: 'top',
        title: 'Error occured',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRename = async () => {
    if (selectedChat?.groupAdmin._id !== currentUser.id) {
      return toast({
        position: 'top',
        title: 'Warning',
        description: 'Only admin can rename group',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }
    if (!groupChatName) {
      return toast({
        position: 'top',
        title: 'Warning',
        description: 'Please write a group name',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }
    try {
      const body = {
        chatId: selectedChat._id,
        chatName: groupChatName,
      };
      setRenameLoading(true);
      const response = await axios.post('http://localhost:5000/api/chat/grouprename', body);
      const { data } = response.data;
      setSelectedChat(data);
      setFetchFlag((prev) => !prev);
      setRenameLoading(false);
      return toast({
        position: 'top',
        title: 'Success',
        description: `Group chat name updated to ${data.chatName}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      const { message } = error.response.data;
      setRenameLoading(false);
      return toast({
        position: 'top',
        title: 'Error occured',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setLeaveLoading(true);
      const body = {
        chatId: selectedChat._id,
        userId: currentUser.id,
      };
      const response = await axios.post('http://localhost:5000/api/chat/groupremove', body);
      const { data } = response.data;
      setFetchFlag((prev) => !prev);
      setLeaveLoading(false);
      toast({
        position: 'top',
        title: 'Success',
        description: `You left ${data.chatName}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setSelectedChat(null);
    } catch (error) {
      const { message } = error.response.data;
      setLeaveLoading(false);
      return toast({
        position: 'top',
        title: 'Error occured',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {selectedChat && (
        <IconButton
          icon={<BsThreeDots />}
          colorScheme='gray'
          variant='ghost'
          _hover="transparent"
          color='white'
          onClick={onOpen}
        />
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat?.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <FormControl>
                <FormLabel>Group name</FormLabel>
                <HStack>
                  <Input
                    placeholder='Group name'
                    variant='filled'
                    focusBorderColor='orange.500'
                    value={groupChatName}
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />
                  <Button
                    isLoading={renameLoading}
                    colorScheme='green'
                    onClick={handleRename}
                  >
                    Update
                  </Button>
                </HStack>
              </FormControl>
              <FormControl>
                <FormLabel>Group users</FormLabel>
                <Input
                  placeholder='Search users'
                  variant='filled'
                  focusBorderColor='orange.500'
                  value={searchText}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <FormHelperText>Eg: Varun, Tarun</FormHelperText>
              </FormControl>
              {loading ? (
                <SkeletonLoader count={5} />
              ) : (
                searchResult.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAdd(user)}
                  />
                ))
              )}
              <Box>
                <HStack>
                  {selectedChat?.users.map((user) => (
                    <UserBadgeItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleRemove(user)}
                    />
                  ))}
                </HStack>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button isLoading={leaveLoading} colorScheme='green' onClick={handleSubmit}>
              Leave group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateGroupChatModal;
