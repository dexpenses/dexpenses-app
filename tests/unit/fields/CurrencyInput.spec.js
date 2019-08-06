import { mount, createLocalVue } from '@vue/test-utils';
import createVuetify from '../vuetify';
import CurrencyInput from '@/components/fields/CurrencyInput.vue';

const localVue = createLocalVue();

describe('CurrencyInput.vue', () => {
  let vuetify;
  beforeEach(() => {
    vuetify = createVuetify();
  });

  it('should render correctly', async () => {
    const wrapper = mount(CurrencyInput, {
      propsData: {
        eager: true, // so the selection option render without clicking the select
      },
      localVue,
      vuetify,
      attachToDocument: true,
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should render correctly with value', () => {
    const wrapper = mount(CurrencyInput, {
      propsData: {
        value: 'EUR',
        eager: true,
      },
      localVue,
      vuetify,
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should trigger input event if user selects new item', () => {
    const wrapper = mount(CurrencyInput, { localVue, vuetify });
    wrapper.find('.v-select__slot').trigger('click');
    wrapper.find('.v-list-item').trigger('click'); // click first item: EUR
    expect(wrapper.element).toMatchSnapshot();
    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input[0]).toHaveLength(1);
    expect(wrapper.emitted().input[0][0]).toEqual('EUR');
  });

  it('should not trigger input event if new value is set programmatically', () => {
    const wrapper = mount(CurrencyInput, {
      propsData: {
        value: 'EUR',
        eager: true,
      },
      localVue,
      vuetify,
    });
    expect(wrapper.element).toMatchSnapshot();
    wrapper.setProps({
      value: 'USD',
    });
    expect(wrapper.element).toMatchSnapshot();
    expect(wrapper.emitted().input).toBeFalsy();
  });

  it('should update v-model correctly', () => {
    const wrapper = mount(
      {
        template: '<CurrencyInput v-model="modelValue" eager></CurrencyInput>',
        data: () => ({
          modelValue: null,
        }),
        components: {
          CurrencyInput,
        },
      },
      { localVue, vuetify }
    );

    wrapper.find('.v-select__slot').trigger('click');
    wrapper.find('.v-list-item').trigger('click'); // click first item: EUR

    expect(wrapper.vm.modelValue).toEqual('EUR');
    expect(wrapper.element).toMatchSnapshot();
  });
});
