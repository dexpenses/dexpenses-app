import { createLocalVue, mount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import PhoneNumberInput from '@/components/fields/PhoneNumberInput.vue';

const localVue = createLocalVue();

describe('PhoneNumberInput', () => {
  let vuetify;
  beforeEach(() => {
    vuetify = new Vuetify({
      icons: {
        iconfont: 'md',
      },
    });
  });

  it('should render correctly', () => {
    const wrapper = mount(PhoneNumberInput, {
      propsData: {
        value: '+491234567890',
      },
      localVue,
      vuetify,
    });
    expect(wrapper.element).toMatchSnapshot();

    expect(wrapper.find('input').element.value).toBe('+491234567890');
  });

  it('should show country code prefix hint', async () => {
    const wrapper = mount(PhoneNumberInput, {
      propsData: {
        value: '01234567890',
        countryPrefixHint: true,
      },
      localVue,
      vuetify,
    });
    wrapper.find('input').element.focus();
    expect(wrapper.element).toMatchSnapshot(); // show hint
    wrapper.find('input').setValue('+491234567890');
    expect(wrapper.element).toMatchSnapshot(); // hide hint
  });

  it('should show save and restore button if changes are made', () => {
    const wrapper = mount(PhoneNumberInput, {
      propsData: {
        value: '+491234567890',
      },
      localVue,
      vuetify,
    });
    expect(wrapper.element).toMatchSnapshot(); // no buttons
    wrapper.find('input').setValue('+491234567891');
    expect(wrapper.element).toMatchSnapshot(); // with buttons
  });

  it('should show save and restore button if input is cleared', () => {
    const wrapper = mount(PhoneNumberInput, {
      propsData: {
        value: '+491234567890',
      },
      localVue,
      vuetify,
    });
    expect(wrapper.element).toMatchSnapshot(); // no buttons
    wrapper.find('input').setValue('');
    expect(wrapper.element).toMatchSnapshot(); // with buttons
  });

  it('should show error and hide save button', async () => {
    const wrapper = mount(PhoneNumberInput, {
      propsData: {
        value: '+491234567890',
      },
      localVue,
      vuetify,
    });
    wrapper.find('input').setValue('+4912');
    await wrapper.vm.$nextTick(); // wait for validation changes
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should restore saved value', () => {
    const wrapper = mount(PhoneNumberInput, {
      propsData: {
        value: '+491234567890',
      },
      localVue,
      vuetify,
    });
    wrapper.find('input').setValue('+491234567891');
    const clear = wrapper.findAll('i').wrappers.find(w => w.text() === 'clear');
    expect(clear).toBeDefined();
    clear.trigger('click');
    expect(wrapper.element).toMatchSnapshot();
    expect(wrapper.vm.model).toBe('+491234567890');
  });

  it('should save value', () => {
    const saveCallback = jest.fn();
    const wrapper = mount(PhoneNumberInput, {
      propsData: {
        value: '+491234567890',
      },
      listeners: {
        save: saveCallback,
      },
      localVue,
      vuetify,
    });
    wrapper.find('input').setValue('+491234567891');
    const save = wrapper.findAll('i').wrappers.find(w => w.text() === 'save');
    expect(save).toBeDefined();
    save.trigger('click');
    expect(saveCallback).toHaveBeenCalled();
    wrapper.setProps({ value: '+491234567891' }); // assume persistent value
    expect(wrapper.element).toMatchSnapshot(); // clean state after save
  });
});
