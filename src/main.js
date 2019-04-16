import Vue from 'vue';
import './plugins/vuetify';
import VueViewer from 'v-viewer';
import App from './App.vue';
import router from './router';
import store from './store';
import './firebase';
import './filters';
import './directives';

import 'viewerjs/dist/viewer.css';
import './styles.css';

Vue.use(VueViewer);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
