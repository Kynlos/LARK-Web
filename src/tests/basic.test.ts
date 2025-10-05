import { describe, it, expect } from 'vitest';

describe('Basic Test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });

  it('should add numbers', () => {
    expect(1 + 1).toBe(2);
  });
});
