import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../../../config/firebase.js';
import { addDocInCollection } from '../firebaseOperations.js';
import { errorHandler } from '../../../utils/firebaseErrorHandler.js';

import { logger } from '../../../utils/logger.js';

//TODO Complete research over required user information
/**
 *  Register user in firebase auth and storage, using its email, password, name, address
 *  @typedef signUp
 *  @param {object} userInformation
 *  @param {String} userInformation.email
 *  @param {String} userInformation.name
 *  @param {String} userInformation.address
 *  @param {String} currentPassword
 *  @param {String} confirmPassword
 *  @returns {CurrentUserInfo} current user object
 *  ```
 *  const signUpUser = await signUp({
 *    email: 'test@test.com', name: 'mockup', address: street'
 *    },'password123');
 *  signUpUser
 *  ```
 */
export const signUp = async (userInformation) => {
    const { email, currentPassword } = userInformation;
    try {
        await createUserWithEmailAndPassword(auth, email, currentPassword)
            .then(async (userCredential) => {
                // Signed up succesfully
                const user = userCredential.user;
                logger.info(`User created on auth succesfully! ${email}`);
                await addDocInCollection('users', userInformation);
                return user;
            })
            .catch((error) => {
                errorHandler(error);
            });
    } catch (error) {
        errorHandler(error);
    }
};
