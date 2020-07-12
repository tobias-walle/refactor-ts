import { renameSingleFile } from './rename-single-file';
import { Files, getProjectFiles, normalizeFiles, prepareInMemoryProject } from './in-memory-project';

const defaultOptions = {
  includeDeclarations: true,
  includeStringLiterals: true
}

describe('renameSingleFile', () => {
  it('should rename a simple component file', async () => {
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
    const project = await prepareInMemoryProject(inputFiles);

    await renameSingleFile({
      ...defaultOptions,
      project,
      filePath: 'src/components/my-component.tsx',
      oldName: 'my-component',
      newName: 'message'
    });
    await project.save();

    expect(await getProjectFiles(project)).toEqual(normalizeFiles(expectedOutput));
  });

  it('should rename a simple constant', async () => {
    const inputFiles: Files = {
      '/src/test.ts': `const test = 'TestValue'`
    };
    const expectedOutput: Files = {
      '/src/newTest.ts': `const newTest = 'NewTestValue'`
    };
    const project = await prepareInMemoryProject(inputFiles);

    await renameSingleFile({
      ...defaultOptions,
      project,
      filePath: 'src/test.ts',
      oldName: 'test',
      newName: 'newTest'
    });
    await project.save();

    expect(await getProjectFiles(project)).toEqual(normalizeFiles(expectedOutput));
  });

  it('should allow changing the case', async () => {
    const inputFiles: Files = {
      '/src/my-test.ts': `const myTest = 'MyTestValue'`
    };
    const expectedOutput: Files = {
      '/src/myTest.ts': `const myTest = 'MyTestValue'`
    };
    const project = await prepareInMemoryProject(inputFiles);

    await renameSingleFile({
      ...defaultOptions,
      project,
      filePath: 'src/my-test.ts',
      oldName: 'my-test',
      newName: 'myTest'
    });
    await project.save();

    expect(await getProjectFiles(project)).toEqual(normalizeFiles(expectedOutput));
  });
});
