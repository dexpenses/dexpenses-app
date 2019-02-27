import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase/app';
import { firebaseMutations, firebaseAction } from 'vuexfire';

Vue.use(Vuex);
/* eslint-disable no-param-reassign */
export default new Vuex.Store({
  state: {
    user: null,
    receipts: [],
  },
  getters: {
    isAuthenticated: state => state.user != null,
  },
  mutations: {
    ...firebaseMutations,
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    loadReceipts: firebaseAction(({ bindFirebaseRef, state }) => {
      bindFirebaseRef('receipts', firebase.firestore().collection('receiptsByUser').doc(state.user.uid).collection('receipts'))
        .catch(error => console.error(error));
    }),
    ensureLoggedIn({ commit, dispatch }) {
      firebase.auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              commit('setUser', user);
              dispatch('loadReceipts');
            } else {
              dispatch('login');
            }
          });
        })
        .catch((error) => {
          console.error('error setting firebase auth persistence', error);
          dispatch('login');
        });
    },
    login({ commit, dispatch }) {
      firebase.auth()
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((result) => {
          commit('setUser', result.user);
          dispatch('loadReceipts');
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
