import path from 'path';
import { Project } from 'ts-morph';
import { resolvePathIfRelative } from './resolvePathIfRelative';

export function openProject(tsConfigPath: string): Project {
  return new Project({
    tsConfigFilePath: resolvePathIfRelative(tsConfigPath)
  });
}
