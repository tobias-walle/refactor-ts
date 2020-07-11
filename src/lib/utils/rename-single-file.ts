import path from 'path';
import { Node, Project } from 'ts-morph';
import { changeCase, detectCase } from './casing';
import { replaceStart } from './replaceStart';

interface RenameFileOptions {
  project: Project;
  filePath: string;
  oldName: string,
  newName: string;
}

export async function renameSingleFile(options: RenameFileOptions): Promise<void> {
  const {
    project,
    filePath,
    oldName,
    newName
  } = options;

  const sourceFile = project.getSourceFile(filePath);
  if (!sourceFile) {
    throw new Error(`Couldn't find "${filePath}"`);
  }
  const oldFileName = path.basename(filePath);
  const newFileName = replaceStart(oldFileName, oldName, newName);

  sourceFile.move(newFileName);

  const declarations = [
    ...sourceFile.getFunctions(),
    ...sourceFile.getEnums(),
    ...sourceFile.getTypeAliases(),
    ...sourceFile.getInterfaces(),
    ...sourceFile.getClasses(),
    ...sourceFile.getVariableDeclarations()
  ]

  function replace(value: string): string | null {
    const nameCasing = detectCase(value);
    if (nameCasing == null) {
      return null;
    }
    const oldNameInCasing = changeCase(oldName, nameCasing);
    const replacementNameInCasing = changeCase(newName, nameCasing);
    const result = value.replace(oldNameInCasing, replacementNameInCasing);
    if (result === value) {
      return value.replace(capitalizeFirstChar(oldNameInCasing), capitalizeFirstChar(replacementNameInCasing));
    } else {
      return result;
    }
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
  });
}

function capitalizeFirstChar(value: string): string {
  if (value.length === 0) {
    return value;
  }
  return value[0].toUpperCase() + value.slice(1);
}
