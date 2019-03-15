import Vue from 'vue';
import Vuex from 'vuex';
import { firebaseMutations } from 'vuexfire';
import receipts from './receipts';
import user from './user';

Vue.use(Vuex);
/* eslint-disable no-param-reassign */
export default new Vuex.Store({
  mutations: {
    ...firebaseMutations
  },
  modules: {
    user,
    receipts
  }
});
