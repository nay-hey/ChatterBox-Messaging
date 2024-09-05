'use client';
import React, { useEffect } from 'react';
import { useChatContext } from '../context/chatContext';
import { useUserContext } from '../context/userContext';
import { getSender, getSendersFullDetails } from '../utils/helpers';
import { Box, VStack, Text, Divider, Avatar, HStack, Spinner, Button } from '@chakra-ui/react';
import { GroupChatModal, Chat } from '.';
import { useRouter } from 'next/router';
function UsersChat() {
  const { currentUser } = useUserContext();
  const { chats, selectedChat, setSelectedChat, fetchFlag, fetchUserChats, loading, error } =
    useChatContext();
    
  useEffect(() => {
    fetchUserChats();
  }, [fetchFlag, currentUser]);
  
  if (loading) {
    return (
      <Box
        w='100%'
        h='100%'
        flexDirection='column'
        alignItems='center'
        p='2'
        bg='white'
        overflowY='scroll'
        display='flex'
        justifyContent='center'
      >
        <Spinner size='xl' />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        w='100%'
        h='100%'
        flexDirection='column'
        alignItems='center'
        p='2'
        bg='#2f2f2f'
        overflowY='scroll'
        display='flex'
        justifyContent='center'
        borderRadius='md'
      >
        <Text color='red.500'>Error fetching chats. Please try again later.</Text>
      </Box>
    );
  }

  return (
    <Box
      w='100%'
      h='100%'
      flexDirection='column'
      alignItems='center'
      p='2'
      bg='#697565'
      overflowY='scroll'
      borderRadius='md'
    >
      
      <VStack w='100%' spacing='1'>
        <GroupChatModal />
        <Chat />
        {chats.map((chat, index) => {
          const isImageUrl = (url) => {
            return url.match(/\.(jpeg|jpg|gif|png|webp)$/) != null;
          };

          return (
            <Box key={index} w="100%">
              <HStack
                w="100%"
                m="0"
                py="4"
                px="2"
                spacing="2"
                bg={selectedChat?._id === chat._id ? "#1E201E" : "transparent"}
                _hover={{ background: "#21241f" }}
                onClick={() => setSelectedChat(chat)}
              >
                <Avatar
                  name={
                    !chat.isGroupChat
                      ? getSender(currentUser, chat.users)
                      : chat.chatName
                  }
                  src={
                    !chat.isGroupChat
                      ? getSendersFullDetails(currentUser, chat.users).avatar.url
                      : ""
                  }
                />
                <VStack
                  w="100%"
                  spacing="0"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <HStack w="100%" justifyContent="space-between" fontSize="1.125rem">
                    <Text color="white">
                      {!chat.isGroupChat
                        ? getSender(currentUser, chat.users)
                        : chat.chatName}
                    </Text>
                    {chat.latestMessage && (
                      <Text fontSize="xs" color="white">
                        {new Date(chat.latestMessage.createdAt).toLocaleDateString()}
                      </Text>
                    )}
                  </HStack>
                  {chat.latestMessage && (
                    <>
                      <Text color="white">
                        {chat.latestMessage.sender.name}:{' '}
                        {isImageUrl(chat.latestMessage.content) ? (
                          "📷 Photo"  
                        ) : chat.latestMessage.content.length > 50 ? (
                          chat.latestMessage.content.substring(0, 51) + "..."
                        ) : (
                          chat.latestMessage.content
                        )}
                      </Text>
                    </>
                  )}
                </VStack>
              </HStack>
              <Divider />
            </Box>
          );
        })}

        </VStack>
    </Box>
  );
}

export default UsersChat;
