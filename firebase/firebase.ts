import { initializeApp, getApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

type FirebaseConfig = {
	apiKey: string;
	authDomain: string;
	projectId: string;
	storageBucket: string;
	messagingSenderId: string;
	appId: string;
};

const firebaseConfig: FirebaseConfig = {
	apiKey: 'AIzaSyCcCflE-JOwuVjSJ9p50Kvxg10aHezvHOs',
	authDomain: 'chatly-72fa8.firebaseapp.com',
	projectId: 'chatly-72fa8',
	storageBucket: 'chatly-72fa8.appspot.com',
	messagingSenderId: '656243952145',
	appId: '1:656243952145:web:03682cd8f932e3ad617fb0',
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = initializeFirestore(app, { experimentalForceLongPolling: true });

export { db, auth };