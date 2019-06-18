import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

// function loadLocaleMessages() {
//   const locales = require.context('./i18n', true, /[A-Za-z0-9-_,\s]+\.json$/i);
//   const messages = {};
//   locales.keys().forEach(key => {
//     const matched = key.match(/([A-Za-z0-9-_]+)\./i);
//     if (matched && matched.length > 1) {
//       const locale = matched[1];
//       messages[locale] = locales(key);
//     }
//   });
//   return messages;
// }
const locale = process.env.VUE_APP_I18N_LOCALE || 'en';

const loadedLanguages = [locale];

VueI18n.prototype.setLanguageAsync = async function setLanguageAsync(lang) {
  if (this.locale === lang) {
    return;
  }
  if (!loadedLanguages.includes(lang)) {
    const msgs = await import(/* webpackChunkName: "lang-[request]" */ `@/i18n/${lang}`);
    this.setLocaleMessage(lang, msgs.default);
    loadedLanguages.push(lang);
  }
  this.locale = lang;
  document.querySelector('html').setAttribute('lang', lang);
};
export default new VueI18n({
  locale,
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: {
    /* eslint-disable-next-line import/no-dynamic-require,global-require */ // default language controlled by .env
    [locale]: require(`@/i18n/${locale}.json`),
  },
});
