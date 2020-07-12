# refactor-ts

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

## How does it work?
Most of the work is done by [ts-morph](https://github.com/dsherret/ts-morph). I provides an excellent Typescript AST
Api and I just clue it all together.

## How can I contribute?
I you have an idea for a new command, please create an GitHub issue first. Then we can work together
on the Api. If we are both happy, you can create a Pull Request with the implementation of your idea.

