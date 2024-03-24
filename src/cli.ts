#!/usr/bin/env node

import { saveBundle } from './save';
import { Command } from 'commander';
import { parseIgnoreConfigs, prepareOutputPathInput } from './utils';
import * as pathUtils from 'path';
import { getConfig } from './config';
import { CONFIG_FILENAME } from './config/constants';

type CommandOptions = {
  hide?: string[];
  ignore?: string[];
  config?: string;
  output: string
}

const program = new Command();

program
  .name('bundle-md')
  .description([
    "Generates a single Markdown bundle file (*.bundle.md) that includes the text from files in a specified directory and its subdirectories.",
    "Each file is represented as a Markdown header with its content in a code block."
  ].join('\n'))
  .argument('<root-directory>', 'Path to the input directory.')
  .option('--output <path>', 'Path to the output file or directory. If not provided, the root directory name will be used as the file name.')
  .option('--hide <files...>', 'Glob pattern for files whose content should be hidden but still listed (e. g., images, binary files).')
  .option('--ignore <paths...>', 'Glob pattern for paths to exclude from the output. ".git" is excluded by default.')
  .option('--config <config>', `Path to a custom config file. The default is "${CONFIG_FILENAME}". See below for the config file format.`)
  .action(async (rawRootPath: string, options: CommandOptions) => {
    const rootPath = pathUtils.resolve(rawRootPath)

    const config = getConfig(rootPath, options.config)

    await saveBundle({
        hiddenPathPatterns: config.hidePatterns.concat(options.hide ?? []),
        ignorePathPatterns: [
          ...config.ignorePatterns,
          ...options.ignore ?? [],
          ...await parseIgnoreConfigs(config.ignoreConfigs),
        ],
        outputPath: prepareOutputPathInput({
          outputExtension: config.outputExtension,
          rootPath,
          rawOutputPath: options.output,
        }),
        rootPath,
      });
  })
  .addHelpText('after', `
  Config File Format:
    The configuration file should be a JSON file with the following optional fields:
      - outputExtension: (string) The file extension for the output file. Default is "bundle.md".
      - ignoreConfigs: (string[]) Array of paths to ignore configuration files (e.g., .gitignore) that specify patterns for files and directories to exclude.
      - ignorePatterns: (string[]) Array of glob patterns for files and directories to exclude from the output.
      - hidePatterns: (string[]) Array of glob patterns for files whose content should be hidden in the output but still listed.
  `)
  .showHelpAfterError('(add --help for additional information)')
  .parse();