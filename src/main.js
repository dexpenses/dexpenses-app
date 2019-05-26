import Vue from 'vue';
import './plugins/vuetify';
import VueViewer from 'v-viewer';
import * as VueGoogleMaps from 'vue2-google-maps';
import App from './App.vue';
import router from './router';
import store from './store';
import './firebase';
import './filters';
import './directives';

import 'viewerjs/dist/viewer.css';
import './styles.css';

Vue.use(VueViewer);

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GMAP_API_KEY,
  },
  installComponents: false,
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
