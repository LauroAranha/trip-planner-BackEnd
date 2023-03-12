import { logger } from '../utils/logger.js';

import { signUp } from '../models/firebase/userAuth/register.js';
import { signIn } from '../models/firebase/userAuth/login.js';

import {
    updateDocumentInCollection,
    listDocFromCollectionWithId,
    deleteDocumentInCollection,
} from '../models/firebase/firebaseOperations.js';

const registerUser = async (payload) => {
    try {
        const results = await signUp(payload);
        return { status: 200, message: 'Usuário registrado' };
    } catch (err) {
        logger.error(err);
    }
};

const loginUser = async (payload) => {
    try {
        const results = await signIn(payload);
        return { status: 200, message: 'Usuário logado' };
    } catch (err) {
        logger.error(err);
    }
};

const getUser = async (payload) => {
    try {
        const results = await listDocFromCollectionWithId('users', payload);
        return {
            status: 200,
            message: `Usuário resgatado: ${JSON.stringify(results)}`,
        };
    } catch (err) {
        logger.error(err);
    }
};

const editUser = async (payload) => {
    try {
        const results = await updateDocumentInCollection(
            'users',
            payload.id,
            payload.data,
        );
        return { status: 200, message: 'Usuário editado' };
    } catch (err) {
        logger.error(err);
    }
};

const deleteUser = async (payload) => {
    try {
        const results = await deleteDocumentInCollection('users', payload);
        return { status: 200, message: 'Usuário apagado' };
    } catch (err) {
        logger.error(err);
    }
};

export { registerUser, loginUser, editUser, getUser, deleteUser };
