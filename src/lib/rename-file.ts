import path from 'path';
import { Node, Project } from 'ts-morph';
import { changeCasing, detectCasing } from './utils/casing';

interface RenameFileOptions {
  project: Project;
  filePath: string;
  newFileName: string;
}

export function renameFile(options: RenameFileOptions): void {
  const {
    project,
    filePath,
    newFileName
  } = options;

  const sourceFile = project.getSourceFile(filePath);
  if (!sourceFile) {
    throw new Error(`Couldn't find "${filePath}"`);
  }
  const oldFileName = path.basename(filePath);
  sourceFile.move(newFileName);

  const oldFileNameWithoutExt = removeFileExt(oldFileName);
  const newFileNameWithoutExt = removeFileExt(newFileName);

  const declarations = [
    ...sourceFile.getFunctions(),
    ...sourceFile.getInterfaces(),
    ...sourceFile.getClasses(),
    ...sourceFile.getVariableDeclarations()
  ]

  function replace(value: string): string | null {
    const nameCasing = detectCasing(value);
    const oldNameInCasing = changeCasing(oldFileNameWithoutExt, nameCasing);
    const replacementNameInCasing = changeCasing(newFileNameWithoutExt, nameCasing);
    if (!value.startsWith(oldNameInCasing)) {
      return null;
    }
    return value.replace(oldNameInCasing, replacementNameInCasing);
  }

  // Replace declarations
  declarations.forEach(declaration => {
    const declarationName = declaration.getName();
    if (!declarationName) {
      return;
    }
    const newName = replace(declarationName);
    if (newName) {
      declaration.rename(newName);
    }
  });

  // Replace string literals
  sourceFile.forEachDescendant(node => {
    if (Node.isStringLiteral(node)) {
      const value = node.getLiteralValue();
      const replacementValue = replace(value);
      if (replacementValue) {
        node.setLiteralValue(replacementValue);
      }
    }
  })
}

function removeFileExt(fileName: string): string {
  return fileName.split('.')[0];
}

