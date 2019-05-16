import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/performance';

const config = {
  apiKey: 'AIzaSyCR0QS9ZNiuBIjv70wl3m1PJrkWrDVxrEU',
  authDomain: 'dexpenses-207219.firebaseapp.com',
  databaseURL: 'https://dexpenses-207219.firebaseio.com',
  projectId: 'dexpenses-207219',
  storageBucket: 'dexpenses-207219.appspot.com',
  messagingSenderId: '45657867106',
  appId: '1:45657867106:web:b582be708a26239e',
};
firebase.initializeApp(config);
firebase.performance();
