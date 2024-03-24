import * as pathUtils from 'path';
import * as fs from 'fs';
import { BundleConfig } from './types';
import { CONFIG_FILENAME } from './constants';
import { configSchema } from './schemas';
import { parse } from 'valibot';

export const getConfig = (rootPath: string, customConfigPath?: string): BundleConfig => {
  const configPath = customConfigPath || pathUtils.join(rootPath, CONFIG_FILENAME);

  const rawConfig = fs.existsSync(configPath) 
    ? fs.readFileSync(configPath, 'utf8') 
    : {}

  return parse(
    configSchema,
    rawConfig
  );
}