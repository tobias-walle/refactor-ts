import { renameSingleFile } from './rename-single-file';
import { Files, getProjectFiles, prepareInMemoryProject } from './in-memory-project';

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
      project,
      filePath: 'src/components/my-component.tsx',
      oldName: 'my-component',
      newName: 'message'
    });
    await project.save();

    expect(await getProjectFiles(project)).toEqual(expectedOutput);
  });
});
