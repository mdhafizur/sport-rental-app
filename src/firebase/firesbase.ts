/* eslint-disable max-len */
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  CollectionReference,
  collection,
  DocumentData,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Item } from './types/item.type';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAHJKHGR0c7FUP5CDxi0xPgO2hi9_pgRXw',
  authDomain: 'sport-rental.firebaseapp.com',
  projectId: 'sport-rental',
  storageBucket: 'sport-rental.appspot.com',
  messagingSenderId: '729313606868',
  appId: '1:729313606868:web:2b7020896a829ad62ccf41',
  measurementId: 'G-2P1B77HYY9',
};

// Initialize Firebase
export const App = initializeApp(firebaseConfig);
export const Analytics = getAnalytics(App);
export const auth = getAuth(App);
export const firestore = getFirestore(App);
export const storage = getStorage(App);

// This is just a helper to add the type to the db responses
const createCollection = <T = DocumentData>(collectionName: string) =>
  collection(firestore, collectionName) as CollectionReference<T>;

export const usersCol = createCollection<any>('users');
export const itemsCol = createCollection<Item>('items');
