import firebase from 'firebase/app';
import { firebaseAction } from 'vuexfire';

/* eslint-disable no-param-reassign */
export default {
  namespaced: true,
  state: {
    receipts: []
  },
  getters: {
    pendingReceiptsCount(state) {
      return !state.receipts
        ? null
        : state.receipts.filter(r => !r.result || r.result === 'pending').length;
    }
  },
  actions: {
    loadReceipts: firebaseAction(({ bindFirebaseRef, rootState }) => {
      bindFirebaseRef(
        'receipts',
        firebase
          .firestore()
          .collection('receiptsByUser')
          .doc(rootState.user.user.uid)
          .collection('receipts')
          .orderBy('result.data.date', 'desc')
          .limit(10)
      ).catch(error => console.error(error));
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
              data: { [field]: value }
            }
          },
          { merge: true }
        );
    }
  }
};
