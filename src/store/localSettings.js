export function loadDarkTheme() {
  const p = localStorage.getItem('dark');
  return !!p && !!JSON.parse(p);
}

/* eslint-disable no-param-reassign */
export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    setDarkTheme(context, { $vuetify, dark }) {
      $vuetify.theme.dark = dark;
      localStorage.setItem('dark', JSON.stringify(dark));
    },
  },
};
