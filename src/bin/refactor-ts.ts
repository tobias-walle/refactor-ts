import inquirer from 'inquirer';
import yargs from 'yargs';
import { changeCasing, ChangeCasingOptions } from '../lib/commands/change-casing';
import { rename } from '../lib/commands/rename';
import { openProject } from '../lib/utils/openProject';
import { pipe } from '../lib/utils/pipe';
import { setupCommand } from '../lib/utils/resolveCliOptions';
import { resolvePathIfRelative } from '../lib/utils/resolvePathIfRelative';

inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'))

pipe(
  yargs,
  setupCommand({
    command: 'rename',
    description: `Rename a file or folder with it's related symbols.`,
    options: {
      project: {
        alias: 'p',
        description: 'The path to the tsconfig file of the project.',
        type: 'string',
        default: 'tsconfig.json',
      },
      path: {
        alias: 'f',
        description: 'The path to the file or folder to rename.',
        type: 'string',
        promptType: 'fuzzypath'
      },
      search: {
        alias: 's',
        description: 'The part of the file/folder name you want to replace.',
        type: 'string',
        promptType: 'input'
      },
      replace: {
        alias: 'r',
        description: 'The replacement value.',
        type: 'string',
        promptType: 'input'
      }
    },
    run: async (options) => {
      const project = openProject(options.project);
      await rename({
        project,
        fileOrFolderPath: resolvePathIfRelative(options.path),
        oldName: options.search,
        newName: options.replace,
        includeDeclarations: true,
        includeStringLiterals: true,
      });
      await project.save();
    }
  }),
  setupCommand({
    command: 'change-casing',
    description: `Change the casing of the included files. ` +
      `For example from kebab case (my-file.ts) to pascal case (MyFile.ts).`,
    options: {
      project: {
        alias: 'p',
        description: 'The path to the tsconfig file of the project.',
        type: 'string',
        default: 'tsconfig.json',
      },
      folder: {
        alias: 'f',
        description: 'The path of the folder with the files to rename.',
        type: 'string',
        promptType: 'fuzzypath'
      },
      include: {
        alias: 'i',
        description: 'The pattern that the files or folders should match.',
        default: '**',
        type: 'string',
      },
      casing: {
        alias: 'c',
        description: 'The target casing of the new files',
        default: '**',
        choices: ['camel', 'pascal', 'snake', 'kebab'],
        type: 'string',
      },
    },
    run: async (options) => {
      const project = openProject(options.project);
      await changeCasing({
        project,
        folder: resolvePathIfRelative(options.folder),
        include: options.include,
        casing: options.casing as ChangeCasingOptions['casing']
      });
      await project.save();
    }
  })
)
  .strict()
  .help()
  .argv;
