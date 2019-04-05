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
    const holdStart = () => {
      timeout = setTimeout(() => {
        timeout = null;
        el.dispatchEvent(new Event('dblclickorhold'));
      }, holdDuration);
    };
    el.addEventListener('mousedown', holdStart);
    el.addEventListener('touchstart', e => {
      e.preventDefault();
      holdStart();
    });
    const cancel = () => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
    };
    el.addEventListener('mouseup', cancel);
    el.addEventListener('mouseleave', cancel);
    el.addEventListener('touchend', cancel);
  },
});
