import Vue from 'vue';

Vue.directive('dblclickOrHold', {
  bind(el, binding) {
    /*
     * dblclick event
     */
    el.addEventListener('dblclick', () => {
      el.dispatchEvent(new Event('dblclickorhold'));
    });
    /*
     * Hold event
     */
    const holdDuration = binding.value || 500;
    let timeout;
    el.addEventListener('mousedown', e => {
      if (e.button !== 0) {
        return;
      }
      timeout = setTimeout(() => {
        timeout = null;
        el.dispatchEvent(new Event('dblclickorhold'));
      }, holdDuration);
    });
    const cancel = () => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
    };
    el.addEventListener('mouseup', cancel);
    el.addEventListener('mouseleave', cancel);
  },
});
