'use client';

import React, { useEffect, useRef, useState}  from 'react';
import { useChatContext } from '../../context/chatContext';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';
import { LeftTopBar, UsersChat, ChatBox } from '../../components';
function ChatsPage() {
    
  const { selectedChat } = useChatContext();
  const [isSidebarToggled, setIsSidebarToggled] = useState(false);

  useEffect(() => {
    const toggleSidebar = () => {
      setIsSidebarToggled(prevState => !prevState);
    };

    const toggleButton = document.querySelector('.toggle-sidebar-btn');
    if (toggleButton) {
      toggleButton.addEventListener('click', toggleSidebar);
    }

    return () => {
      if (toggleButton) {
        toggleButton.removeEventListener('click', toggleSidebar);
      }
    };
  }, []);

  useEffect(() => {
    if (isSidebarToggled) {
      document.body.classList.add('toggle-sidebar');
    } else {
      document.body.classList.remove('toggle-sidebar');
    }
  }, [isSidebarToggled]);
  useEffect(() => {
    document.title = 'Chats';
  }, []);

  return (
    <div>
      <header id="header" className="header fixed-top d-flex align-items-center">
        <div className="container-fluid container-xl d-flex align-items-center justify-content-between">
            <div className="logo d-flex align-items-center">
              <h1>ChatterBox</h1>
            </div>
        </div>
        
        <i className="bi bi-list toggle-sidebar-btn"></i>
        <LeftTopBar />
        </header>
        <aside id="sidebar" className="sidebar">

          <ul className="sidebar-nav" id="sidebar-nav">
          <UsersChat />
          </ul>

          </aside>
          <main id="main" className="main" ><ChatBox /></main>
          
    </div>
  );
}

export default ChatsPage;
