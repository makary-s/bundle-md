import * as pathUtils from 'path';
import * as fs from 'fs';
import 'os'
import { createMdHeader, createPathMatcher, getFilesInDirectory } from './utils';
import { createFileBlock } from './file-block';

interface SaveBundleProps {
  rootPath: string, 
  outputPath: string, 
  ignorePathPatterns: string[], 
  hiddenPathPatterns: string[],
}

export const saveBundle = async (p: SaveBundleProps) => {
  const checkIgnored = createPathMatcher(p.rootPath, p.ignorePathPatterns)
  const checkHidden = createPathMatcher(p.rootPath, p.hiddenPathPatterns)

  const files = await getFilesInDirectory(p.rootPath, checkIgnored)

  const blocks = await Promise.all(files.map((filePath) => 
    createFileBlock({
      rootPath: p.rootPath,
      filePath,
      isHidden: checkHidden(filePath)
  })
  ))

  const bundle = [
    createMdHeader(pathUtils.basename(p.rootPath), 1), 
    blocks.join('\n\n')
  ].join('\n\n')

  await fs.promises.writeFile(p.outputPath, bundle, 'utf8');

  console.log(`Bundle file saved to ./${pathUtils.relative(process.cwd(), p.outputPath)}`);
}
