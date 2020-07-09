import { escapeRegExp } from './escapeRegExp';

export function replaceStart(value: string, search: string, replace: string): string {
  return value.replace(new RegExp(`^${escapeRegExp(search)}`), replace);
}
