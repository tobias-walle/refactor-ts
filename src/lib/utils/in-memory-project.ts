import * as path from 'path';
import { Project } from 'ts-morph';

export type Files = { [fileName: string]: string }

export async function prepareInMemoryProject(files: Files): Promise<Project> {
  const project = new Project({
    useInMemoryFileSystem: true
  });
  const fs = project.getFileSystem();
  await Promise.all(
    Object.entries(files).map(async ([filePath, fileContent]) => {
      await fs.writeFile(filePath, fileContent);
    })
  );
  project.addSourceFilesAtPaths(Object.keys(files));
  return project;
}

export async function getProjectFiles(project: Project): Promise<Files> {
  const fs = project.getFileSystem();
  const filePaths = (await fs.glob(['**/*'])).filter(p => !p.startsWith('/node_modules'));
  const fileContent = await Promise.all(filePaths.map(p => fs.readFile(p)));
  return Object.fromEntries(
    filePaths.map((filePath, i) => [filePath, fileContent[i]])
  );
}
