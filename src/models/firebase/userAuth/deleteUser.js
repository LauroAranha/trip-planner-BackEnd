import { deleteUser } from 'firebase/auth';
import { auth, db } from '../../../config/firebase.js';
import { deleteDocumentInCollection } from '../firebaseOperations.js';
import { errorHandler } from '../../../utils/firebaseErrorHandler.js';

import { logger } from '../../../utils/logger.js';
import { signIn } from './login.js';
import { signUp } from './register.js'
import { collection, getDocs, where, query } from 'firebase/firestore';



export const deleteUserFA = async (user) => {
    try {
        await deleteUser(user)
            .then(async () => {
                const docRef = await collection(db, "users")
                const { email } = user
                const emailQuery = await query(docRef, where("email", "==", email));
                const querySnapshot = await getDocs(emailQuery);
                let uid;

                querySnapshot.forEach(async (doc) => {
                    console.log(doc.id);
                    uid = doc.id
                    await deleteDocumentInCollection('users', uid);
                });

                logger.info("User deleted successfully!")
            })
            .catch((error) => {
                console.log(error)
            });
    } catch (error) {
        errorHandler(error);
    }
};
