import { mount } from '@vue/test-utils';
import Vue from 'vue';
import Vuetify from 'vuetify';
import PlaceTypeInput from '@/components/fields/PlaceTypeInput.vue';

Vue.use(Vuetify);

describe('PlaceTypeInput.vue', () => {
  it('should renders correctly', () => {
    const wrapper = mount(PlaceTypeInput);
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should render correctly with value', () => {
    const wrapper = mount(PlaceTypeInput, {
      propsData: {
        value: 'supermarket',
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should trigger input event if user selects new item', () => {
    const wrapper = mount(PlaceTypeInput);
    wrapper.find('.v-select__slot').trigger('click');
    wrapper.find('.v-list__tile').trigger('click'); // click first item

    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input[0]).toHaveLength(1);
    expect(wrapper.emitted().input[0][0]).toEqual('accounting');
  });

  it('should not trigger input event if new value is set programmatically', () => {
    const wrapper = mount(PlaceTypeInput, {
      propsData: {
        value: 'supermarket',
      },
    });
    expect(wrapper.element).toMatchSnapshot();
    wrapper.setProps({
      value: 'theater',
    });
    expect(wrapper.element).toMatchSnapshot();
    expect(wrapper.emitted().input).toBeFalsy();
  });

  it('should update v-model correctly', () => {
    const wrapper = mount({
      template: '<PlaceTypeInput v-model="modelValue"/>',
      data: () => ({
        modelValue: null,
      }),
      components: {
        PlaceTypeInput,
      },
    });

    wrapper.find('.v-select__slot').trigger('click');
    wrapper.find('.v-list__tile').trigger('click'); // click first item

    expect(wrapper.vm.modelValue).toEqual('accounting');
    expect(wrapper.element).toMatchSnapshot();
  });
});
