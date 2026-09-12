import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { authenticateJWT } from '../middleware/auth.js';
import { validateRequired } from '../middleware/validate.js';

const router = express.Router();

router.post('/register', validateRequired(['name', 'email', 'password']), register);
router.post('/login', validateRequired(['email', 'password']), login);
router.get('/me', authenticateJWT, getMe);

export default router;
