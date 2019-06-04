import { collectPromises, unwrapPromises } from '@/util/promises';

async function promise(value) {
  return value;
}

describe('promises/collectPromises', () => {
  it('should work', () => {
    expect(collectPromises({})).toEqual([]);
    expect(collectPromises({ foo: 'bar' })).toEqual([]);
    expect(collectPromises({ foo: { bar: 1 } })).toEqual([]);

    expect(collectPromises({ foo: promise() })).toHaveLength(1);
    expect(collectPromises({ foo: { bar: promise() } })).toHaveLength(1);
    expect(collectPromises({ foo: { bar: promise(), bar2: promise() } })).toHaveLength(2);
    expect(collectPromises({ foo: { bar: promise(), bar2: { p: promise() } } })).toHaveLength(2);
  });
});

describe('promises/unwrapPromises', () => {
  it('should work', async () => {
    await expect(unwrapPromises({})).resolves.toEqual({});
    await expect(unwrapPromises({ foo: 'bar' })).resolves.toEqual({ foo: 'bar' });
    await expect(unwrapPromises({ foo: promise('bar') })).resolves.toEqual({ foo: 'bar' });
    await expect(unwrapPromises({ foo: { bar: promise(1) } })).resolves.toEqual({
      foo: { bar: 1 },
    });
    await expect(unwrapPromises({ foo: { bar: promise(1), bar2: promise(1) } })).resolves.toEqual({
      foo: { bar: 1, bar2: 1 },
    });
    await expect(
      unwrapPromises({ foo: { bar: promise(1), bar2: { p: promise(1) } } })
    ).resolves.toEqual({
      foo: { bar: 1, bar2: { p: 1 } },
    });
  });
});
