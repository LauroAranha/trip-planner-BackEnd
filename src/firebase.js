import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

import * as dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.FIREBASE_APIKEY;
const authDomain = process.env.FIREBASE_AUTHDOMAIN;
const projectId = process.env.FIREBASE_PROJECTID;
const storageBucket = process.env.FIREBASE_STORAGEBUCKET;
const messagingSenderId = process.env.FIREBASE_MESSAGINGSENDERID;
const appId = process.env.FIREBASE_APPID;

// Initialize Firebase
const app = initializeApp({
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
});

export const db = getFirestore(app);
export const auth = getAuth(app);
