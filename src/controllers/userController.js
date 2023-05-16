import { logger } from '../utils/logger.js';

import {
    createUserWithEmailAndPassword,
    signInWithCustomToken,
    signInWithEmailAndPassword,
    deleteUser,
} from 'firebase/auth';
// import { signUp } from '../models/firebase/userAuth/register.js';
// import { signIn } from '../services/firebase/userAuth/login.js';
// import { editUserFA } from '../services/firebase/userAuth/editUser.js';
// import { deleteUserFA } from '../services/firebase/userAuth/deleteUser.js';
import {
    addDocInCollection,
    queryDocumentInCollection,
    updateDocumentInCollection,
    deleteDocumentInCollection,
} from '../services/firebase/firebaseOperations.js';

import { errorHandler } from '../utils/firebaseErrorHandler.js';

import { auth, db } from '../config/firebase.js';
import admin from 'firebase-admin';

const controllerRegisterUser = async (req, res) => {
    try {
        const { email, currentPassword } = req.body;
        // Creates a new user in Firebase Auth
        await createUserWithEmailAndPassword(auth, email, currentPassword)
            .then(async (userCredential) => {
                // Defines to the "user" variable the value of the credencials created to the user
                const user = userCredential.user;
                logger.info(`User created on auth succesfully! ${email}`);
                // Synchronize with Firebase Auth
                await admin
                    .auth()
                    .getUserByEmail(email)
                    .then((userRecord) => {
                        // Defines to the "authUid" variable the value of a Uid created to the user
                        const authUid = userRecord.uid;
                        logger.info(
                            `Successfully fetched user data: ${userRecord}`,
                        );
                        // Defines all the user information to be created into the Firestore Database
                        const userInformation = {
                            ...req.body,
                            userId: authUid,
                        };
                        // Adds a record of the user into the Firestore Database
                        addDocInCollection('users', userInformation);
                    })
                    .catch((error) => {
                        // Throws an Error when the login with the user credentials fail
                        throw new Error(error);
                    });
                // Sends a response to the request with the user data and a message if everything went right
                res.status(201).send({
                    message: 'Usuário registrado!',
                    data: user,
                });
                return user;
            })
            // Do the error handling for these operation
            .catch((error) => {
                let errorMessage = 'Something went wrong :/';
                if (error.code === 'auth/email-already-in-use') {
                    errorMessage = 'This e-mail is already in use!!';
                    errorHandler(error, errorMessage);
                    res.status(401).send({
                        message: errorMessage,
                    });
                }
                errorHandler(error, errorMessage);
                res.status(500).send({
                    message: errorMessage,
                });
            });
        // Do the error handling whrn the request has some fail
    } catch (err) {
        logger.error(err);
        res.status(500).send(err);
    }
};

const controllerLoginUser = async (req, res) => {
    try {
        const { email, currentPassword } = req.body;
        // Sing in with Firebase Auth
        await signInWithEmailAndPassword(auth, email, currentPassword)
            .then(async (response) => {
                logger.info(`User authenticated: ${response.user.email}`);
                // Synchronize with Firebase Auth
                await admin
                    .auth()
                    .createCustomToken(response.user.uid)
                    .then(async (customToken) => {
                        // Defines a custom token to the login response
                        response.token = customToken;
                        logger.info('Token generated');
                        // Sing in to the Firebase Auth with the custom token
                        await signInWithCustomToken(auth, customToken);
                        // Defines the curent user info to the authentication data
                        response.currentUserInfo = auth.currentUser;
                        logger.info('Got current user information succesfully');
                    })
                    .catch((error) => {
                        // Throws an Error when the login with the user credentials fail
                        throw new Error(error);
                    });
                res.status(200).send({
                    message: 'Login success, welcome!!',
                    data: response,
                });
            })
            // Do the error handling for these operation
            .catch((error) => {
                let errorMessage = 'Something went wrong :/';
                if (
                    error.code === 'auth/wrong-password' ||
                    error.code === 'auth/user-not-found'
                ) {
                    errorMessage =
                        'E-mail or password is wrong, please try again!!';
                    errorHandler(error, errorMessage);
                    res.status(401).send({
                        message: errorMessage,
                    });
                }
                errorHandler(error, errorMessage);
                res.status(500).send({
                    message: errorMessage,
                });
            });
        // Do the error handling whrn the request has some fail
    } catch (err) {
        logger.error(err);
        res.status(500).send(err);
    }
};

