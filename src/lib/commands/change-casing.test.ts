import { Files, getProjectFiles, normalizeFiles, prepareInMemoryProject } from '../utils/in-memory-project';
import { changeCasing } from './change-casing';

describe('changeCasingTest', () => {
  it('should change the casing of all files to kebab-case', async () => {
    const inputFiles: Files = {
      '/src/constants/MyConstant.ts': `export const myConstant = 1`,
      '/src/components/my-component.ts': `export const MyComponent = 'MyComponent'`,
      '/src/components/my-component.test.ts': ``,
      '/src/components/MyOtherComponent.ts': 'export const MyOtherComponent = 1',
      '/src/components/MyOtherComponent.test.ts': '',
      '/src/test-folder1/test-file.ts': '',
      '/src/TestFolder2/TestFile.ts': '',
    };
    const expectedOutput: Files = {
      '/src/constants/my-constant.ts': `export const myConstant = 1`,
      '/src/components/my-component.ts': `export const MyComponent = 'MyComponent'`,
      '/src/components/my-component.test.ts': ``,
      '/src/components/my-other-component.ts': 'export const MyOtherComponent = 1',
      '/src/components/my-other-component.test.ts': '',
      '/src/test-folder1/test-file.ts': '',
      '/src/test-folder2/test-file.ts': '',
    };
    const project = await prepareInMemoryProject(inputFiles);

    await changeCasing({
      project,
      casing: 'kebab',
      folder: '/',
      include: '/src/**',
    });
    await project.save();

    expect(await getProjectFiles(project)).toEqual(normalizeFiles(expectedOutput));
  });

  it('should change the casing of all files to camel-case', async () => {
    const inputFiles: Files = {
      '/src/constants/MyConstant.ts': `export const myConstant = 1`,
      '/src/components/my-component.ts': `export const MyComponent = 'MyComponent'`,
      '/src/components/my-component.test.ts': ``,
      '/src/components/MyOtherComponent.ts': 'export const MyOtherComponent = 1',
      '/src/components/MyOtherComponent.test.ts': '',
      '/src/test-folder1/test-file.ts': '',
      '/src/TestFolder2/TestFile.ts': '',
    };
    const expectedOutput: Files = {
      '/src/constants/myConstant.ts': `export const myConstant = 1`,
      '/src/components/myComponent.ts': `export const MyComponent = 'MyComponent'`,
      '/src/components/myComponent.test.ts': ``,
      '/src/components/myOtherComponent.ts': 'export const MyOtherComponent = 1',
      '/src/components/myOtherComponent.test.ts': '',
      '/src/testFolder1/testFile.ts': '',
      '/src/testFolder2/testFile.ts': '',
    };
    const project = await prepareInMemoryProject(inputFiles);

    await changeCasing({
      project,
      casing: 'camel',
      folder: '/',
      include: '/src/**',
    });
    await project.save();

    expect(await getProjectFiles(project)).toEqual(normalizeFiles(expectedOutput));
  });

  it('should change the casing of only some files', async () => {
    const inputFiles: Files = {
      '/src/constants/MyConstant.ts': `export const myConstant = 1`,
      '/src/components/my-component.ts': `export const MyComponent = 'MyComponent'`,
      '/src/components/my-component.test.ts': ``,
      '/src/components/MyOtherComponent.ts': 'export const MyOtherComponent = 1',
      '/src/components/MyOtherComponent.test.ts': '',
      '/src/test-folder1/test-file.ts': '',
      '/src/TestFolder2/TestFile.ts': '',
    };
    const expectedOutput: Files = {
      '/src/constants/MyConstant.ts': `export const myConstant = 1`,
      '/src/components/MyComponent.ts': `export const MyComponent = 'MyComponent'`,
      '/src/components/MyComponent.test.ts': ``,
      '/src/components/MyOtherComponent.ts': 'export const MyOtherComponent = 1',
      '/src/components/MyOtherComponent.test.ts': '',
      '/src/test-folder1/test-file.ts': '',
      '/src/TestFolder2/TestFile.ts': '',
    };
    const project = await prepareInMemoryProject(inputFiles);

    await changeCasing({
      project,
      casing: 'pascal',
      folder: '/src/components',
      include: '**',
    });
    await project.save();

    expect(await getProjectFiles(project)).toEqual(normalizeFiles(expectedOutput));
  });
});
