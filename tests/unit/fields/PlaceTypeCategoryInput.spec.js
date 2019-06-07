import { mount } from '@vue/test-utils';
import Vue from 'vue';
import Vuetify from 'vuetify';
import PlaceTypeCategoryInput from '@/components/fields/PlaceTypeCategoryInput.vue';

Vue.use(Vuetify);

describe('PlaceTypeCategoryInput.vue', () => {
  it('should renders correctly', () => {
    const wrapper = mount(PlaceTypeCategoryInput);
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should render correctly with value', () => {
    const wrapper = mount(PlaceTypeCategoryInput, {
      propsData: {
        value: 'food',
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should trigger input event if user selects new item', () => {
    const wrapper = mount(PlaceTypeCategoryInput);
    wrapper.find('.v-select__slot').trigger('click');
    wrapper.find('.v-list__tile').trigger('click'); // click first item

    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input[0]).toHaveLength(1);
    expect(wrapper.emitted().input[0][0]).toEqual('barber');
  });

  it('should not trigger input event if new value is set programmatically', () => {
    const wrapper = mount(PlaceTypeCategoryInput, {
      propsData: {
        value: 'food',
      },
    });
    expect(wrapper.element).toMatchSnapshot();
    wrapper.setProps({
      value: 'barber',
    });
    expect(wrapper.element).toMatchSnapshot();
    expect(wrapper.emitted().input).toBeFalsy();
  });

  it('should update v-model correctly', () => {
    const wrapper = mount({
      template: '<PlaceTypeCategoryInput v-model="modelValue"/>',
      data: () => ({
        modelValue: null,
      }),
      components: {
        PlaceTypeCategoryInput,
      },
    });

    wrapper.find('.v-select__slot').trigger('click');
    wrapper.find('.v-list__tile').trigger('click'); // click first item

    expect(wrapper.vm.modelValue).toEqual('barber');
    expect(wrapper.element).toMatchSnapshot();
  });
});
