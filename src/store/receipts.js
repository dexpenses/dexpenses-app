import firebase from 'firebase/app';
import { firestoreAction } from 'vuexfire';
import firebaseBindAction from './firebase-bind-action';

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
    loadOpenReceipts: firebaseBindAction('openReceipts', ({ rootState }) =>
      firebase
        .firestore()
        .collection('receiptsByUser')
        .doc(rootState.user.user.uid)
        .collection('receipts')
        .where('result.state', '==', 'partial')
    ),
    loadReceipts: firebaseBindAction('receipts', ({ rootState }) =>
      firebase
        .firestore()
        .collection('receiptsByUser')
        .doc(rootState.user.user.uid)
        .collection('receipts')
        .where('result.state', '==', 'ready')
        .orderBy('result.data.timestamp', 'desc')
        .limit(20)
    ),
    loadPendingReceipts: firebaseBindAction('pendingReceipts', ({ rootState }) =>
      firebase
        .firestore()
        .collection('receiptsByUser')
        .doc(rootState.user.user.uid)
        .collection('receipts')
        .where('result.state', '==', 'pending')
    ),
    unbindReceipts: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef('openReceipts');
      unbindFirestoreRef('pendingReceipts');
      unbindFirestoreRef('receipts');
    }),
    updateReceipt({ rootState }, { id, field, value }) {
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
