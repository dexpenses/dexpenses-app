import Vue from 'vue';
import Vuetify from 'vuetify';
import { mount } from '@vue/test-utils';
import TimeInput from '@/components/fields/TimeInput.vue';

import '@/filters';
import { nextTickFor } from '../utils';

Vue.use(Vuetify, {}); // should actually use localVue, but that causes a console error atm

describe('TimeInput.vue', () => {
  it('should render correctly', () => {
    const wrapper = mount(TimeInput);
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should render correctly with value', () => {
    const wrapper = mount(TimeInput, {
      propsData: {
        value: {
          hour: 12,
          minute: 0,
          second: 30,
        },
      },
    });
    expect(wrapper.element).toMatchSnapshot();
    expect(wrapper.find('input').element.value).toEqual('12:00:30');
  });

  it('should trigger input event if user selects new item', async () => {
    const wrapper = mount(TimeInput);
    wrapper.find('input').setValue('13:00:00');
    expect(wrapper.find('input').element.value).toEqual('13:00:00');
    await nextTickFor(wrapper.vm);
    // nextTick handling is necessary bcs of mask attr on text-field (damy)
    expect(wrapper.element).toMatchSnapshot();
    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input[0]).toHaveLength(1);
    expect(wrapper.emitted().input[0][0]).toEqual({ hour: 13, minute: 0, second: 0 });
  });

  it('should not trigger input event if new value is set programmatically', () => {
    const wrapper = mount(TimeInput, {
      propsData: {
        value: {
          hour: 12,
          minute: 30,
          second: 15,
        },
      },
    });
    expect(wrapper.element).toMatchSnapshot();
    expect(wrapper.find('input').element.value).toEqual('12:30:15');
    wrapper.setProps({
      value: {
        hour: 13,
        minute: 30,
        second: 15,
      },
    });
    expect(wrapper.element).toMatchSnapshot();
    expect(wrapper.emitted().input).toBeFalsy();
    expect(wrapper.find('input').element.value).toEqual('13:30:15');
  });

  it('should update v-model correctly', async () => {
    const wrapper = mount({
      template: '<TimeInput v-model="modelValue"></TimeInput>',
      data: () => ({
        modelValue: null,
      }),
      components: {
        TimeInput,
      },
    });

    wrapper.find('input').setValue('13:00:00');
    await nextTickFor(wrapper.vm);

    expect(wrapper.vm.modelValue).toEqual({ hour: 13, minute: 0, second: 0 });
    expect(wrapper.element).toMatchSnapshot();
  });
});
