import serviceAccount from "../../../donotcommit/trip-planner-b0cfe-firebase-adminsdk-e4r7b-d2eb2a11d7.json"  assert {type: 'json'};
import { getAuth, signInWithCustomToken, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../config/firebase.js';
import { logger } from '../../../utils/logger.js';
import admin from 'firebase-admin'

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


/**
 *  Checks email and password using auth and returns token 
 *  @param {String} email
 *  @param {String} password
 *  @returns {CurrentUserInfo} current user object
 *
 */
export const signIn = async (userInformation) => {
    const { email, password } = userInformation;
    const authenticateUser = await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            let user = userCredential.user;
            logger.info(`User authenticated: ${user.email}`);
            return { status: 200, message: user.uid };
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            logger.error(`Error code ${errorCode}: ${errorMessage}`);
            throw new Error(error)
        });

    const userId = authenticateUser.message;
    let token = await admin.auth().createCustomToken(userId).then((customToken) => {
        logger.info('Token generated');
        return customToken;
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        logger.error(`Error code ${errorCode}: ${errorMessage}`);
        throw new Error(error)
    });

    return token;
};

// const a = await signIn({ email: "lauro@lauro.com", password: "lauro123" })

// const { message } = await a

// const teste = await signInWithCustomToken(getAuth(), await message)
//     .then((userCredential) => {
//         // Signed in
//         var user = userCredential;
//         console.log("User Credentials: " + JSON.stringify(user));
//     })
//     .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         logger.error(`Error code ${errorCode}: ${errorMessage}`);
//         throw new Error(error)
//     })
