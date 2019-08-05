import firebase from 'firebase/app';
import { firestoreAction } from 'vuexfire';
import firebaseBindAction from './firebase-bind-action';

/* eslint-disable no-param-reassign */
export default {
  namespaced: true,
  state: {
    rules: [],
    loading: false,
  },
  getters: {
    rulesRef(_state, _getters, rootState) {
      if (!rootState.user.user) {
        return null;
      }
      return firebase
        .firestore()
        .collection('rulesByUser')
        .doc(rootState.user.user.uid)
        .collection('rules');
    },
  },
  mutations: {
    setLoading(state, [, loading]) {
      state.loading = loading;
    },
  },
  actions: {
    loadRules: firebaseBindAction('rules', ({ getters }) =>
      getters.rulesRef.orderBy('last_updated', 'desc')
    ),
    unbindRules: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef('rules');
    }),
  },
};
