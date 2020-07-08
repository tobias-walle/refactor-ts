export type Casing =
  | 'PascalCase'
  | 'camelCase'
  | 'lisp-case'
  | 'snake_case';

const patternsByCasing: Readonly<[Casing, RegExp]>[] = [
  ['camelCase', /^[a-z][^-_]+$/],
  ['PascalCase', /^[A-Z][^-_]+$/],
  ['lisp-case', /^([a-z]+-?)+$/],
  ['snake_case', /^([a-z]+_?)+$/]
];

export function detectCasing(value: string): Casing {
  for (const [casing, pattern] of patternsByCasing) {
    if (pattern.test(value)) {
      return casing;
    }
  }
  throw new Error(`Couldn't detect casing of "${value}".`);
}

export function changeCasing(value: string, target: Casing): string {
  const source = detectCasing(value);
  if (source === target) {
    return value;
  }
  const words = splitIntoWords(value, source);
  return joinWords(words, target);
}

function splitIntoWords(value: string, casing: Casing): string[] {
  if (casing === 'camelCase' || casing === 'PascalCase') {
    return value.split(/(?=[A-Z])/);
  }
  if (casing === 'lisp-case') {
    return value.split('-');
  }
  if (casing === 'snake_case') {
    return value.split('_');
  }
  return [value];
}

function joinWords(words: string[], casing: Casing): string {
  if (casing === 'PascalCase') {
    return words.map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('');
  }
  if (casing === 'camelCase') {
    return words.map((w, i) => {
      if (i === 0) {
        return w.toLowerCase();
      } else {
        return w[0].toUpperCase() + w.slice(1).toLowerCase();
      }
    }).join('');
  }
  if (casing === 'lisp-case') {
    return words.map(w => w.toLowerCase()).join('-');
  }
  if (casing === 'snake_case') {
    return words.map(w => w.toLowerCase()).join('_');
  }
  return words.join('');
}


