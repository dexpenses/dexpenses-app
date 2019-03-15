import Vue from 'vue';
import Router from 'vue-router';
import store from './store';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/Home.vue'),
      async beforeEnter(to, from, next) {
        const user = await store.dispatch('user/checkLoggedIn');
        if (!user) {
          next();
        } else {
          next('dashboard');
        }
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('./views/Dashboard.vue')
    },
    {
      path: '/receipts',
      name: 'receipts',
      component: () => import('./views/Receipts.vue')
    },
    {
      path: '/upload',
      name: 'uploadReceipts',
      component: () => import('./views/UploadReceipts.vue')
    }
  ]
});
