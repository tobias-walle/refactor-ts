import { Project } from 'ts-morph';

export type Files = { [fileName: string]: string }

export async function prepareInMemoryProject(files: Files): Promise<Project> {
  files = normalizeFiles(files);
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
  const files = Object.fromEntries(
    filePaths.map((filePath, i) => [filePath, fileContent[i]])
  );
  return normalizeFiles(files);
}

export function normalizeFiles(files: Files): Files {
  return Object.fromEntries(Object.entries(files).map(([k, v]) => [k, v.trim()]));
}
