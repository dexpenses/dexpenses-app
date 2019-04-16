import firebase from 'firebase/app';
import { firebaseAction } from 'vuexfire';

function bindReceiptsAction(name, queryOrRefFactory) {
  return firebaseAction(async ({ bindFirebaseRef, rootState, dispatch, commit }) => {
    commit('setLoading', [name, true]);
    await dispatch('user/checkLoggedIn', {}, { root: true });
    await bindFirebaseRef(name, queryOrRefFactory(rootState));
    commit('setLoading', [name, false]);
  });
}

/* eslint-disable no-param-reassign */
export default {
  namespaced: true,
  state: {
    openReceipts: [],
    receipts: [],
    pendingReceipts: [],
    loading: {
      openReceipts: false,
      receipts: false,
      pendingReceipts: false,
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
    loadOpenReceipts: bindReceiptsAction('openReceipts', rootState =>
      firebase
        .firestore()
        .collection('receiptsByUser')
        .doc(rootState.user.user.uid)
        .collection('receipts')
        .where('result.state', '==', 'partial')
    ),
    loadReceipts: bindReceiptsAction('receipts', rootState =>
      firebase
        .firestore()
        .collection('receiptsByUser')
        .doc(rootState.user.user.uid)
        .collection('receipts')
        .where('result.state', '==', 'ready')
        .orderBy('result.data.timestamp', 'desc')
        .limit(20)
    ),
    loadPendingReceipts: bindReceiptsAction('pendingReceipts', rootState =>
      firebase
        .firestore()
        .collection('receiptsByUser')
        .doc(rootState.user.user.uid)
        .collection('receipts')
        .where('result.state', '==', 'pending')
    ),
    unbindReceipts: firebaseAction(({ unbindFirebaseRef }) => {
      unbindFirebaseRef('openReceipts');
      unbindFirebaseRef('pendingReceipts');
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
