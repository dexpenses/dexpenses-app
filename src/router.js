import Vue from 'vue';
import Router from 'vue-router';
import store from './store';

Vue.use(Router);

async function authGuard(to, from, next) {
  const user = await store.dispatch('user/checkLoggedIn');
  if (!user) {
    next({ name: 'home' });
  } else {
    next();
  }
}

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
      beforeEnter: authGuard,
    },
    {
      path: '/recurring',
      name: 'recurring',
      component: () => import('./views/Recurring.vue'),
      beforeEnter: authGuard,
    },
    {
      path: '/receipts',
      name: 'receipts',
      component: () => import('./views/Receipts.vue'),
      beforeEnter: authGuard,
    },
    {
      path: '/upload',
      name: 'uploadReceipts',
      component: () => import('./views/UploadReceipts.vue'),
      beforeEnter: authGuard,
    },
    {
      path: '/rules',
      name: 'rules',
      component: () => import('./views/Rules.vue'),
      beforeEnter: authGuard,
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('./views/Settings.vue'),
      beforeEnter: authGuard,
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('./views/Search.vue'),
      beforeEnter: authGuard,
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('./views/admin/Admin.vue'),
      beforeEnter: authGuard,
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
