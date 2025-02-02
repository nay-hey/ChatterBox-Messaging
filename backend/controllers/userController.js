const User = require('../models/userModel');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middleware/CatchAsyncErrors');
const sendToken = require('../utils/jwt');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary');

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, avatar } = req.body;
  if (!name || !email || !password) {
    return next(new ErrorHandler('Missing fields', 400));
  }
  if (password.length < 8) {
    return next(new ErrorHandler('Password must be at least 8 characters long', 400));
  }
  const exitingUser = await User.findOne({ email });
  if (exitingUser) {
    return next(new ErrorHandler('User already exist', 400));
  }
  let tempImage;
  if (avatar && typeof avatar === 'string') {
    const { public_id, url } = await cloudinary.uploader.upload(avatar, {
      folder: 'profile-images',
    });
    tempImage = { url, public_id };
  }
  const user = await User.create({
    name,
    email,
    password,
    avatar: tempImage,
  });
  sendToken(user, 200, res);
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler('Missing fields', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }
  sendToken(user, 200, res);
});

exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.status(200).json({
    success: true,
    message: 'Logged Out',
  });
});

exports.sendCurrentUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(
      new ErrorHandler('Please login again to access this resource', 401)
    );
  }
  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedData.id);
    if (!user) {
      return next(new ErrorHandler('User not found', 401));
    }
    sendToken(user, 200, res);
  } catch (error) {
    return next(new ErrorHandler('Invalid token, please login again', 401));
  }
});

exports.sendUsers = catchAsyncError(async (req, res, next) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.status(200).json({
    success: true,
    data: users,
  });
});
