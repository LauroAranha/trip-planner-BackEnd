import { logger } from '../utils/logger.js';

import { signUp } from '../models/firebase/userAuth/register.js';
import { signIn } from '../models/firebase/userAuth/login.js';

import {
    listDocFromCollectionWithId,
    queryDocumentInCollection,
} from '../models/firebase/firebaseOperations.js';
import { deleteUserFA } from '../models/firebase/userAuth/deleteUser.js';

const registerUser = async (payload) => {
    try {
        const results = await signUp(payload);
        return { status: 200, message: 'Usuário registrado!', data: results };
    } catch (err) {
        logger.error(err);
        return {
            status: 401,
            message: err,
        };
    }
};

const loginUser = async (payload) => {
    try {
        const results = await signIn(payload);
        return { status: 200, message: 'Usuário logado!', data: results };
    } catch (err) {
        logger.error(err);
        return {
            status: 401,
            message: err,
        };
    }
};

const getUser = async (payload) => {
    try {
        const results = await queryDocumentInCollection(
            'users',
            'userId',
            '==',
            payload.userId,
        );
        if (results) {
            return {
                status: 200,
                message: results[0],
            };
        } else {
            return {
                status: 404,
                message: 'O usuário não foi encontrado!',
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
        const results = await editUserFA('users', payload.id, payload.data);
        return { status: 200, message: 'Usuário editado!' };
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
