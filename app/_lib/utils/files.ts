import fs from "fs";
import path from "path";

const getAllFilesRecursively = (folder: string): string[] => {
  const files = fs.readdirSync(folder);
  const filesWithFullPath = files.map((file) => path.join(folder, file));
  const filesWithFullPathAndRecursion = filesWithFullPath.map((file) =>
    fs.statSync(file).isFile() ? [file] : getAllFilesRecursively(file)
  );
  return filesWithFullPathAndRecursion.flat();
};

export default getAllFilesRecursively;
