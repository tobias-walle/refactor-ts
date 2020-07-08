import { changeCasing, detectCasing } from './casing';

describe('detectCasing', () => {
  it('should detect the casing of a string', () => {
    expect(detectCasing('myTestString')).toBe('camelCase');
    expect(detectCasing('MyTestString')).toBe('PascalCase');
    expect(detectCasing('my-test-string')).toBe('lisp-case');
    expect(detectCasing('my_test_string')).toBe('snake_case');
  });
});

describe('changeCasing', () => {
  it('should change casing of a string', () => {
    expect(changeCasing('myTestString', 'lisp-case')).toBe('my-test-string');
    expect(changeCasing('myTestString', 'snake_case')).toBe('my_test_string');
    expect(changeCasing('myTestString', 'PascalCase')).toBe('MyTestString');
    expect(changeCasing('my-test-string', 'camelCase')).toBe('myTestString');
  });
});
