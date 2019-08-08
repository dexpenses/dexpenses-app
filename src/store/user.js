import firebase from 'firebase/app';
import { firestoreAction } from 'vuexfire';

/* eslint-disable no-param-reassign */
export default {
  namespaced: true,
  state: {
    user: null,
    checkLoggedIn$: null,
    userData: null,
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
    async checkLoggedIn({ commit, state, dispatch }) {
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
                dispatch('loadUserData');
              }
              commit('setCheckLoggedIn$', null);
              resolve(user);
            });
          });
        });
      commit('setCheckLoggedIn$', checkLoggedIn$);
      return checkLoggedIn$;
    },
    login({ commit, dispatch }, { $router }) {
      firebase
        .auth()
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(result => {
          commit('setUser', result.user);
          dispatch('loadUserData');
          $router.push('dashboard');
        })
        .catch(error => {
          console.error(error);
        });
    },
    async logout({ commit }, { $router }) {
      await firebase.auth().signOut();
      commit('setUser', null);
      $router.push({ name: 'home' });
    },
    loadUserData: firestoreAction(({ bindFirestoreRef, state }) => {
      bindFirestoreRef(
        'userData',
        firebase
          .firestore()
          .collection('users')
          .doc(state.user.uid)
      );
    }),
  },
};
