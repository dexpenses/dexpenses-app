import firebase from 'firebase/app';

export const aggregateTotalOverTimePeriod = firebase
  .functions()
  .httpsCallable('aggregateTotalOverTimePeriod');

export const aggregateTotal = firebase.functions().httpsCallable('aggregateTotal');
