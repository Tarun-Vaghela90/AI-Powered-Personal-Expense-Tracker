import express from 'express';
import userController from '../controller/userController.js';

const router = express.Router();

router.get('/userdata', userController.getUser);
router.post('/createuser', userController.createUser);
router.post('/login', userController.loginUser);  // Add login route

export default router;
