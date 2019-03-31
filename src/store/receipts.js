import firebase from 'firebase/app';
import { firebaseAction } from 'vuexfire';

/* eslint-disable no-param-reassign */
export default {
  namespaced: true,
  state: {
    openReceipts: [],
    receipts: [],
  },
  getters: {
    pendingReceiptsCount(state) {
      return !state.receipts
        ? null
        : state.receipts.filter(r => !r.result || r.result === 'pending').length;
    },
  },
  actions: {
    loadOpenReceipts: firebaseAction(({ bindFirebaseRef, rootState }) => {
      bindFirebaseRef(
        'openReceipts',
        firebase
          .firestore()
          .collection('receiptsByUser')
          .doc(rootState.user.user.uid)
          .collection('receipts')
          .where('result.data.date', '==', null)
      );
    }),
    loadReceipts: firebaseAction(({ bindFirebaseRef, rootState }) => {
      bindFirebaseRef(
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
