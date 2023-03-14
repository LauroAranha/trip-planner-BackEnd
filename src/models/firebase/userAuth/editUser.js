import { deleteUser, updateEmail, updatePassword } from 'firebase/auth';
import { auth, db } from '../../../config/firebase.js';
import { deleteDocumentInCollection, updateDocumentInCollection } from '../firebaseOperations.js';
import { errorHandler } from '../../../utils/firebaseErrorHandler.js';

import { logger } from '../../../utils/logger.js';
import { signIn } from './login.js';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { signUp } from './register.js';

export const editUser = async (currentUser, newUserInformation) => {
    const { email, password } = newUserInformation
    if (email) {
        updateEmail(currentUser, email).then(async () => {
            console.log("email updated!")
        }).catch((error) => {
            errorHandler(error)
        });
    }

    if (password) {
        updatePassword(currentUser, password).then(async () => {
            console.log("password updated!")
        }).catch((error) => {
            errorHandler(error)
        });
    }

    const docRef = await collection(db, "users")
    const emailQuery = await query(docRef, where("email", "==", currentUser.email));
    const querySnapshot = await getDocs(emailQuery);
    let uid;

    querySnapshot.forEach(async (doc) => {
        console.log(doc.id);
        uid = doc.id
        await updateDocumentInCollection('users', uid, newUserInformation);
    });
};

const b = await signIn({ email: "lauro@aranha.com", password: "lauro123" })
b