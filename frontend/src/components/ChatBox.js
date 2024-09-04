'use client';
import React from 'react';
import { SingleChat } from '.';
import { Box } from '@chakra-ui/react';

function ChatBox() {
  return (
    <Box w='100%' h='100%'>
      <SingleChat />
    </Box>
  );
}

export default ChatBox;
