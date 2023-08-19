import { logger } from '../utils/logger.js';

import { signUp } from '../models/firebase/userAuth/register.js';
import { signIn } from '../models/firebase/userAuth/login.js';

import { queryDocumentInCollection } from '../models/firebase/firebaseOperations.js';

import { deleteUserFA } from '../models/firebase/userAuth/deleteUser.js';
import { editUserFA } from '../models/firebase/userAuth/editUser.js';

const getMissingFields = (requestBody, requiredFields) => {
    const missingFields = [];

    requiredFields.forEach((field) => {
        if (!requestBody[field]) {
            missingFields.push(field);
        }
    });

    return missingFields;
}

const registerUser = async (req, res) => {
    try {
        const requiredFields = ["name", "email", "birthdate", "cep", "address", "city", "state", "cpf", "rg", "phone", "gender", "profilepic"];
        const missingFields = getMissingFields(req.body, requiredFields)

        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Os seguintes campos são necessários: ${missingFields.join(", ")}.`, hasError: true });
        }

        const results = await signUp(req.body);
        res.status(201).send({ message: 'User registred', data: results, hasError: false });
    } catch (err) {
        logger.error(err);
        res.status(401).send({ message: err, hasError: true });
    }
};

const loginUser = async (req, res) => {
    try {
        const requiredFields = ["email", "currentPassword"];
        const missingFields = getMissingFields(req.body, requiredFields)

        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Os seguintes campos são necessários: ${missingFields.join(", ")}.`, hasError: true });
        }

        const results = await signIn(req.body);
        res.status(200).send({ message: 'Usuário logado!', data: results, hasError: false });
    } catch (err) {
        logger.error(err);
        res.status(401).send({ message: err, hasError: true });
    }
};

const getUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const results = await queryDocumentInCollection(
            'users',
            'userId',
            '==',
            userId,
        );

        if (results) {
            res.status(200).send({
                message: "Usuário encontrado com sucesso",
                data: results[0],
                hasError: false
            });
        } else {
            res.status(404).send({ message: 'O usuário não foi encontrado!', hasError: true });
        }
    } catch (err) {
        logger.error(err);
        res.status(500).send({ message: err, hasError: true });
    }
};

const editUser = async (req, res) => {
    try {
        const results = await editUserFA(req);

        logger.info(results)
        res.status(200).send({ message: 'Usuário editado!', data: results, hasError: false });
    } catch (err) {
        logger.error(err);
        res.status(500).send({ message: err, hasError: true });
    }
};

const deleteUser = async (req, res) => {
    try {
        const results = await deleteUserFA(req.params.userId);

        res.status(200).send({ message: 'Usuário apagado!', hasError: false });
    } catch (err) {
        logger.error(err);
        res.status(500).send({ message: err, hasError: true });
    }
};

export { registerUser, loginUser, editUser, getUser, deleteUser };
