import { mount, createLocalVue } from '@vue/test-utils';
import createVuetify from '../vuetify';
import PlaceTypeCategoryInput from '@/components/fields/PlaceTypeCategoryInput.vue';

const localVue = createLocalVue();

describe('PlaceTypeCategoryInput.vue', () => {
  let vuetify;

  beforeEach(() => {
    vuetify = createVuetify();
  });

  it('should render correctly', () => {
    const wrapper = mount(PlaceTypeCategoryInput, {
      propsData: { eager: true },
      localVue,
      vuetify,
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should render correctly with value', async () => {
    const wrapper = mount(PlaceTypeCategoryInput, {
      propsData: {
        value: 'food',
        eager: true,
      },
      localVue,
      vuetify,
    });
    expect(wrapper.element).toMatchSnapshot(); // food item is active
    await wrapper.vm.$nextTick(); // input value is only present after next tick
    expect(wrapper.find('input').element.value).toBe('Food');
  });

  it('should trigger input event if user selects new item', () => {
    const wrapper = mount(PlaceTypeCategoryInput, {
      propsData: { eager: true },
      localVue,
      vuetify,
    });
    wrapper.find('.v-select__slot').trigger('click');
    wrapper.find('.v-list-item').trigger('click'); // click first item

    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input[0]).toHaveLength(1);
    expect(wrapper.emitted().input[0][0]).toEqual('barber');
  });

  it('should not trigger input event if new value is set programmatically', () => {
    const wrapper = mount(PlaceTypeCategoryInput, {
      propsData: {
        value: 'food',
        eager: true,
      },
      localVue,
      vuetify,
    });
    expect(wrapper.element).toMatchSnapshot();
    wrapper.setProps({
      value: 'barber',
    });
    expect(wrapper.element).toMatchSnapshot();
    expect(wrapper.emitted().input).toBeFalsy();
  });

  it('should update v-model correctly', () => {
    const wrapper = mount(
      {
        template: '<PlaceTypeCategoryInput v-model="modelValue" eager/>',
        data: () => ({
          modelValue: null,
        }),
        components: {
          PlaceTypeCategoryInput,
        },
      },
      { localVue, vuetify }
    );

    wrapper.find('.v-select__slot').trigger('click');
    wrapper.find('.v-list-item').trigger('click'); // click first item

    expect(wrapper.vm.modelValue).toEqual('barber');
    expect(wrapper.element).toMatchSnapshot();
  });
});
