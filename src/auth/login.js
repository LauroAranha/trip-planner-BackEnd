import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.js';

/**
 * * @date 3/4/2023 - 12:43:36 PM
 * Checks if user is registred in firebase auth
 *  @example
 * const userInfo = await signIn(email, password);
 * const userEmail = userInfo.email
 *
 * if (userInfo) {
 *  console.log('user logged succesfully' + userInfo);
 *  // do something with the user information object
 * } else {
 *  console.log('fail');
 *  // fails
 * }
 *
 * @param {String} email
 * @param {String} password
 * @returns {Object} Returns all the user information.
 */
export const signIn = async (email, password) => {
    const response = signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            let user = userCredential.user;
            console.log('User logged in! ' + user.email);
            return user;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`Error code ${errorCode}: ${errorMessage}`);
        });
    return response;
};
