import inquirer from 'inquirer';
import { Arguments, Argv } from 'yargs';

export interface TypeByName {
  number: number;
  string: string;
  boolean: boolean;
}

export type TypeName = keyof TypeByName;

export interface CliParameterOptions<N extends TypeName> {
  type: N,
  promptType?: string;
  alias: string;
  description: string;
  default?: TypeByName[N];
}

type OptionsByName = Record<string, CliParameterOptions<TypeName>>;

type ResolvedOptions<O extends OptionsByName> = {
  [name in keyof O]: TypeByName[O[name]['type']]
}

type RunCommand<O extends OptionsByName> = (options: ResolvedOptions<O>) => (Promise<void> | void);

export interface CliCommandOptions<O extends OptionsByName> {
  command: string;
  description: string;
  options: Readonly<O>;
  run: RunCommand<O>;
}

export function setupCommand<O extends OptionsByName, K extends string, N extends TypeName>({
  command,
  description,
  options,
  run
}: CliCommandOptions<O>): (yargs: Argv) => Argv {
  return yargs => yargs
    .command(
      command,
      description,
      configureArgv(options),
      configureHandler(options, run)
    );
}

function configureArgv<O extends OptionsByName>(
  optionsByName: O
): (yargs: Argv) => Argv {
  return yargs => Object.entries(optionsByName)
    .reduce(
      (_yargs, [name, options]) => _yargs.option(name, {
        alias: options.alias,
        description: options.description,
        type: options.type,
        default: options.default
      }),
      yargs
    );
}

function configureHandler<O extends OptionsByName>(
  optionsByName: O,
  run: RunCommand<O>
): (args: Arguments<any>) => void {
  return async (argv: any) => {
    try {
      const questions = Object.entries(optionsByName)
        .filter(([name, option]) => argv[name] == null && option.promptType)
        .map(([name, option]) => ({
          name,
          type: option.promptType,
          message: option.description
        }))
      const answers = await inquirer.prompt(questions);
      await run({
        ...argv,
        ...answers
      });
    } catch (e) {
      console.error(e.message);
    }
  }
}

