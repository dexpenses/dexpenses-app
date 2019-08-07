import { mount, createLocalVue } from '@vue/test-utils';
import createVuetify from '../vuetify';
import TimeInput from '@/components/fields/TimeInput.vue';

import '@/filters';

const localVue = createLocalVue();

describe('TimeInput.vue', () => {
  let vuetify;
  beforeEach(() => {
    vuetify = createVuetify();
  });

  it('should render correctly', () => {
    const wrapper = mount(TimeInput, { localVue, vuetify });
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
      localVue,
      vuetify,
    });
    expect(wrapper.element).toMatchSnapshot();
    expect(wrapper.find('input').element.value).toEqual('12:00:30');
  });

  // it('should provide a masked input', async () => {
  //   const wrapper = mount(
  //     {
  //       template: '<TimeInput v-model="data"/>',
  //       data: () => ({ data: null }),
  //       components: { TimeInput },
  //     },
  //     { localVue, vuetify }
  //   );

  //   const input = wrapper.find('input');
  //   input.setValue('1200');
  //   input.trigger('keydown');
  //   console.log(wrapper.vm.$data.data);

  //   expect(input.element.value).toBe('12:0');
  // });

  it('should trigger input event if user selects new item', async () => {
    const wrapper = mount(TimeInput, { localVue, vuetify });
    wrapper.find('input').setValue('13:00:00');
    expect(wrapper.find('input').element.value).toEqual('13:00:00');
    await wrapper.vm.$nextTick();
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
      localVue,
      vuetify,
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
    const wrapper = mount(
      {
        template: '<TimeInput v-model="modelValue" />',
        data: () => ({
          modelValue: null,
        }),
        components: {
          TimeInput,
        },
      },
      { localVue, vuetify }
    );

    wrapper.find('input').setValue('13:00:00');
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.modelValue).toEqual({ hour: 13, minute: 0, second: 0 });
    expect(wrapper.element).toMatchSnapshot();
  });
});
