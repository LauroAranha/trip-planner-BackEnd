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
 *  @param {String} password
 *  @returns {CurrentUserInfo} current user object
 *  ```
 *  const signUpUser = await signUp({
 *    email: 'test@test.com', name: 'mockup', address: street'
 *    },'password123');
 *  signUpUser
 *  ```
 */
export const signUp = async (userInformation) => {
    const { email, password } = userInformation;
    try {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up succesfully
                const user = userCredential.user;
                logger.info(`User created on auth succesfully! ${email}`);
                return user;
            })
            .catch((error) => {
                errorHandler(error);
            });

        await addDocInCollection('users', userInformation);
    } catch (error) {
        errorHandler(error);
    }
};
