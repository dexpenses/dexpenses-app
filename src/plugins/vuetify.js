import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import { loadDarkTheme } from '@/store/localSettings';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'md',
  },
  theme: {
    dark: loadDarkTheme(),
  },
});
