import { mount, createLocalVue } from '@vue/test-utils';
import { DateTime } from 'luxon';
import createVuetify from '../vuetify';
import DateInput from '@/components/fields/DateInput.vue';

import '@/filters';

const localVue = createLocalVue();

describe('DateInput.vue', () => {
  let vuetify;
  beforeEach(() => {
    vuetify = createVuetify();
  });

  it('should render correctly', () => {
    const wrapper = mount(DateInput, { localVue, vuetify });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should render correctly with value', () => {
    const wrapper = mount(DateInput, {
      propsData: {
        value: new Date('2019-04-28T00:00:00.000Z'),
      },
      localVue,
      vuetify,
    });
    expect(wrapper.element).toMatchSnapshot();
    expect(wrapper.find('input').element.value).toEqual('04/28/2019');
  });

  it('should trigger input event if user selects new item', async () => {
    const wrapper = mount(DateInput, { localVue, vuetify });
    wrapper.find('input').setValue('04/28/2019');
    expect(wrapper.find('input').element.value).toEqual('04/28/2019');
    await wrapper.vm.$nextTick();

    expect(wrapper.element).toMatchSnapshot();
    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input[0]).toHaveLength(1);
    expect(wrapper.emitted().input[0][0]).toEqual(
      DateTime.fromFormat('28.04.2019', 'dd.MM.yyyy', {
        zone: 'Europe/Berlin',
      }).toJSDate()
    );
  });

  it('should not trigger input event if new value is set programmatically', () => {
    const wrapper = mount(DateInput, {
      propsData: {
        value: new Date('2019-04-28T00:00:00.000Z'),
      },
      localVue,
      vuetify,
    });
    expect(wrapper.element).toMatchSnapshot();
    expect(wrapper.find('input').element.value).toEqual('04/28/2019');
    wrapper.setProps({
      value: new Date('2019-04-29T00:00:00.000Z'),
    });
    expect(wrapper.element).toMatchSnapshot();
    expect(wrapper.emitted().input).toBeFalsy();
    expect(wrapper.find('input').element.value).toEqual('04/29/2019');
  });

  it('should update v-model correctly', async () => {
    const wrapper = mount(
      {
        template: '<DateInput v-model="modelValue"></DateInput>',
        data: () => ({
          modelValue: null,
        }),
        components: {
          DateInput,
        },
      },
      { localVue, vuetify }
    );

    wrapper.find('input').setValue('04/28/2019');
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.modelValue).toEqual(
      DateTime.fromFormat('28.04.2019', 'dd.MM.yyyy', {
        zone: 'Europe/Berlin',
      }).toJSDate()
    );
    expect(wrapper.element).toMatchSnapshot();
  });
});
