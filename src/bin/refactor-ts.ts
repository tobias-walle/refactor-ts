import inquirer from 'inquirer';
import yargs from 'yargs';
import { rename } from '../lib/rename';
import { openProject } from '../lib/utils/openProject';
import { resolvePathIfRelative } from '../lib/utils/resolvePathIfRelative';

inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'))

yargs
  .command(
    'rename',
    `Rename a file or folder with it's related symbols.`,
    _yargs => _yargs
      .option('project', {
        alias: 'p',
        description: 'The path to the tsconfig file of the project.',
        default: 'tsconfig.json',
        type: 'string'
      })
      .option('path', {
        alias: 'f',
        description: 'The path to the file or folder to rename.',
        type: 'string'
      })
      .option('search', {
        alias: 's',
        description: 'The part of the file/folder name you want to replace.',
        type: 'string'
      })
      .option('replace', {
        alias: 'r',
        description: 'The replacement value.',
        type: 'string'
      }),
    async argv => {
      const questions = [
        {
          name: 'path',
          type: 'fuzzypath',
          message: 'The path to the file or folder to rename.'
        },
        {
          name: 'search',
          type: 'input',
          message: 'The part of the file/folder name you want to replace.'
        },
        {
          name: 'replace',
          type: 'input',
          message: 'The replacement value.'
        }
      ].filter(q => argv[q.name] == null);
      const answers = await inquirer.prompt(questions);
      const options: any = {
        ...argv,
        ...answers
      };
      const project = openProject(options.project);
      await rename({
        project,
        fileOrFolderPath: resolvePathIfRelative(options.path),
        oldName: options.search,
        newName: options.replace,
      });
    }
  )
  .strict()
  .help()
  .argv;
