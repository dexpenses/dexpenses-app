import { shallowMount } from '@vue/test-utils';
import '@/directives/dblclick-or-hold.directive';

jest.useFakeTimers();

describe('dblclickorhold directive', () => {
  let wrapper;
  const callback = jest.fn();
  beforeEach(() => {
    callback.mockClear();
    wrapper = shallowMount({
      template: '<span v-dblclick-or-hold @dblclickorhold="callback">some text</span>',
      methods: {
        callback,
      },
    });
  });

  it('should trigger dblclick', () => {
    wrapper.find('span').trigger('dblclick');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should trigger mouse hold after 500ms', () => {
    wrapper.find('span').trigger('mousedown');
    jest.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should trigger touch hold after 500ms', () => {
    wrapper.find('span').trigger('touchstart');
    jest.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should trigger hold after 1s', () => {
    wrapper = shallowMount({
      template: '<span v-dblclick-or-hold="1000" @dblclickorhold="callback">some text</span>',
      methods: {
        callback,
      },
    });
    wrapper.find('span').trigger('mousedown');
    jest.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should trigger cancel hold on mouseup', () => {
    wrapper.find('span').trigger('mousedown');
    wrapper.find('span').trigger('mouseup');
    jest.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should trigger cancel hold on mouseleave', () => {
    wrapper.find('span').trigger('mousedown');
    wrapper.find('span').trigger('mouseleave');
    jest.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should trigger cancel hold on touchend before 500ms', () => {
    wrapper.find('span').trigger('touchstart');
    wrapper.find('span').trigger('touchend');
    jest.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();

    wrapper.find('span').trigger('touchstart');
    jest.advanceTimersByTime(499);
    wrapper.find('span').trigger('touchend');
    jest.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();
  });
});
