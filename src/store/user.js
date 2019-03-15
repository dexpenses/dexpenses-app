import firebase from 'firebase/app';
import router from '@/router';

/* eslint-disable no-param-reassign */
export default {
  namespaced: true,
  state: {
    user: null
  },
  getters: {
    isAuthenticated: state => state.user != null
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    }
  },
  actions: {
    async checkLoggedIn({ commit, dispatch }) {
      await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      return new Promise(resolve => {
        firebase.auth().onAuthStateChanged(user => {
          if (user) {
            commit('setUser', user);
            dispatch('receipts/loadReceipts', {}, { root: true });
          }
          resolve(user);
        });
      });
    },
    login({ commit, dispatch }) {
      firebase
        .auth()
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(result => {
          commit('setUser', result.user);
          dispatch('receipts/loadReceipts', {}, { root: true });
          router.push('dashboard');
        })
        .catch(error => {
          console.error(error);
        });
    },
    async logout({ commit }) {
      await firebase.auth().signOut();
      commit('setUser', null);
      router.push({ name: 'home' });
    }
  }
};
