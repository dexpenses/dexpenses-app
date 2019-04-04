import firebase from 'firebase/app';
import router from '@/router';

/* eslint-disable no-param-reassign */
export default {
  namespaced: true,
  state: {
    user: null,
    checkLoggedIn$: null,
  },
  getters: {
    isAuthenticated: state => state.user != null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setCheckLoggedIn$(state, checkLoggedIn$) {
      state.checkLoggedIn$ = checkLoggedIn$;
    },
  },
  actions: {
    async checkLoggedIn({ commit, state }) {
      if (state.user) {
        return Promise.resolve(state.user);
      }
      if (state.checkLoggedIn$) {
        return state.checkLoggedIn$;
      }
      const checkLoggedIn$ = firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          return new Promise(resolve => {
            firebase.auth().onAuthStateChanged(user => {
              if (user) {
                commit('setUser', user);
              }
              commit('setCheckLoggedIn$', null);
              resolve(user);
            });
          });
        });
      commit('setCheckLoggedIn$', checkLoggedIn$);
      return checkLoggedIn$;
    },
    login({ commit }) {
      firebase
        .auth()
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(result => {
          commit('setUser', result.user);
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
    },
  },
};
