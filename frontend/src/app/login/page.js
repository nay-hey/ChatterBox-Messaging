'use client';

import React, { useEffect } from 'react';
import { Login, Register } from '../../components';
import {
  Box,
  Container,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';

function Homepage() {

  useEffect(() => {
    document.title = 'Login/Register';
  }, []);

  return (
    <Box
      bgImage="url('/static/wallpaper.jpg')" // Corrected path
      bgSize="cover"
      bgPosition="center"
      minH="100vh" 
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container maxWidth='xl' mb='8'>
        <Box p='4' borderRadius='md' shadow='md' bg='whiteAlpha.900'>
          <Tabs variant='soft-rounded' colorScheme='blue' isFitted>
            <TabList mb='1'>
              <Tab>Login</Tab>
              <Tab>Register</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Register />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </Box>
  );
}

export default Homepage;
