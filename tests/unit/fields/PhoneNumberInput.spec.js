import { createLocalVue, mount } from '@vue/test-utils';
import createVuetify from '../vuetify';
import i18n from '@/i18n';
import PhoneNumberInput from '@/components/fields/PhoneNumberInput.vue';

const localVue = createLocalVue();

describe('PhoneNumberInput', () => {
  let vuetify;
  beforeEach(() => {
    vuetify = createVuetify();
  });

  it('should render correctly', () => {
    const wrapper = mount(PhoneNumberInput, {
      propsData: {
        value: '+491234567890',
      },
      localVue,
      vuetify,
      i18n,
    });
    expect(wrapper.element).toMatchSnapshot();

    expect(wrapper.find('input').element.value).toBe('+491234567890');
  });

  it('should show country code prefix hint', async () => {
    const wrapper = mount(
      {
        template: '<PhoneNumberInput v-model="value" country-prefix-hint />',
        data: () => ({ value: '01234567890' }),
        components: { PhoneNumberInput },
      },
      {
        localVue,
        vuetify,
        i18n,
      }
    );
    wrapper.find('input').element.focus();
    expect(wrapper.element).toMatchSnapshot('show hint');
    wrapper.find('input').setValue('+491234567890');
    expect(wrapper.element).toMatchSnapshot('hide hint');
  });

  it('should show error', async () => {
    const wrapper = mount(PhoneNumberInput, {
      propsData: {
        value: '+491234567890',
      },
      localVue,
      vuetify,
      i18n,
    });
    wrapper.find('input').setValue('+4912');
    await wrapper.vm.$nextTick(); // wait for validation changes
    expect(wrapper.element).toMatchSnapshot();
  });
});
