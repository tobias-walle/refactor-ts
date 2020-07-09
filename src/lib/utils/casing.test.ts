import { changeCase, detectCase } from './casing';

describe('detectCasing', () => {
  it('should detect the casing of a string', () => {
    expect(detectCase('myTestString')).toBe('camel');
    expect(detectCase('MyTestString')).toBe('pascal');
    expect(detectCase('my-test-string')).toBe('kebab');
    expect(detectCase('my_test_string')).toBe('snake');
  });
});

describe('changeCasing', () => {
  it('should change casing of a string', () => {
    expect(changeCase('myTestString', 'kebab')).toBe('my-test-string');
    expect(changeCase('myTestString', 'snake')).toBe('my_test_string');
    expect(changeCase('myTestString', 'pascal')).toBe('MyTestString');
    expect(changeCase('my-test-string', 'camel')).toBe('myTestString');
  });
});
