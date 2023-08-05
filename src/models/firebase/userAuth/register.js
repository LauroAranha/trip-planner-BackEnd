import {
    createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../../../config/firebase.js';
import admin from '../../../config/admin.js';
import { addDocInCollection } from '../firebaseOperations.js';
import { errorHandler } from '../../../utils/firebaseErrorHandler.js';

import { logger } from '../../../utils/logger.js';

export const signUp = async (userInformation) => {
    const { email, password } = userInformation;
    try {
        await createUserWithEmailAndPassword(auth, email, password)
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
                        console.log(`Error fetching user data: ${error}`);
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
