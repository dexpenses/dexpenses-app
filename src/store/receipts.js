import firebase from 'firebase/app';
import { firebaseAction } from 'vuexfire';

/* eslint-disable no-param-reassign */
export default {
  namespaced: true,
  state: {
    openReceipts: [],
    receipts: [],
    loading: {
      openReceipts: false,
      receipts: false,
    },
  },
  getters: {
    pendingReceiptsCount(state) {
      return !state.receipts
        ? null
        : state.receipts.filter(r => !r.result || r.result === 'pending').length;
    },
  },
  mutations: {
    setLoading(state, [what, loading]) {
      state.loading[what] = loading;
    },
  },
  actions: {
    loadOpenReceipts: firebaseAction(async ({ bindFirebaseRef, rootState, dispatch, commit }) => {
      commit('setLoading', ['openReceipts', true]);
      await dispatch('user/checkLoggedIn', {}, { root: true });
      await bindFirebaseRef(
        'openReceipts',
        firebase
          .firestore()
          .collection('receiptsByUser')
          .doc(rootState.user.user.uid)
          .collection('receipts')
          .where('result.data.date', '==', null)
      );
      commit('setLoading', ['openReceipts', false]);
    }),
    loadReceipts: firebaseAction(async ({ bindFirebaseRef, rootState, dispatch, commit }) => {
      commit('setLoading', ['receipts', true]);
      await dispatch('user/checkLoggedIn', {}, { root: true });
      await bindFirebaseRef(
        'receipts',
        firebase
          .firestore()
          .collection('receiptsByUser')
          .doc(rootState.user.user.uid)
          .collection('receipts')
          .where('result.state', '==', 'ready')
          .orderBy('result.data.date', 'desc')
          .orderBy('result.data.time', 'desc')
          .limit(20)
      );
      commit('setLoading', ['receipts', false]);
    }),
    unbindReceipts: firebaseAction(({ unbindFirebaseRef }) => {
      unbindFirebaseRef('openReceipts');
      unbindFirebaseRef('receipts');
    }),
    updateReceipt({ rootState }, { id, field, value }) {
      console.log('updating', id, field, value);
      return firebase
        .firestore()
        .collection('receiptsByUser')
        .doc(rootState.user.user.uid)
        .collection('receipts')
        .doc(id)
        .set(
          {
            result: {
              data: { [field]: value },
            },
          },
          { merge: true }
        );
    },
  },
};
