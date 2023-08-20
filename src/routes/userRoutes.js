import express from 'express';
import {
    deleteUser,
    editUser,
    getUser,
    loginUser,
    registerUser,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.put('/edit', editUser);

router.get('/get/:userId', getUser);

router.delete('/delete/:userId', deleteUser);

export default router;
