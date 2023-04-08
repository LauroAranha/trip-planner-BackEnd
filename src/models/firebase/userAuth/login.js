import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../config/firebase.js';
import { logger } from '../../../utils/logger.js';

/**
 *  Checks if user is registered in firebase auth and returns all the user information in an object.
 *  @param {String} email
 *  @param {String} password
 *  @returns {CurrentUserInfo} current user object
 *
 */
export const signIn = async (userInformation) => {
    const { email, currentPassword } = userInformation;
    const response = signInWithEmailAndPassword(auth, email, currentPassword)
        .then((userCredential) => {
            let user = userCredential.user;
            logger.info('User logged in! ' + user.email);
            return { status: 200, message: user };
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            logger.error(`Error code ${errorCode}: ${errorMessage}`);
            throw new Error(error);
        });
    return response;
};
