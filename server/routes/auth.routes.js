import express from 'express';
import { Register,login, logout } from '../Controller/UserController.js';
const router = express.Router();
//Sign up
router.post('/signup', Register);
//Login
router.post('/login', login);
    
router.post('/logout',logout)

export default router;
