import defaultLayout from '@/components/dashboard/default-layout';
import { parseLayout } from '@/util/dashboard';
import * as mockDate from 'jest-date-mock';

mockDate.advanceTo('2019-05-15T00:00:00.000Z');

jest.mock('firebase/app', () => ({
  firestore: jest.fn().mockReturnValue({
    doc: jest.fn().mockReturnValue({
      get: jest.fn().mockResolvedValue({
        exists: true,
        data() {
          return {
            homeLocation: {
              lng: 1,
              lat: 2,
            },
          };
        },
      }),
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

describe('dashboard/default-layout', () => {
  it('should be parsed correctly', async () => {
    await expect(parseLayout(defaultLayout)).resolves.toMatchSnapshot();
  });
});
