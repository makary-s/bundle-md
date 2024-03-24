import * as fs from 'fs';
import ignore, { type Ignore } from 'ignore';
import * as pathUtils from 'path';
import { SYMBOLS } from './constants';
import { DEFAULT_CONFIG } from './config/constants';

export type PathMatcher = (path: string) => boolean

export const createPathMatcher = (rootPath: string, patterns: string[]): PathMatcher => {
  const ig = ignore().add(patterns);

  return (filePath: string) => {
    return ig.ignores(pathUtils.relative(rootPath, filePath));
  }
}

const parseIgnoreConfig = async (ignoreConfigPath: string): Promise<string[]> => {
  if (fs.existsSync(ignoreConfigPath) === false) {
    if (!DEFAULT_CONFIG.ignoreConfigs.includes(ignoreConfigPath)) {
      console.error('Ignore file does not exists:', ignoreConfigPath);
    }

    return []
  }

  try {
    const content = await fs.promises.readFile(ignoreConfigPath, 'utf8');
    return content
      .split('\n')
      .filter(line => line.trim() !== '' && !line.startsWith('#'));
  } catch (error) {
    console.error('Error reading ignore config file:', error);
    return [];
  }
}

export const parseIgnoreConfigs = async (ignoreConfigPaths: string[]): Promise<string[]> => {
  return await Promise.all(
    ignoreConfigPaths.map(x => parseIgnoreConfig(x))
  ).then(res => res.flatMap(x => x))
}

const walkFiles = async (
  path: string,
  callback: (props: {path: string}) => void,
  checkIgnored?: PathMatcher
) => {
  const files = await fs.promises.readdir(path, { withFileTypes: true })

  for (const file of files) {
    const filePath = pathUtils.join(path, file.name);

    if (checkIgnored && checkIgnored(filePath)) {
      return;
    }

    if (file.isDirectory()) {
      await walkFiles(filePath, callback, checkIgnored);
    } else {
      callback({path: filePath});
    }
  }
}

export async function getFilesInDirectory(path: string, checkIgnored: PathMatcher): Promise<string[]> {
  let filesList: string[] = [];

  await walkFiles(path, (current) => {
    filesList.push(current.path)
  }, checkIgnored);

  return filesList;
}

export const prepareOutputPathInput = (p: {
  outputExtension: string,
  rootPath: string,
  rawOutputPath?: string
 }) => {
  if (p.rawOutputPath === undefined) {
    return pathUtils.join(
      process.cwd(),
      `${pathUtils.basename(p.rootPath)}.${p.outputExtension}`
    )
  }

  const outputPath = pathUtils.resolve(p.rawOutputPath);

  if (fs.existsSync(outputPath) && fs.lstatSync(outputPath).isDirectory()) {
    return pathUtils.join(
      outputPath,
      `${pathUtils.basename(p.rootPath)}.${p.outputExtension}`
    )
  }

  const basename = pathUtils.basename(outputPath);

  if (basename.includes('.')) {
    return outputPath
  }

  const dir = pathUtils.dirname(outputPath);

  return pathUtils.join(
    dir, 
    `${basename}.${p.outputExtension}`
  );
}

export const createMdHeader = (text: string, level: number) => {
  return `${SYMBOLS.HEADER.repeat(level)} ${text}`
}

export const unique = <T>(arr: T[]): T[] => {
  return [...new Set(arr)]
}