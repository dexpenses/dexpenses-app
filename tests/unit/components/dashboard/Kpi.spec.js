import { shallowMount } from '@vue/test-utils';
import firebase from 'firebase/app';
import Kpi from '@/components/dashboard/Kpi.vue';

jest.mock('firebase/app', () => ({
  functions: jest.fn().mockReturnValue({
    httpsCallable: jest.fn().mockReturnValue(jest.fn().mockResolvedValue({ data: { value: 1 } })),
  }),
}));

describe('dashboard/Kpi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should render value correctly', async () => {
    const wrapper = shallowMount(Kpi, {
      propsData: {
        title: 'title',
        func: 'mockFunc',
      },
      stubs: {
        'v-progress-circular': true,
      },
    });
    expect(wrapper.element).toMatchSnapshot(); // shows loading
    await new Promise(r => setTimeout(r));
    expect(wrapper.element).toMatchSnapshot(); // shows value
  });

  it('should render error correctly', async () => {
    firebase
      .functions()
      .httpsCallable('mockFunc')
      .mockReturnValue(jest.fn().mockRejectedValue());
    const wrapper = shallowMount(Kpi, {
      propsData: {
        title: 'title',
        func: 'mockFunc',
      },
      stubs: {
        'v-progress-circular': true,
      },
    });
    expect(wrapper.element).toMatchSnapshot(); // shows loading
    await new Promise(r => setTimeout(r));
    expect(wrapper.element).toMatchSnapshot(); // shows error
  });
});
