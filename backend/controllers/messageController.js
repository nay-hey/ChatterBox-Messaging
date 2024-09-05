const CatchAsyncErrors = require('../middleware/CatchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');
const Message = require('../models/messageModel');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const cloudinary = require('cloudinary').v2;

exports.sendSingleMessage = CatchAsyncErrors(async (req, res, next) => {
  const { content, chatId, image } = req.body;

  if (!content && !image) {
    return next(new ErrorHandler('Please provide content or an image', 400));
  }

  const chat = await Chat.findById(chatId);
  const chatUsers = chat.users.map((user) => user.toString());

  if (!chatUsers.includes(req.user._id.toString())) {
    return next(
      new ErrorHandler('Cannot message in the chats you are not part of', 401)
    );
  }

  let imageUrl;
  if (image) {
    const result = await cloudinary.uploader.upload(image, {
      folder: 'chat_images',
    });
    imageUrl = result.secure_url;
  }

  const newMessage = {
    sender: req.user._id,
    chat: chatId,
    content: content || imageUrl, 
  };

  let message = await Message.create(newMessage);

  message = await Message.findById(message._id)
    .populate('sender')
    .populate('chat');

  message = await User.populate(message, { path: 'chat.users' });

  await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

  res.status(200).json({
    success: true,
    data: message,
  });
});


exports.sendAllMessage = CatchAsyncErrors(async (req, res, next) => {
  const chat = await Chat.findById(req.params.id);
  const chatUsers = chat.users.map((user) => user.toString());
  if (!chatUsers.includes(req.user._id.toString())) {
    return next(
      new ErrorHandler('Cannot get messages of chats you are not part of', 401)
    );
  }
  const messages = await Message.find({ chat: req.params.id })
    .populate('sender')
    .populate('chat');
  res.status(200).json({
    success: true,
    data: messages,
  });
});

exports.deleteChat = CatchAsyncErrors(async (req, res, next) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    return next(new ErrorHandler('Message not found', 404));
  }

  if (message.sender.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler('You can only delete your own messages', 403));
  }

  await Message.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: 'Message deleted successfully',
  });
});
