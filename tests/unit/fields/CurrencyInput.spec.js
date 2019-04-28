import Vue from 'vue';
import Vuetify from 'vuetify';
import { mount } from '@vue/test-utils';
import CurrencyInput from '@/components/fields/CurrencyInput.vue';

Vue.use(Vuetify, {}); // should actually use localVue, but that causes a console error atm

describe('CurrencyInput.vue', () => {
  it('should render correctly', () => {
    const wrapper = mount(CurrencyInput);
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should render correctly with value', () => {
    const wrapper = mount(CurrencyInput, {
      propsData: {
        value: 'EUR',
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should trigger input event if user selects new item', () => {
    const wrapper = mount(CurrencyInput);
    wrapper.find('.v-select__slot').trigger('click');
    wrapper.find('.v-list__tile').trigger('click'); // click first item: EUR
    expect(wrapper.element).toMatchSnapshot();
    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input[0]).toHaveLength(1);
    expect(wrapper.emitted().input[0][0]).toEqual('EUR');
  });

  it('should not trigger input event if new value is set programmatically', () => {
    const wrapper = mount(CurrencyInput, {
      propsData: {
        value: 'EUR',
      },
    });
    expect(wrapper.element).toMatchSnapshot();
    wrapper.setProps({
      value: 'USD',
    });
    expect(wrapper.element).toMatchSnapshot();
    expect(wrapper.emitted().input).toBeFalsy();
  });

  it('should update v-model correctly', () => {
    const wrapper = mount({
      template: '<CurrencyInput v-model="modelValue"></CurrencyInput>',
      data: () => ({
        modelValue: null,
      }),
      components: {
        CurrencyInput,
      },
    });

    wrapper.find('.v-select__slot').trigger('click');
    wrapper.find('.v-list__tile').trigger('click'); // click first item: EUR

    expect(wrapper.vm.modelValue).toEqual('EUR');
    expect(wrapper.element).toMatchSnapshot();
  });
});
