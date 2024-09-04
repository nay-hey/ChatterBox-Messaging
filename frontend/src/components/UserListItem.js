'use client';
import { Flex, Box, Text, Avatar } from '@chakra-ui/react';

function UserListItem({ user, handleClick }) {
  return (
    <Flex
      mt='1'
      p='2'
      bg='gray.100'
      _hover={{
        background: 'gray.200',
      }}
      borderRadius='lg'
      cursor='pointer'
      onClick={handleClick}
      align='center' 
    >
      <Avatar
        mr={2}
        size='sm'
        cursor='pointer'
        name={user.name}
        src={user.avatar.url}
      />
      <Box>
        <Text fontSize='sm'>{user.name}</Text> 
        <Text fontSize='xs'>
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Flex>
  );
}

export default UserListItem;
