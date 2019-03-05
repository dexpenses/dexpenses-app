import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase/app';
import { firebaseMutations, firebaseAction } from 'vuexfire';
import router from '@/router';

Vue.use(Vuex);
/* eslint-disable no-param-reassign */
export default new Vuex.Store({
  state: {
    user: null,
    receipts: [],
  },
  getters: {
    isAuthenticated: state => state.user != null,
    pendingReceiptsCount(state) {
      return !state.receipts
        ? null
        : state.receipts.filter(r => !r.result || r.result === 'pending').length;
    },
  },
  mutations: {
    ...firebaseMutations,
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    loadReceipts: firebaseAction(({ bindFirebaseRef, state }) => {
      bindFirebaseRef(
        'receipts',
        firebase
          .firestore()
          .collection('receiptsByUser')
          .doc(state.user.uid)
          .collection('receipts'),
      ).catch(error => console.error(error));
    }),
    async checkLoggedIn({ commit, dispatch }) {
      await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      return new Promise((resolve) => {
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            console.log(user);
            commit('setUser', user);
            dispatch('loadReceipts');
          }
          resolve(user);
        });
      });
    },
    login({ commit, dispatch }) {
      firebase
        .auth()
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((result) => {
          commit('setUser', result.user);
          dispatch('loadReceipts');
          router.push('dashboard');
        })
        .catch((error) => {
          console.error(error);
        });
    },
    async logout({ commit }) {
      await firebase.auth().signOut();
      commit('setUser', null);
      router.push({ name: 'home' });
    },
  },
});
