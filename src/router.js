import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/receipts',
    },
    {
      path: '/receipts',
      name: 'receipts',
      component: () => import('./views/Receipts.vue'),
    },
    {
      path: '/receipts/upload',
      name: 'uploadReceipts',
      component: () => import('./views/UploadReceipts.vue'),
    },
  ],
});
