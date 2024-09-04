// src/app/layout.js
import { ChakraProvider } from '@chakra-ui/react';
import { UserProvider } from '../context/userContext';
import { ChatProvider } from '../context/chatContext';
import './globals.css'; // If you have global styles

export const metadata = {
  title: 'ChatterBox',
  description: 'My Messaging app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          <UserProvider>
            <ChatProvider>
              {children}
            </ChatProvider>
          </UserProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
