'use client';
import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { isSameSender, isSameUser, isLastMessage } from '../utils/helpers';
import { useUserContext } from '../context/userContext';
import { Avatar, Box, Flex, HStack, Text, Tooltip, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { MdArrowDropDown } from 'react-icons/md';

function ScrollableChat({ messages, handleDelete }) {
  const { currentUser } = useUserContext();

  return (
    <ScrollableFeed>
      {messages.map((message, index) => {
        const isCurrentUser = message.sender._id === currentUser.id;
        return (
          <Flex
            key={index}
            px={{ base: '1rem', md: '4rem' }}
            mb={`${index === messages.length - 1 ? '6' : '0'}`}
            mt={`${
              index === 0
                ? '6'
                : isSameUser(messages, message, index)
                ? '1'
                : '6'
            }`}
            justifyContent={isCurrentUser ? 'flex-end' : 'flex-start'}
            alignItems='center'
          >
            {(isSameSender(messages, message, index, currentUser.id) ||
              isLastMessage(messages, index, currentUser.id)) && (
              <Tooltip label={message.sender.name}>
                <Avatar
                  size='sm'
                  cursor='pointer'
                  name={message.sender.name}
                  src={message.sender.avatar.url}
                />
              </Tooltip>
            )}
            <HStack
              p='2'
              maxW='50%'
              ml={`${
                isCurrentUser
                  ? '0'
                  : isSameSender(messages, message, index, currentUser.id) ||
                    isLastMessage(messages, index, currentUser.id)
                  ? '1'
                  : '36px'
              }`}
              bg={isCurrentUser ? 'green.500' : 'gray'}
              borderRadius='md'
              shadow='base'
              position='relative'
            >
              <Text color={isCurrentUser ? 'white' : 'white'}>{message.content}</Text>
              <Text alignSelf='flex-end' fontSize='0.75rem' color={isCurrentUser ? 'white' : 'white'}>
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  hour12: true,
                  minute: '2-digit',
                })}
              </Text>
              {isCurrentUser && (
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<MdArrowDropDown />}
                    size='xs'
                    colorScheme='gray'
                    variant='ghost'
                    position='absolute'
                    top='-2'
                    right='-2'
                    zIndex='docked'
                  />
                  <MenuList
                      minWidth='unset'
                      p='0'
                      borderRadius='md'
                      boxShadow='md'
                      zIndex='popover'
                    >
                    <MenuItem
                      onClick={() => handleDelete(message._id)}
                    >
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              )}
            </HStack>
          </Flex>
        );
      })}
    </ScrollableFeed>
  );
}

export default ScrollableChat;
