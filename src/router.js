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
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('./views/Dashboard.vue'),
    },
    {
      path: '/recurring',
      name: 'recurring',
      component: () => import('./views/Recurring.vue'),
    },
    {
      path: '/receipts',
      name: 'receipts',
      component: () => import('./views/Receipts.vue'),
    },
    {
      path: '/upload',
      name: 'uploadReceipts',
      component: () => import('./views/UploadReceipts.vue'),
    },
    {
      path: '/rules',
      name: 'rules',
      component: () => import('./views/Rules.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('./views/Settings.vue'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('./views/Search.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('./views/admin/Admin.vue'),
      children: [
        {
          path: 'test-data/upload',
          name: 'adminTestDataUpload',
          component: () => import('./views/admin/UploadTestData.vue'),
        },
        {
          path: 'test-data/new',
          name: 'adminTestDataNew',
          component: () => import('./views/admin/NewTestData.vue'),
        },
        {
          path: 'test-data/browse',
          name: 'adminTestDataBrowse',
          component: () => import('./views/admin/ExploreTestData.vue'),
        },
        {
          path: 'test-data/:path',
          name: 'adminTestDataEdit',
          component: () => import('./views/admin/AddTestData.vue'),
          props: true,
        },
      ],
    },
  ],
});
