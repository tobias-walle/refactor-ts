import * as path from 'path';
import { FileSystemHost, Project } from 'ts-morph';
import { renameSingleFile } from './rename-single-file';
import { replaceStartOfFileName } from './utils/replaceStartOfFileName';

interface RenameOptions {
  project: Project;
  fileOrFolderPath: string;
  oldName: string,
  newName: string;
}

interface RenameContext extends RenameOptions {
}

export async function rename(options: RenameOptions) {
  const {
    project,
    fileOrFolderPath,
    newName
  } = options;

  const fs = project.getFileSystem();
  const pathType = await getPathType(fs, fileOrFolderPath);
  if (pathType === null) {
    throw new Error(`Couldn't find "${fileOrFolderPath}"`);
  }

  const context: RenameContext = {
    ...options,
  }

  if (pathType === 'file') {
    await renameFile(context);
  }

}

async function renameFile(context: RenameContext): Promise<void> {
  const {
    project,
    fileOrFolderPath,
    newName,
    oldName
  } = context;
  const fs = project.getFileSystem();
  const parentFolder = path.dirname(fileOrFolderPath);
  const relevantFiles = fs.readDirSync(parentFolder).filter(
    f => path.basename(f).startsWith(oldName)
  );
  await Promise.all(relevantFiles.map(f => {
    try {
      return renameSingleFile({
        project,
        filePath: f,
        oldName,
        newName
      });
    } catch (e) {
      if (!e.message.includes('Couldn\'t find')) {
        throw e;
      }
      fs.move(f, replaceStartOfFileName(f, oldName, newName));
    }
  }));
}

async function getPathType(fs: FileSystemHost, fileOrFolderPath: string): Promise<'file' | 'dir' | null> {
  if (await fs.directoryExistsSync(fileOrFolderPath)) {
    return 'dir';
  } else if (await fs.fileExists(fileOrFolderPath)) {
    return 'file';
  } else {
    return null;
  }
}
