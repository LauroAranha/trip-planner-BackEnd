import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import serviceAccount from '../../../donotcommit/trip-planner-b0cfe-firebase-adminsdk-e4r7b-d2eb2a11d7.json' assert { type: 'json' };
import { auth } from '../../../config/firebase.js';
import { addDocInCollection } from '../firebaseOperations.js';
import { errorHandler } from '../../../utils/firebaseErrorHandler.js';

import { logger } from '../../../utils/logger.js';

import admin from 'firebase-admin';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

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

                await admin
                    .auth()
                    .getUserByEmail(email)
                    .then((userRecord) => {
                        // See the UserRecord reference doc for the contents of userRecord.
                        let authUid = userRecord.uid;
                        console.log(
                            `Successfully fetched user data: ${userRecord.toJSON()}`,
                        );

                        userInformation.userId = authUid;
                        addDocInCollection('users', userInformation);
                    })
                    .catch((error) => {
                        console.log('Error fetching user data:', error);
                    });
                return user;
            })
            .catch((error) => {
                errorHandler(error);
            });
    } catch (error) {
        errorHandler(error);
    }
};
