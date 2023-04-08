import { deleteUser, updateEmail, updatePassword } from 'firebase/auth';
import { auth, db } from '../../../config/firebase.js';
import {
    deleteDocumentInCollection,
    updateDocumentInCollection,
} from '../firebaseOperations.js';
import { errorHandler } from '../../../utils/firebaseErrorHandler.js';

import { logger } from '../../../utils/logger.js';
import { signIn } from './login.js';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { signUp } from './register.js';

export const editUserFA = async (userInfo) => {
    try {
        const {
            currentEmail,
            currentPassword,
            newEmail,
            newPassword,
            name,
            adress,
        } = userInfo;
        let currentUser;

        const getCurrentUser = await signIn({
            email: currentEmail,
            currentPassword: currentPassword,
        })
            .then(async () => {
                currentUser = auth.currentUser;
            })
            .catch((error) => {
                throw new Error(error);
            });

        if (newEmail) {
            await updateEmail(currentUser, newEmail)
                .then(async () => {
                    logger.info('email updated now its: ' + newEmail);
                })
                .catch((error) => {
                    errorHandler(error);
                    throw new Error(error);
                });
        }

        if (newPassword) {
            await updatePassword(currentUser, newPassword)
                .then(async () => {
                    logger.info('password updated, now its: ' + newPassword);
                })
                .catch((error) => {
                    errorHandler(error);
                    throw new Error(error);
                });
        }

        const docRef = await collection(
            db,
            'users'.catch((error) => {
                throw new Error(error);
            }),
        );
        const emailQuery = await query(
            docRef,
            where('email', '==', currentUser.email).catch((error) => {
                throw new Error(error);
            }),
        );
        const querySnapshot = await getDocs(emailQuery).catch((error) => {
            throw new Error(error);
        });
        let uid;

        querySnapshot
            .forEach(async (doc) => {
                uid = doc.id;
                delete userInfo.currentEmail, userInfo.currentPassword;
                await updateDocumentInCollection('users', uid, {
                    name: name,
                    adress: adress,
                    email: newEmail,
                    currentPassword: newPassword,
                });
            })
            .catch((error) => {
                throw new Error(error);
            });
        return { status: 200, message: 'Usuário atualizado' };
    } catch (err) {
        return { status: 500, message: err };
    }
};
