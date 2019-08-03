import Vue from 'vue';
import Vuetify from 'vuetify';
import { mount } from '@vue/test-utils';
import i18n from '@/i18n'
import PaymentMethodInput from '@/components/fields/PaymentMethodInput.vue';

Vue.use(Vuetify, {}); // should actually use localVue, but that causes a console error atm
// const app = document.createElement('div');
// app.setAttribute('data-app', true);
// document.body.appendChild(app);

describe('PaymentMethodInput.vue', () => {
  it('should render correctly', () => {
    const wrapper = mount(PaymentMethodInput, {i18n});
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should render correctly with value', () => {
    const wrapper = mount(PaymentMethodInput, {
      i18n,
      propsData: {
        value: 'DEBIT',
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should trigger input event if user selects new item', () => {
    const wrapper = mount(PaymentMethodInput,{i18n});
    wrapper.find('.v-select__slot').trigger('click');
    wrapper.find('.v-list__tile').trigger('click'); // click first item: DEBIT

    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input[0]).toHaveLength(1);
    expect(wrapper.emitted().input[0][0]).toEqual('DEBIT');
  });

  it('should not trigger input event if new value is set programmatically', () => {
    const wrapper = mount(PaymentMethodInput, {i18n,
      propsData: {
        value: 'DEBIT',
      },
    });
    expect(wrapper.element).toMatchSnapshot();
    wrapper.setProps({
      value: 'CREDIT',
    });
    expect(wrapper.element).toMatchSnapshot();
    expect(wrapper.emitted().input).toBeFalsy();
  });

  it('should update v-model correctly', () => {
    const wrapper = mount({
      template: '<PaymentMethodInput v-model="modelValue"></PaymentMethodInput>',
      data: () => ({
        modelValue: null,
      }),
      components: {
        PaymentMethodInput,
      },
    }, {i18n});

    wrapper.find('.v-select__slot').trigger('click');
    wrapper.find('.v-list__tile').trigger('click'); // click first item: DEBIT

    expect(wrapper.vm.modelValue).toEqual('DEBIT');
    expect(wrapper.element).toMatchSnapshot();
  });
});
