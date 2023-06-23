import { initializeApp } from 'firebase/app';
import { initializeFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { FirebaseApp, FirebaseOptions } from 'firebase/app';

type FirebaseConfig = FirebaseOptions;

const firebaseConfig: FirebaseConfig = {
  apiKey: 'AIzaSyCcCflE-JOwuVjSJ9p50Kvxg10aHezvHOs',
  authDomain: 'chatly-72fa8.firebaseapp.com',
  projectId: 'chatly-72fa8',
  storageBucket: 'chatly-72fa8.appspot.com',
  messagingSenderId: '656243952145',
  appId: '1:656243952145:web:03682cd8f932e3ad617fb0',
};

const app: FirebaseApp = initializeApp(firebaseConfig);

const auth: Auth = getAuth(app);
const db: Firestore = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export { db, auth };
