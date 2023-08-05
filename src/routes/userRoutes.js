import express from 'express';
import {
    deleteUser,
    getUser,
    loginUser,
    registerUser,
} from '../controllers/userController.js';
import { editUserFA } from '../models/firebase/userAuth/editUser.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.put('/edit', editUserFA);

router.get('/get/:userId', getUser);

router.delete('/delete/:userId', deleteUser);

export default router;
