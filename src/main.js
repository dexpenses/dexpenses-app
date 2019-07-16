import Vue from 'vue';
import './plugins/vuetify';
import VueViewer from 'v-viewer';
import * as VueGoogleMaps from 'vue2-google-maps';
import VeeValidate from 'vee-validate'
import App from './App.vue';
import router from './router';
import store from './store';
import './firebase';
import './filters';
import './directives';

import 'viewerjs/dist/viewer.css';
import './styles.css';
import i18n from './i18n'

Vue.use(VueViewer);

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GMAP_API_KEY,
    libraries: 'places',
  },
  installComponents: false,
});

Vue.use(VeeValidate, {
  i18nRootKey: 'validations',
  i18n,
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
