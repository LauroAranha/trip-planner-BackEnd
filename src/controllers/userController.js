import { logger } from '../utils/logger.js';

import { signUp } from '../models/firebase/userAuth/register.js';
import { signIn } from '../models/firebase/userAuth/login.js';

import { queryDocumentInCollection } from '../models/firebase/firebaseOperations.js';

import { deleteUserFA } from '../models/firebase/userAuth/deleteUser.js';

const registerUser = async (req, res) => {
    try {
        const results = await signUp(req.body);
        res.status(201).send({ message: 'Usuário registrado!', data: results });
    } catch (err) {
        logger.error(err);
        res.status(401).send(err);
    }
};

const loginUser = async (req, res) => {
    try {
        const results = await signIn(req.body);
        res.status(200).send({ message: 'Usuário logado!', data: results });
    } catch (err) {
        logger.error(err);
        res.status(401).send(err);
    }
};

const getUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const results = await queryDocumentInCollection(
            'users',
            'userId',
            '==',
            userId,
        );
        if (results) {
            res.status(200).send({
                data: results[0],
            });
        } else {
            res.status(404).send('O usuário não foi encontrado!');
        }
    } catch (err) {
        logger.error(err);
        res.status(500).send(err);
    }
};

const editUser = async (req, res) => {
    try {
        const results = await editUserFA('users', req.body.id, req.body.data);
        res.status(200).send({
            message: 'Usuário editado!',
            data: results[0],
        });
    } catch (err) {
        logger.error(err);
        res.status(500).send(err);
    }
};

const deleteUser = async (req, res) => {
    try {
        const results = await deleteUserFA('users', req.params.userId);
        res.status(200).send('Usuário apagado!');
    } catch (err) {
        logger.error(err);
        res.status(500).send(err);
    }
};

export { registerUser, loginUser, editUser, getUser, deleteUser };
