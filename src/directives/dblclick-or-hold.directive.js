import Vue from 'vue';

Vue.directive('dblclickOrHold', {
  bind(el, binding) {
    el.addEventListener('dblclick', () => binding.value());

  },
})