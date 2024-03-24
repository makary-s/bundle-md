import { promises as fs } from 'fs';
import * as pathUtils from 'path';
import { SYMBOLS } from './constants';
import { createMdHeader } from './utils';

type FileBlockProps = {
  rootPath: string,
  filePath: string,
  isHidden: boolean,
  fileLines: string[],
}

const getExtension = (filePath: string): string => {
  return pathUtils.extname(filePath).replace(/^\./, '')
}

class FileBlock {
  constructor(protected p: FileBlockProps) {}

  getContent(): string {
    const title = this.getHeader()

    if (this.p.isHidden) {
      return title
    }

    const body = [
      `${SYMBOLS.BRACKETS}${getExtension(this.p.filePath)}`,
      this.getBody(),
      `${SYMBOLS.BRACKETS}`,
    ].join('\n')

    return [
      title,
      body
    ].join('\n\n')
  }

  protected getHeader(): string {
    return createMdHeader(
      pathUtils.relative(this.p.rootPath, this.p.filePath), 2
    )
  }

  protected getBody(): string {
    const body = this.p.fileLines.reduce((acc, line) => {
      const escapedLine = line
        .replace(
          new RegExp(`^${SYMBOLS.BRACKETS}`), 
          SYMBOLS.ESCAPED_BRACKETS
        );

        acc.push(escapedLine);

        return acc
    }, [] as string[])

    return body.join('\n')
  }
}

type CreateFileBlockProps = Omit<FileBlockProps, 'fileLines'>

export const createFileBlock = async (p: CreateFileBlockProps): Promise<string> => {
  return new FileBlock({
    ...p,
    fileLines: await fs.readFile(p.filePath, 'utf8').then(x => x.split('\n')).catch((error) => {
      console.error('Error reading file:', p.filePath)
      throw error
    }),
  }).getContent()
}