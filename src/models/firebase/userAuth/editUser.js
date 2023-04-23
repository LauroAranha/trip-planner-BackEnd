import { deleteUser, signInWithCustomToken, updateEmail, updatePassword, updateProfile } from 'firebase/auth';
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



/**
 * Description
 * @param {any} payload
 * @returns {any}
 */
export const editUserFA = async (payload) => {
    const token = payload.headers.auth
    const userNewInfo = payload.body

    console.log(token.slice(0, 6));
    console.log(userNewInfo);

    try {

        const {
            currentEmail,
            currentPassword,
            newEmail,
            newPassword,
            name,
            adress,
            newDisplayName,
            newProfilePictureUrl
        } = userNewInfo;

        await signInWithCustomToken(auth, token);
        const currentUser = await auth.currentUser
        console.log(await auth.currentUser.displayName);


        if (newDisplayName) {
            try {
                await updateProfile(currentUser, {
                    displayName: newDisplayName
                })
            } catch (error) {
                errorHandler(error, 'Failed changing display name');
            }
        }

        if (newProfilePictureUrl) {
            try {
                await updateProfile(currentUser, {
                    photoURL: newProfilePictureUrl
                })
            } catch (error) {
                errorHandler(error, 'Failed changing profile picture');
            }
        }

        if (newEmail) {
            try {
                await updateEmail(currentUser, newEmail)
                logger.info('email updated now its: ' + newEmail);
            } catch (error) {
                errorHandler(error);
                throw new Error(error);
            }
        }

        if (newPassword) {
            try {
                await updatePassword(currentUser, newPassword)
                logger.info('password updated, now its: ' + newPassword);
            } catch (error) {
                errorHandler(error, 'Failed changing password');
            }
        }

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
