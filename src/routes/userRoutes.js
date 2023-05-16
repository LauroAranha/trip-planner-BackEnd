import express from 'express';
import {
    controllerRegisterUser,
    controllerLoginUser,
    controllerEditUser,
    controllerGetUser,
    controllerDeleteUser,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', controllerRegisterUser);

router.post('/login', controllerLoginUser);

router.put('/edit', controllerEditUser);

router.get('/get/:userId', controllerGetUser);

router.delete('/delete/:userId', controllerDeleteUser);

export default router;
