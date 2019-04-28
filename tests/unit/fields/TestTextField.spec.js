import Vue from 'vue';
import Vuetify from 'vuetify';
import { mount } from '@vue/test-utils';

Vue.use(Vuetify, {}); // should actually use localVue, but that causes a console error atm

describe('Test text field', () => {
  it('should work', done => {
    const wrapper = mount({
      template: `<v-text-field @input="$emit('input', {data: $event})" mask="##/##" />`,
    });
    wrapper.find('input').setValue('12/34');
    expect(wrapper.element).toMatchSnapshot();
    wrapper.vm.$nextTick(() => {
      expect(wrapper.emitted().input).toBeTruthy();
      done();
    });

    // console.log(wrapper.emitted().input);
  });
});
