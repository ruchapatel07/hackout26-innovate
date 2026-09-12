import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserStore } from '../models/dynamoTables.js';
import { config } from '../config/env.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, companyName, location, latitude, longitude } = req.body;

    const existing = await UserStore.findByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = 'usr-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

    const newUser = {
      userId,
      name,
      email: email.toLowerCase(),
      password: passwordHash,
      role: role || 'consumer',
      companyName: companyName || name,
      location: location || 'Houston, TX',
      latitude: latitude ? Number(latitude) : 29.7604,
      longitude: longitude ? Number(longitude) : -95.3698,
      createdAt: new Date().toISOString()
    };

    await UserStore.create(newUser);

    const token = jwt.sign(
      { userId: newUser.userId, role: newUser.role, email: newUser.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserStore.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.userId, role: user.role, email: user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    const { password: _, ...userWithoutPassword } = user;

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const { password: _, ...userWithoutPassword } = req.user;
    return res.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (err) {
    next(err);
  }
};
