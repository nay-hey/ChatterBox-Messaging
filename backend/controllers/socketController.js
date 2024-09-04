const connectedUsers = new Set(); 
exports.handleSetup = (socket) => {
  socket.on('setup', (user) => {
    connectedUsers.add(user.id); 
    socket.user_id = user.id;
    socket.join(user.id);
    socket.emit('connected');
  });

  socket.on('disconnect', () => {
    connectedUsers.delete(socket.user_id); 
    if (socket.chat_id) {
      socket.to(socket.chat_id).emit('user_online_status', false);
    }
  });
};

exports.handleJoinChat = (socket) => {
  socket.on('join_room', ({ room, users }) => {
    socket.chat_id = room;
    socket.join(room);

    const userIds = new Set(users.map(user => user._id));
    const online = [...userIds].every(id => connectedUsers.has(id));

    socket.emit('user_online_status', online);
    socket.to(room).emit('user_online_status', online);
  });

  socket.on('leave_room', (room) => {
    socket.leave(room);
  });
};

exports.handleMessage = (socket) => {
  socket.on('new_message', (message) => {
    const { chat, sender } = message;
    if (!chat.users) {
      return console.log('no users in chat');
    }

    chat.users.forEach((user) => {
      if (user._id !== sender._id) {
        socket.to(user._id).emit('new_message_received', message);
      }
    });
  });
};

exports.handleTyping = (socket) => {
  socket.on('typing', (room) => {
    socket.to(room).emit('typing');
  });

  socket.on('stop_typing', (room) => {
    socket.to(room).emit('stop_typing');
  });
};
