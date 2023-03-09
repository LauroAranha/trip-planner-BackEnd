import { logger } from '../utils/logger.js';

import { signUp } from '../models/firebase/userAuth/register.js';
import { signIn } from '../models/firebase/userAuth/login.js';

const registerUser = async (payload) => {
    try {
        const results = await signUp(payload);
        return { status: 200, message: 'Usuário registrado' };
    } catch (err) {
        logger.error('Deu erro');
    }
};

const loginUser = async (payload) => {
    try {
        const results = await signIn(payload);
        return { status: 200, message: 'Usuário logado' };
    } catch (err) {
        logger.error('Deu erro');
    }
};

export { registerUser, loginUser };
