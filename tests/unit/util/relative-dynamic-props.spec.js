import { parseProps } from '@/util/relative-dynamic-props';
import * as mockDate from 'jest-date-mock';
import firebase from 'firebase/app';

jest.mock('firebase/app', () => ({
  firestore: jest.fn().mockReturnValue({
    doc: jest.fn().mockReturnValue({
      get: jest.fn(),
    }),
  }),
}));

jest.mock('@/store', () => ({
  state: {
    user: {
      user: { uid: 'test' },
    },
  },
}));

global.navigator.geolocation = {
  getCurrentPosition: jest.fn(),
};

describe('relative-dates', () => {
  beforeEach(() => {
    mockDate.advanceTo('2019-01-17T00:00:00.000Z');
  });

  it('should parse $now', async () => {
    await expect(parseProps({ start: '$now' })).resolves.toEqual({ start: '2019-01-17' });
  });

  it('should parse $now with set to first of month', async () => {
    await expect(
      parseProps({
        start: { $now: { set: { day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 } } },
      })
    ).resolves.toEqual({ start: '2019-01-01' });
  });

  it('should parse $now with one year ago', async () => {
    await expect(parseProps({ start: { $now: { minus: { years: 1 } } } })).resolves.toEqual({
      start: '2018-01-17',
    });
  });

  it('should parse $home from user data', async () => {
    firebase
      .firestore()
      .doc()
      .get.mockResolvedValue({
        exists: true,
        data() {
          return {
            homeLocation: { lat: 34, lng: 15 },
          };
        },
      });
    await expect(parseProps({ location: '$home' })).resolves.toEqual({
      location: { lat: 34, lng: 15 },
    });
  });

  it('should parse $home from navigator.geolocation', async () => {
    firebase
      .firestore()
      .doc()
      .get.mockResolvedValue({
        exists: false,
      });
    global.navigator.geolocation.getCurrentPosition.mockImplementation(success =>
      success({
        coords: {
          longitude: 1,
          latitude: 2,
        },
      })
    );
    await expect(parseProps({ location: '$home' })).resolves.toEqual({
      location: { lat: 2, lng: 1 },
    });
  });

  it('should parse $home from fallback', async () => {
    firebase
      .firestore()
      .doc()
      .get.mockResolvedValue({
        exists: false,
      });
    global.navigator.geolocation.getCurrentPosition.mockImplementation((success, error) => error());
    await expect(parseProps({ location: '$home' })).resolves.toEqual({
      location: { lat: 52, lng: 10 },
    });
  });
});
