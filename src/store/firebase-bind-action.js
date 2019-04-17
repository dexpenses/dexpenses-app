import { firebaseAction } from 'vuexfire';

export default function firebaseBindAction(name, queryOrRefFactory) {
  return firebaseAction(async context => {
    const { bindFirebaseRef, dispatch, commit } = context;
    commit('setLoading', [name, true]);
    await dispatch('user/checkLoggedIn', {}, { root: true });
    await bindFirebaseRef(name, queryOrRefFactory(context));
    commit('setLoading', [name, false]);
  });
}
