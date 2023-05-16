import {
    deleteUser,
    signInWithCustomToken,
    updateEmail,
    updatePassword,
    updateProfile,
} from 'firebase/auth';
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
import e from 'express';

/**
 * Description
 * @param {any} payload
 * @returns {any}
 */
export const editUserFA = async (payload) => {
    const token = payload.headers.auth;
    const userNewInfo = payload.body;

    // console.log(token);
    console.log(token.slice(0, 6));
    console.log(userNewInfo);

    try {
        const { docId, email, currentPassword } = userNewInfo;

        await signInWithCustomToken(auth, token);
        const currentUser = await auth.currentUser;
        console.log(await auth.currentUser.displayName);

        // if (newDisplayName) {
        //     try {
        //         await updateProfile(currentUser, {
        //             displayName: newDisplayName,
        //         });
        //     } catch (error) {
        //         errorHandler(error, 'Failed changing display name');
        //     }
        // }

        // if (newProfilePictureUrl) {
        //     try {
        //         await updateProfile(currentUser, {
        //             photoURL: newProfilePictureUrl,
        //         });
        //     } catch (error) {
        //         errorHandler(error, 'Failed changing profile picture');
        //     }
        // }

        if (email) {
            try {
                await updateEmail(currentUser, email);
                logger.info('email updated now its: ' + email);
            } catch (error) {
                errorHandler(error);
                throw new Error(error);
            }
        }

        if (currentPassword) {
            try {
                await updatePassword(currentUser, currentPassword);
                logger.info('password updated, now its: ' + currentPassword);
            } catch (error) {
                errorHandler(error, 'Failed changing password');
            }
        }

        await updateDocumentInCollection('users', docId, userNewInfo);

        // const docRef = await collection(
        //     db,
        //     'users'.catch((error) => {
        //         throw new Error(error);
        //     }),
        // );
        // const emailQuery = await query(
        //     docRef,
        //     where('email', '==', currentUser.email).catch((error) => {
        //         throw new Error(error);
        //     }),
        // );
        // const querySnapshot = await getDocs(emailQuery).catch((error) => {
        //     throw new Error(error);
        // });
        // let uid;

        // querySnapshot
        //     .forEach(async (doc) => {
        //         uid = doc.id;
        //         delete userNewInfo.currentEmail, userNewInfo.currentPassword;
        //         await updateDocumentInCollection('users', uid, {
        //             name: name,
        //             adress: adress,
        //             email: newEmail,
        //             currentPassword: newPassword,
        //         });
        //     })
        //     .catch((error) => {
        //         throw new Error(error);
        //     });
        return { status: 200, message: 'Usuário atualizado' };
    } catch (err) {
        return { status: 500, message: err };
    }
};
