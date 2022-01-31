# refactor-ts
[![npm version](https://badge.fury.io/js/refactor-ts.svg)](https://badge.fury.io/js/refactor-ts)

> WARNING! This package is not maintained anymore. Please don't use it!

**refactor-ts** is a command line tool that's automates common refactorings in a 
typescript project. 

## Why do I need this? I have an IDE.

In an ideal world, this tool would not be necessary. A lot of common refactor scenarios 
are already supported by most IDEs. But I personally run in many situations in which the
refactor capabilities of the my IDEs or editors just aren't enough.

## Installation
I would recommend installing it globally:

npm: `npm i -g refactor-ts`

yarn: `yarn global add refactor-ts`

If you don't want to install it globally, you could also use npx: 
`npx refactor-ts <command>`


## What can it do?
Each use case has it's own command.

You can always run a command with `--help` (for example `refactor-ts rename --help`) to see it's options. 

If you don't pass all the required options directly, you are asked about them in an interactive prompt. 
I would recommend the use of the interactive prompt, because it provides useful features like autocomplete. 

The following commands are available right now:

- [rename](#rename) Rename a file or its folder, including surrounding files and it's content.
- [change-chasing](#change-casing) Change the casing of the included files. For example from kebab case (my-file.ts) to pascal case (MyFile.ts).


### rename
I experience the common scenario, in which I have project in this concepts are grouped into multiple files.

Let's take for example a React project, in which each component is in it's own folder with multiple files:

```
src
|-- components
    |-- App
        |-- App.tsx
        |-- App.container.tsx
        |-- App.test.tsx
        |-- App.styles.tsx
    |-- Counter
        |-- Counter.tsx
        |-- Counter.test.tsx
        |-- Counter.container.tsx
        |-- Counter.styles.tsx
```

If we now want to rename the `Counter` component to `PositiveCounter`, we would have to rename each of the four files
and it's directory. After that we might need to rename of names of the exported functions/types/constants in the 
files.

The `rename` command automates this task for you:

```
refactor-ts rename --path src/components/Counter --search Counter --replace PositiveCounter
```

After you run this command the new file Structure looks like this: 

```
src
|-- components
    |-- App
        |-- App.tsx
        |-- App.container.tsx
        |-- App.test.tsx
        |-- App.styles.tsx
    |-- PositiveCounter
        |-- PositiveCounter.tsx
        |-- PositiveCounter.test.tsx
        |-- PositiveCounter.container.tsx
        |-- PositiveCounter.styles.tsx
```

All symbols in the files containing `Counter`, including all it's usages, will be replaced as well.

### change-casing
Change the casing of the included files.

For example if we have the following structure with inconsistent casing:

```
src
|-- utils
    |-- myFunction.ts
    |-- myFunction.test.ts
|-- components
    |-- positiveCounter
        |-- PositiveCounter.tsx
        |-- positive-counter.test.tsx
```

We could fix it with the command:

```
refactor-ts change-casing --folder src --casing kebab
```

The result would be:

```
src
|-- utils
    |-- my-function.ts
    |-- my-function.test.ts
|-- components
    |-- positive-counter
        |-- positive-counter.tsx
        |-- positive-counter.test.tsx
```


## How does it work?
Most of the work is done by [ts-morph](https://github.com/dsherret/ts-morph). I provides an excellent Typescript AST
Api and I just clue it all together.

## How can I contribute?
I you have an idea for a new command, please create an GitHub issue first. Then we can work together
on the Api. If we are both happy, you can create a Pull Request with the implementation of your idea.

