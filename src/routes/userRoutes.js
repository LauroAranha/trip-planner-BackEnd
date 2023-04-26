import express from 'express';
import {
    getUser,
    loginUser,
    registerUser,
} from '../controllers/userController.js';
import { deleteUserFA } from '../models/firebase/userAuth/deleteUser.js';
import { editUserFA } from '../models/firebase/userAuth/editUser.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.put('/edit', editUserFA);

router.get('/get/:userId', getUser);

router.delete('/delete/:userId', deleteUserFA);

export default router;
