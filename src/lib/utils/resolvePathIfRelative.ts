import path from 'path';

export function resolvePathIfRelative(relativeOrAbsolutePath: string): string {
  if (path.isAbsolute(relativeOrAbsolutePath)) {
    return relativeOrAbsolutePath;
  } else {
    return path.resolve(process.cwd(), relativeOrAbsolutePath);
  }
}
