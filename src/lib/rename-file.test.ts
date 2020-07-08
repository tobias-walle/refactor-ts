import { Project } from 'ts-morph';
import { renameFile } from './rename-file';

type Files = { [fileName: string]: string }

function prepareInMemoryProject(files: Files): Project {
  const project = new Project({
    useInMemoryFileSystem: true
  });
  Object.entries(files)
    .forEach(([fileName, source]) => {
      project.createSourceFile(fileName, source);
    });
  return project;
}

function getProjectFiles(project: Project): Files {
  return Object.fromEntries(
    project.getSourceFiles()
      .map(s => [s.getFilePath(), s.getFullText()])
  );
}

describe('renameFile', () => {
  it('should rename a simple component file', () => {
    const inputFiles: Files = {
      '/src/components/my-component.tsx': `
import React from 'react';

const myComponentName = 'MyComponent';

export interface MyComponentProps {
  children: React.ReactNode;
}

function MyComponent(props: MyComponentProps) {
  return <div>{props.children}</div>
}

export default MyComponent;
      `.trim()
    };
    const expectedOutput: Files = {
      '/src/components/message.tsx': `
import React from 'react';

const messageName = 'Message';

export interface MessageProps {
  children: React.ReactNode;
}

function Message(props: MessageProps) {
  return <div>{props.children}</div>
}

export default Message;
      `.trim()
    };
    const project = prepareInMemoryProject(inputFiles);

    renameFile({
      project,
      filePath: 'src/components/my-component.tsx',
      newFileName: 'message.tsx'
    });

    expect(getProjectFiles(project)).toEqual(expectedOutput);
  });
});
