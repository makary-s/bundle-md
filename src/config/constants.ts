import { BundleConfig } from "./types"

const BUNDLE_EXTENSION = 'bundle.md'
export const CONFIG_FILENAME = '.bundle-md-config.json' 

export const DEFAULT_CONFIG: BundleConfig = {
  outputExtension: BUNDLE_EXTENSION,
  ignorePatterns: [
    '**/.git/**',
    `**/*.${BUNDLE_EXTENSION}`,
  ],
  hidePatterns: [
    '**/*.svg',
    '**/*.jpg',
    '**/*.png',
    '**/*.ico',
  ],
  ignoreConfigs: [
    '.gitignore',
    CONFIG_FILENAME
  ]
}