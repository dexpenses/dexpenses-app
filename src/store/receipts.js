import firebase from 'firebase/app';
import Vue from 'vue';
import { firebaseAction } from 'vuexfire';

/* eslint-disable no-param-reassign */
export default {
  namespaced: true,
  state: {
    openReceipts: [],
    receipts: [],
    $lastReceipt: null,
    $page: 0,
    endReached: false,
    loading: false,
  },
  getters: {
    pendingReceiptsCount(state) {
      return !state.receipts
        ? null
        : state.receipts.filter(r => !r.result || r.result === 'pending').length;
    },
  },
  mutations: {
    addReceipt(state, receipt) {
      state.receipts.push(receipt);
    },
    removeReceipt(state, index) {
      state.receipts.splice(index, 1);
    },
    setReceipt(state, { index, receipt }) {
      Vue.set(state.receipts, index, receipt);
    },
    insertReceipt(state, { index, receipt }) {
      state.receipts.splice(index, 0, receipt);
    },
    nextPage(state, $lastReceipt) {
      state.$page += 1;
      state.$lastReceipt = $lastReceipt;
    },
    setEndReached(state, endReached) {
      state.endReached = endReached;
    },
    setLoading(state, loading) {
      state.loading = loading;
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
    loadReceipts({ rootState, commit, state }) {
      if (state.endReached) {
        return;
      }
      let query = firebase
        .firestore()
        .collection('receiptsByUser')
        .doc(rootState.user.user.uid)
        .collection('receipts')
        .where('result.state', '==', 'ready')
        .orderBy('result.data.date', 'desc')
        .orderBy('result.data.time', 'desc');
      if (state.$lastReceipt) {
        query = query.startAfter(...state.$lastReceipt);
      }
      commit('setLoading', true);
      let first = true;
      const offset = state.$page * 10;
      query.limit(10).onSnapshot({
        next(snapshot) {
          const docChanges = snapshot.docChanges();
          if (first) {
            commit('setLoading', false);

            if (!docChanges || docChanges.length !== 10) {
              commit('setEndReached', true);
            } else {
              const last = docChanges[docChanges.length - 1].doc.data();
              commit('nextPage', [last.result.data.date, last.result.data.time]);
            }

            first = false;
          }
          docChanges.forEach(docChange => {
            const receipt = { id: docChange.doc.id, ...docChange.doc.data() };
            switch (docChange.type) {
              case 'added':
                commit('insertReceipt', {
                  index: docChange.newIndex + offset,
                  receipt,
                });
                break;
              case 'removed':
                commit('removeReceipt', docChange.oldIndex + offset);
                break;
              case 'modified':
                if (docChange.oldIndex === docChange.newIndex) {
                  commit('setReceipt', {
                    index: docChange.newIndex + offset,
                    receipt,
                  });
                } else {
                  commit('removeReceipt', docChange.oldIndex + offset);
                  commit('insertReceipt', {
                    index: docChange.newIndex + offset,
                    receipt,
                  });
                }
                break;
              default:
                console.error('never happens');
            }
          });
        },
      });
    },
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
