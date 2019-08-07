import { mount, createLocalVue } from '@vue/test-utils';
import createVuetify from '../vuetify';
import i18n from '@/i18n';
import PaymentMethodInput from '@/components/fields/PaymentMethodInput.vue';

const localVue = createLocalVue();

describe('PaymentMethodInput.vue', () => {
  let vuetify;
  beforeEach(() => {
    vuetify = createVuetify();
  });

  it('should render correctly', () => {
    const wrapper = mount(PaymentMethodInput, {
      i18n,
      localVue,
      vuetify,
      propsData: { eager: true },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should render correctly with value', () => {
    const wrapper = mount(PaymentMethodInput, {
      i18n,
      localVue,
      vuetify,
      propsData: {
        value: 'DEBIT',
        eager: true,
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should trigger input event if user selects new item', () => {
    const wrapper = mount(PaymentMethodInput, {
      i18n,
      localVue,
      vuetify,
      propsData: { eager: true },
    });
    wrapper.find('.v-select__slot').trigger('click');
    wrapper.find('.v-list-item').trigger('click'); // click first item: DEBIT

    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input[0]).toHaveLength(1);
    expect(wrapper.emitted().input[0][0]).toEqual('DEBIT');
  });

  it('should not trigger input event if new value is set programmatically', () => {
    const wrapper = mount(PaymentMethodInput, {
      i18n,
      localVue,
      vuetify,
      propsData: {
        value: 'DEBIT',
        eager: true,
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
    const wrapper = mount(
      {
        template: '<PaymentMethodInput v-model="modelValue" eager/>',
        data: () => ({
          modelValue: null,
        }),
        components: {
          PaymentMethodInput,
        },
      },
      { i18n, localVue, vuetify }
    );

    wrapper.find('.v-select__slot').trigger('click');
    wrapper.find('.v-list-item').trigger('click'); // click first item: DEBIT

    expect(wrapper.vm.modelValue).toEqual('DEBIT');
    expect(wrapper.element).toMatchSnapshot();
  });
});
