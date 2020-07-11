import inquirer from 'inquirer';
import yargs from 'yargs';
import { rename } from '../lib/rename';
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
      });
      await project.save();
    }
  })
)
  .strict()
  .help()
  .argv;
