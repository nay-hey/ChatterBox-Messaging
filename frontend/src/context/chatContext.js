'use client'; 

import React, { useContext, useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useUserContext } from './userContext';
import axios from 'axios';

const ChatContext = React.createContext();

export const ChatProvider = ({ children }) => {
  const { currentUser } = useUserContext();
  const toast = useToast();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [notification, setNotification] = useState([]);
  const [fetchFlag, setFetchFlag] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const fetchUserChats = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/chat');
      const { data } = response.data;
      setChats(data);
      setError(null);
    } catch (error) {
      const { message } = error.response?.data || { message: 'An error occurred' };
      setError(message);
      toast({
        position: 'top',
        title: 'Error occurred',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (currentUser) {
      fetchUserChats(); 
    }
  }, [currentUser, fetchFlag]); 


  return (
    <ChatContext.Provider
    value={{
      chats,
      fetchFlag,
      notification,
      selectedChat,
      setChats,
      setFetchFlag,
      fetchUserChats,
      setNotification,
      setSelectedChat,
      loading,
      error,
    }}
  >
      {children}
    </ChatContext.Provider>
  );
};


export function useChatContext() {
  return useContext(ChatContext);
}