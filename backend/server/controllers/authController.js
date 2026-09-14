import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import crypto from 'crypto';

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        detail: errors.array()[0].msg
      });
    }

    const { name, email, password, phoneNumber, childAge, region, problemDescription, role = 'student' } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        detail: 'Email already registered'
      });
    }

    const userData = {
      name,
      email,
      password,
      role,
      profileCompleted: true,
    };

    if (role === 'student') {
      userData.inviteCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    }

    if (phoneNumber && phoneNumber.trim() !== '') {
      userData.phoneNumber = phoneNumber.trim();
    }
    if (childAge !== undefined && childAge !== null && childAge !== '') {
      userData.childAge = Number(childAge);
    }
    if (region && region.trim() !== '') {
      userData.region = region.trim();
    }
    if (problemDescription && problemDescription.trim() !== '') {
      userData.problemDescription = problemDescription.trim();
    }

    const user = await User.create(userData);

    if (user) {
      res.status(201).json({
        access_token: generateToken(user._id, user.role),
        token_type: 'bearer',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          inviteCode: user.inviteCode,
          picture: user.picture,
          profileCompleted: user.profileCompleted,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      detail: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        detail: errors.array()[0].msg
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        access_token: generateToken(user._id, user.role),
        token_type: 'bearer',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          inviteCode: user.inviteCode,
          picture: user.picture,
          profileCompleted: user.profileCompleted,
        },
      });
    } else {
      res.status(401).json({
        success: false,
        detail: 'Incorrect email or password'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      detail: error.message
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      inviteCode: user.inviteCode,
      profileCompleted: user.profileCompleted,
      picture: user.picture,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      detail: error.message
    });
  }
};
