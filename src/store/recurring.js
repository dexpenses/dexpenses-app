import firebase from 'firebase/app';
import { firebaseAction } from 'vuexfire';

/* eslint-disable no-param-reassign */
export default {
  namespaced: true,
  state: {
    recurringPayments: [],
    loading: false,
  },
  mutations: {
    setLoading(state, loading) {
      state.loading = loading;
    },
  },
  actions: {
    load: firebaseAction(async ({ bindFirebaseRef, rootState, dispatch, commit }) => {
      commit('setLoading', true);
      await dispatch('user/checkLoggedIn', {}, { root: true });
      await bindFirebaseRef(
        'recurringPayments',
        firebase
          .firestore()
          .collection('recurringPaymentsByUser')
          .doc(rootState.user.user.uid)
          .collection('recurringPayments')
      );
      commit('setLoading', false);
    }),
    unbind: firebaseAction(({ unbindFirebaseRef }) => {
      unbindFirebaseRef('recurringPayments');
    }),
  },
};
