import { interpolate } from './cachify.interpolate';
import { OrderedStatePath } from './cachify.util';

describe('Cachify:Util', () => {
  it('should interpolate without any params', () => {
    const input = 'some.foo.bar.thingy';
    const output = interpolate(input, {});
    expect(output).toBe(input);
  });

  it('should ordered state path throw error for empty key or value', () => {
    const statePath = new OrderedStatePath();
    expect(() => statePath.append('', 'empty')).toThrow(
      new Error('Error: empty key is not allowed!')
    );
    expect(() => statePath.append('empty', '')).toThrow(
      new Error('Error: empty value is not allowed!')
    );
  });

  it('should create a specific ordered state path', () => {
    const cacheKey = new OrderedStatePath()
      .append('user', 1000)
      .append('portfolio', 2)
      .append('tickers', 'all')
      .toString();

    const expectedStatePath = 'user.[1000].portfolio.[2].tickers.[all]';
    expect(cacheKey).toBe(expectedStatePath);
  });

  it('should clean up state path', () => {
    const cacheKey = new OrderedStatePath()
      .append('user....', 1000)
      .append('portfolio____', 2)
      .append('tickers', 'all')
      .toString();

    const expectedStatePath = 'user.[1000].portfolio.[2].tickers.[all]';
    expect(cacheKey).toBe(expectedStatePath);
  });
});
