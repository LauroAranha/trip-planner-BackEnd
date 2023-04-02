import { logger } from '../utils/logger.js';

import { signUp } from '../models/firebase/userAuth/register.js';
import { signIn } from '../models/firebase/userAuth/login.js';

import {
    updateDocumentInCollection,
    listDocFromCollectionWithId,
} from '../models/firebase/firebaseOperations.js';
import { deleteUserFA } from '../models/firebase/userAuth/deleteUser.js';

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
        return { status: 200, message: JSON.stringify(results) };
    } catch (err) {
        logger.error(err)
        return {
            status: 401,
            message: JSON.stringify(err.message),
        }
    }
};

const getUser = async (payload) => {
    try {
        const results = await listDocFromCollectionWithId('users', payload.userId);
        if (results) {
            return {
                status: 200,
                message: JSON.stringify(results),
            };
        } else {
            return {
                status: 404,
                message: "User not found",
            };
        }

    } catch (err) {
        logger.error(err);
        return {
            status: 500,
            message: err,
        };
    }
};

const editUser = async (payload) => {
    try {
        const results = await editUserFA(
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
        const results = await deleteUserFA('users', payload);
        return { status: 200, message: 'Usuário apagado' };
    } catch (err) {
        logger.error(err);
    }
};

export { registerUser, loginUser, editUser, getUser, deleteUser };
