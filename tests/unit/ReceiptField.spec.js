import Vue from 'vue';
import Vuetify from 'vuetify';
import { shallowMount, mount } from '@vue/test-utils';
import ReceiptField from '@/components/ReceiptField.vue';

Vue.use(Vuetify, {}); // should actually use localVue, but that causes a console error atm

describe('ReceiptField.vue', () => {
  it('should render correctly', () => {
    const wrapper = shallowMount(ReceiptField, {
      propsData: {
        field: 'field',
        icon: 'icon',
        receipt: {
          result: {
            data: {
              field: 'value',
            },
          },
        },
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should apply the provided filter', () => {
    const wrapper = shallowMount(ReceiptField, {
      propsData: {
        field: 'field',
        icon: 'icon',
        receipt: {
          result: {
            data: {
              field: 'value',
            },
          },
        },
        filter: 'uppercase',
      },
      filters: {
        uppercase(v) {
          return v ? v.toUpperCase() : v;
        },
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should show red icon if required value is missing', () => {
    const wrapper = shallowMount(ReceiptField, {
      propsData: {
        field: 'field',
        icon: 'icon',
        receipt: {
          result: {
            data: {
              field: undefined,
            },
          },
        },
        required: true,
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should enter edit mode on double-click of the text', () => {
    const wrapper = mount(ReceiptField, {
      propsData: {
        field: 'field',
        icon: 'icon',
        receipt: {
          result: {
            data: {
              field: 'value',
            },
          },
        },
      },
      stubs: {
        'v-form': true, // real mount of v-form causes inexplicable internal error
      },
    });
    expect(wrapper.element).toMatchSnapshot();
    wrapper.find('.receipt-field-value .fixed').trigger('dblclick');
    expect(wrapper.element).toMatchSnapshot();
  });
});