const controllerGetUser = async (req, res) => {
    try {
        const { userId } = req.params;
        // Search for the user using the id provided
        await queryDocumentInCollection('users', 'userId', '==', userId)
            .then((response) => {
                // Checks if there is data
                if (response[0]) {
                    res.status(200).send({
                        message: 'User data successfully',
                        data: response[0],
                    });
                } else {
                    throw new Error();
                }
            })
            // Do the error handling for these operation
            .catch((error) => {
                let errorMessage = 'Failed to find this user!';
                errorHandler(error, errorMessage);
                res.status(404).send({
                    message: errorMessage,
                });
            });
        // Do the error handling whrn the request has some fail
    } catch (err) {
        logger.error(err);
        res.status(500).send(err);
    }
};

const controllerEditUser = async (req, res) => {
    try {
        // Defines the token from the user
        const token = req.headers.auth;
        // Defines the new user information
        const userNewInfo = req.body;
        const { docId, email, currentPassword } = userNewInfo;
        // Sing in with Firebase Auth
        await signInWithCustomToken(auth, token)
            .then(async () => {
                // Defines the current user authenticacion
                const currentUser = auth.currentUser;
                logger.info(currentUser.displayName);
                // Verifies if the e-mail is going to be updated
                if (email) {
                    // Updates the e-mail in Firebase Auth
                    await updateEmail(currentUser, email).catch((error) => {
                        throw new Error(error);
                    });
                    logger.info('email updated now its: ' + email);
                }
                // Verifies if the password is going to be updated
                if (currentPassword) {
                    // Updates the password in Firebase Auth
                    await updatePassword(currentUser, currentPassword).catch(
                        (error) => {
                            throw new Error(error);
                        },
                    );
                    logger.info(
                        'password updated, now its: ' + currentPassword,
                    );
                }
                // Updates the user document in Firebase Firestore
                await updateDocumentInCollection(
                    'users',
                    docId,
                    userNewInfo,
                ).catch((error) => {
                    throw new Error(error);
                });
                res.status(200).send({
                    message: 'Update success!!',
                });
            })
            .catch((error) => {
                let errorMessage = 'Failed to update this user!';
                errorHandler(error, errorMessage);
                res.status(500).send({
                    message: errorMessage,
                });
            });
    } catch (err) {
        logger.error(err);
        res.status(500).send(err);
    }
};

const controllerDeleteUser = async (req, res) => {
    try {
        const { email, currentPassword } = req.body;
        let user;
        await signInWithEmailAndPassword(auth, email, currentPassword).then(
            async () => {
                user = auth.currentUser;
                console.log(user);
                await deleteUser(user)
                    .then(async () => {
                        const docRef = await collection(db, 'users');
                        const { email } = user;
                        const emailQuery = await query(
                            docRef,
                            where('email', '==', email),
                        );
                        const querySnapshot = await getDocs(emailQuery);
                        let uid;
                        querySnapshot.forEach(async (doc) => {
                            console.log(doc.id);
                            uid = doc.id;
                            await deleteDocumentInCollection('users', uid);
                        });
                        logger.info('User deleted successfully!');
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
        );
        res.status(200).send('Usuário apagado!');
    } catch (err) {
        logger.error(err);
        res.status(500).send(err);
    }
};

export {
    controllerRegisterUser,
    controllerLoginUser,
    controllerEditUser,
    controllerGetUser,
    controllerDeleteUser,
};
