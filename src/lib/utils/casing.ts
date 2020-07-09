import { camel, capital, constant, header, kebab, lower, of, pascal, sentence, snake, title, upper } from 'case';

const caseByType = {
  upper,
  lower,
  capital,
  snake,
  pascal,
  camel,
  kebab,
  header,
  constant,
  title,
  sentence
} as const;


export type Case = keyof typeof caseByType;

export function changeCase(value: string, caseType: Case): string {
  if (caseByType[caseType] == null) {
    throw new Error(`Unknown case "${caseType}"`);
  }
  return caseByType[caseType](value);
}

export function detectCase(value: string): Case | null {
  return of(value) as Case ?? null;
}
