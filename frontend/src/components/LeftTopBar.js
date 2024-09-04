'use client';
import React from 'react';
import { AiOutlineSearch, AiFillBell } from 'react-icons/ai';
import { useUserContext } from '../context/userContext';
import { useChatContext } from '../context/chatContext';
import { Dropdown, DropdownButton, Badge, Image } from 'react-bootstrap';
import { ProfileModal, SearchUserSideDrawer, Header, ImageVision } from '.';
import { getSender } from '../utils/helpers';
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';
import { useColorMode, IconButton, useColorModeValue } from '@chakra-ui/react';
import { BsSun, BsMoon } from 'react-icons/bs';

import {
  Button,
  Tooltip,
  Text,
  Flex,
  Menu,
  VStack,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  Icon,
} from '@chakra-ui/react';

function LeftTopBar() {
  const { currentUser, logout } = useUserContext();
  const { notification, setNotification, setSelectedChat } = useChatContext();
  const { colorMode, toggleColorMode } = useColorMode(); 

  const handleClickNotification = (item) => {
    setSelectedChat(item.chat);
    setNotification((prev) => {
      return prev.filter((n) => n !== item);
    });
  };

  return (
      <div>
      <nav className="header-nav ms-auto">
        <ul className="d-flex align-items-center list-unstyled m-4">
          <li className="nav-item dropdown">
            <DropdownButton
              menuAlign="right"
              title={
                <span className="nav-link nav-profile d-flex align-items-center pe-0">
                  <Avatar
                  size='sm'
                  cursor='pointer'
                  name={currentUser.name}
                  src={currentUser.avatar.url}
                />
                  <span className="d-none d-md-block">
                    {currentUser.name}
                  </span>
                </span>
              }
              id="dropdown-profile"
            >
              <Dropdown.Header>
                <h6>{currentUser.name}</h6>
              </Dropdown.Header>
              <Dropdown.Divider />
              <ProfileModal user={currentUser}>
                <Dropdown.Item as="button">
                  <i className="bi bi-person"></i>
                  <span> My Profile</span>
                </Dropdown.Item>
              </ProfileModal>
              <Dropdown.Divider />
              <Dropdown.Item as="button" onClick={logout}>
              <i className="bi bi-box-arrow-right"></i>
              <span>Sign Out</span>
              </Dropdown.Item>
            </DropdownButton>
          </li>
          <li>
          <IconButton
              aria-label="Toggle dark mode"
              icon={colorMode === 'light' ? <BsMoon /> : <BsSun />}
              onClick={toggleColorMode}
              bg="transparent"
              color="white"
            />
          </li>
          <li className="nav-item">
            <Menu>
              <MenuButton p='2'>
                <NotificationBadge
                  count={notification.length}
                  effect={Effect.SCALE}
                />
                <Icon as={AiFillBell} m='1' fontSize='2xl' color='white' />
              </MenuButton>
              <MenuList p='2'>
                {notification.length === 0 ? (
                  'No new message'
                ) : (
                  <>
                    {notification.map((item, index) => {
                      return (
                        <MenuItem
                          key={index}
                          onClick={() => handleClickNotification(item)}
                        >
                          {item.chat.isGroupChat
                            ? `New message in ${item.chat.chatName}`
                            : `New message from ${getSender(
                                currentUser,
                                item.chat.users
                              )}`}
                        </MenuItem>
                      );
                    })}
                  </>
                )}
              </MenuList>
            </Menu>
          </li>
          <li>
          <SearchUserSideDrawer>
            <Tooltip label='Search users'>
              <Button
                isFullWidth
                bg='white'
                variant='outline'
                color='black'
                justifyContent='space-between'
                rightIcon={<AiOutlineSearch />}
              >
                <Text color="black">Search users</Text>
              </Button>
            </Tooltip>
          </SearchUserSideDrawer>
          </li>
          
        </ul>
        
      </nav>
    </div>
  );
}

export default LeftTopBar;
