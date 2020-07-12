import { isMatch } from 'micromatch';
import path from 'path';
import toAbsoluteGlob from 'to-absolute-glob';
import { FileSystemHost, Project } from 'ts-morph';
import { changeCase, detectCase } from '../utils/casing';

export interface ChangeCasingOptions {
  project: Project;
  casing: 'camel' | 'pascal' | 'snake' | 'kebab';
  include: string;
  folder: string;
}

export async function changeCasing(options: ChangeCasingOptions): Promise<void> {
  const {
    project,
    casing: targetCasing,
    include,
    folder
  } = options;

  const fs = project.getFileSystem();
  const includedFilesAndFolders = await getAllFileAndFolderPathsByGlob(fs, folder, include);
  await Promise.all(
    includedFilesAndFolders
      .reverse()
      .map(async (p) => {
        const baseName = path.basename(p);
        const [name, ...rest] = baseName.split('.');
        const currentCasing = detectCase(name);
        if (currentCasing === targetCasing) {
          return;
        }
        const newName = changeCase(name, targetCasing);
        const newFileName = [newName, ...rest].join('.');
        const newPath = path.join(path.dirname(p), newFileName);
        const directory = project.getDirectory(p);
        if (directory) {
          directory.move(newPath);
        }
        const source = project.getSourceFile(p);
        if (source) {
          source.move(newPath);
        }
      })
  );
}

async function getAllFileAndFolderPathsByGlob(fs: FileSystemHost, fileOrFolderPath: string, glob: string): Promise<string[]> {
  const absoluteGlob = toAbsoluteGlob(glob, { cwd: fileOrFolderPath });
  const filesAndFolders = await getAllFilesAndFoldersRecursively(fs, fileOrFolderPath);
  return filesAndFolders.filter(p => p !== fileOrFolderPath && isMatch(p, absoluteGlob))
}

async function getAllFilesAndFoldersRecursively(fs: FileSystemHost, fileOrFolderPath: string): Promise<string[]> {
  if (await fs.fileExists(fileOrFolderPath)) {
    return [fileOrFolderPath];
  } else if (await fs.directoryExists(fileOrFolderPath)) {
    const children: string[] = await Promise.all(
      fs.readDirSync(fileOrFolderPath)
        .map(path => getAllFilesAndFoldersRecursively(fs, path))
    ).then(p => p.flat());
    return [
      fileOrFolderPath,
      ...children
    ];
  } else {
    return [];
  }
}

