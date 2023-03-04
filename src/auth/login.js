import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.js';

/**
 *  @description Checks if user is registred in firebase auth and returns all the user information in an object.
 *  @param {String} email
 *  @param {String} password
 *  @returns {CurrentUserInfo} current user object
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
