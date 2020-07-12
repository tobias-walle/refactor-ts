import * as path from 'path';
import { replaceStart } from './replace-start';

export function replaceStartOfFileName(filePath: string, search: string, replace: string): string {
  return path.join(path.dirname(filePath), replaceStart(path.basename(filePath), search, replace));
}
