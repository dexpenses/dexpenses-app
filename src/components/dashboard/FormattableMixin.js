export default {
  props: {
    format: Object,
    locale: {
      type: String,
      default: 'de-DE'
    }
  },
  computed: {
    nf() {
      return new Intl.NumberFormat(this.locale, this.format || {})
    }
  }
}
