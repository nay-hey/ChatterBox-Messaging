require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const connectToDb = require('./config/db');

const app = express();

const userRouter = require('./routes/userRouter');
const chatRouter = require('./routes/chatRouter');
const messageRouter = require('./routes/messageRouter');

const socketEventHandler = require('./controllers/socketController');

process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Server shutting down due to uncaught exception`);
    process.exit(1);
  });

connectToDb();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '20mb' }));
app.use(cookieParser());

app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log('server running');
});

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

// listening events
io.on('connection', (socket) => {
  socketEventHandler.handleSetup(socket);
  socketEventHandler.handleJoinChat(socket);
  socketEventHandler.handleMessage(socket);
  socketEventHandler.handleTyping(socket);
});


process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Server shutting down due to unhandled promise rejection`);
    server.close(() => {
      process.exit(1);
    });
});