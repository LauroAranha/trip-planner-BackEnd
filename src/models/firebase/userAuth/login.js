import {
    browserSessionPersistence,
    getAuth,
    setPersistence,
    signInWithCustomToken,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../../../config/firebase.js';
import { logger } from '../../../utils/logger.js';
import admin from 'firebase-admin';
import { errorHandler } from '../../../utils/firebaseErrorHandler.js';


/**
 *  Checks email and password using auth and returns token
 *  @param {String} email
 *  @param {String} password
 *  @returns {CurrentUserInfo} current user object
 *
 */
export const signIn = async (userInformation) => {
    const { email, password } = userInformation;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        logger.info(`User authenticated: ${userCredential.user.email}`);

        const customToken = await admin.auth().createCustomToken(userCredential.user.uid);
        logger.info('Token generated');

        const userInfo = await signInWithCustomToken(auth, customToken);
        logger.info(userInfo);

        await setPersistence(auth, browserSessionPersistence);

        return userInfo;
    } catch (error) {
        errorHandler(error, 'User not authenticated!')
    }
};