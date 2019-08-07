import { mount, createLocalVue } from '@vue/test-utils';
import createVuetify from '../vuetify';
import PlaceTypeInput from '@/components/fields/PlaceTypeInput.vue';

const localVue = createLocalVue();

describe('PlaceTypeInput.vue', () => {
  let vuetify;
  beforeEach(() => {
    vuetify = createVuetify();
  });

  it('should renders correctly', () => {
    const wrapper = mount(PlaceTypeInput, { propsData: { eager: true }, localVue, vuetify });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should render correctly with value', () => {
    const wrapper = mount(PlaceTypeInput, {
      propsData: {
        value: 'supermarket',
        eager: true,
      },
      localVue,
      vuetify,
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should trigger input event if user selects new item', () => {
    const wrapper = mount(PlaceTypeInput, { propsData: { eager: true }, localVue, vuetify });
    wrapper.find('.v-select__slot').trigger('click');
    wrapper.find('.v-list-item').trigger('click'); // click first item

    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input[0]).toHaveLength(1);
    expect(wrapper.emitted().input[0][0]).toEqual('accounting');
  });

  it('should not trigger input event if new value is set programmatically', () => {
    const wrapper = mount(PlaceTypeInput, {
      propsData: {
        value: 'supermarket',
        eager: true,
      },
      localVue,
      vuetify,
    });
    expect(wrapper.element).toMatchSnapshot();
    wrapper.setProps({
      value: 'theater',
    });
    expect(wrapper.element).toMatchSnapshot();
    expect(wrapper.emitted().input).toBeFalsy();
  });

  it('should update v-model correctly', () => {
    const wrapper = mount(
      {
        template: '<PlaceTypeInput v-model="modelValue" eager/>',
        data: () => ({
          modelValue: null,
        }),
        components: {
          PlaceTypeInput,
        },
      },
      { localVue, vuetify }
    );

    wrapper.find('.v-select__slot').trigger('click');
    wrapper.find('.v-list-item').trigger('click'); // click first item

    expect(wrapper.vm.modelValue).toEqual('accounting');
    expect(wrapper.element).toMatchSnapshot();
  });
});
