import path from 'path';
import { Node, Project, SourceFile } from 'ts-morph';
import { Case, changeCase, detectCase } from './casing';
import { replaceStart } from './replaceStart';

interface RenameFileOptions {
  project: Project;
  filePath: string;
  oldName: string,
  newName: string;
  includeDeclarations: boolean;
  includeStringLiterals: boolean
}

interface RenameFileContext extends RenameFileOptions {
  sourceFile: SourceFile;
}

export async function renameSingleFile(options: RenameFileOptions): Promise<void> {
  const {
    project,
    filePath,
    oldName,
    newName,
    includeDeclarations,
    includeStringLiterals
  } = options;

  const sourceFile = project.getSourceFile(filePath);
  if (!sourceFile) {
    throw new Error(`Couldn't find "${filePath}"`);
  }
  const oldFileName = path.basename(filePath);
  const newFileName = replaceStart(oldFileName, oldName, newName);

  sourceFile.move(newFileName);

  const context: RenameFileContext = {
    ...options,
    sourceFile,
  }

  if (includeDeclarations) {
    replaceDeclarations(context);
  }

  if (includeStringLiterals) {
    replaceStringLiterals(context);
  }
}

function replaceDeclarations(context: RenameFileContext): void {
  const {
    sourceFile,
    oldName,
    newName
  } = context;
  const declarations = [
    ...sourceFile.getFunctions(),
    ...sourceFile.getEnums(),
    ...sourceFile.getTypeAliases(),
    ...sourceFile.getInterfaces(),
    ...sourceFile.getClasses(),
    ...sourceFile.getVariableDeclarations()
  ]
  declarations.forEach(declaration => {
    const declarationName = declaration.getName();
    if (!declarationName) {
      return;
    }
    const newDeclarationName = replaceButPersistCasing(declarationName, oldName, newName);
    if (newDeclarationName && declarationName != newDeclarationName) {
      declaration.rename(newDeclarationName);
    }
  });
}

function replaceStringLiterals(context: RenameFileContext): void {
  const {
    sourceFile,
    oldName,
    newName
  } = context;
  sourceFile.forEachDescendant(node => {
    if (Node.isStringLiteral(node)) {
      const value = node.getLiteralValue();
      const replacementValue = replaceButPersistCasing(value, oldName, newName);
      if (replacementValue) {
        node.setLiteralValue(replacementValue);
      }
    }
  });
}

function replaceButPersistCasing(value: string, oldName: string, newName: string): string | null {
  const nameCasing = detectCasingOfVariableOrValue(value);
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

function capitalizeFirstChar(value: string): string {
  if (value.length === 0) {
    return value;
  }
  return value[0].toUpperCase() + value.slice(1);
}

function detectCasingOfVariableOrValue(variable: string): Case | null {
  const casing = detectCase(variable);
  if (casing === 'lower') {
    return 'camel';
  } else if (casing === 'capital') {
    return 'pascal';
  } else if (casing === 'upper') {
    return 'constant';
  } else if (casing === 'sentence' || casing === 'title' || casing === 'header') {
    return null;
  }
  return casing;
}
