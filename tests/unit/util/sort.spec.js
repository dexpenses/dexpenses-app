import { alphabeticallyBy } from '@/util/sort';

describe('util/sort/alphabeticallyBy', () => {
  it('should work', () => {
    const list = [{ name: 'Zen' }, { name: 'Anton' }].sort(alphabeticallyBy('name'));
    expect(list).toEqual([{ name: 'Anton' }, { name: 'Zen' }]);
  });
});
