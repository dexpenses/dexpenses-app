import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations } from 'vuexfire';
import receipts from './receipts';
import user from './user';
import recurring from './recurring';
import rules from './rules';
import localSettings from './localSettings';

Vue.use(Vuex);
/* eslint-disable no-param-reassign */
export default new Vuex.Store({
  mutations: {
    ...vuexfireMutations,
  },
  modules: {
    user,
    receipts,
    recurring,
    rules,
    localSettings,
  },
});
