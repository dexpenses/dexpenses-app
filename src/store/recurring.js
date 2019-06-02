import firebase from 'firebase/app';
import { firestoreAction } from 'vuexfire';
import firebaseBindAction from './firebase-bind-action';

/* eslint-disable no-param-reassign */
export default {
  namespaced: true,
  state: {
    recurringPayments: [],
    loading: false,
  },
  mutations: {
    setLoading(state, [, loading]) {
      state.loading = loading;
    },
  },
  actions: {
    load: firebaseBindAction('recurringPayments', ({ rootState }) =>
      firebase
        .firestore()
        .collection('recurringPaymentsByUser')
        .doc(rootState.user.user.uid)
        .collection('recurringPayments')
    ),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef('recurringPayments');
    }),
  },
};
