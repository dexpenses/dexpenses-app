import { firestoreAction } from 'vuexfire';

export default function firebaseBindAction(name, queryOrRefFactory) {
  return firestoreAction(async context => {
    const { bindFirestoreRef, dispatch, commit } = context;
    commit('setLoading', [name, true]);
    await dispatch('user/checkLoggedIn', {}, { root: true });
    await bindFirestoreRef(name, queryOrRefFactory(context));
    commit('setLoading', [name, false]);
  });
}
