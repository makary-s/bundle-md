import { object, array, string, optional, transform } from 'valibot';
import { DEFAULT_CONFIG } from './constants'
import { unique } from '../utils';

export const configSchema = object({
    outputExtension: optional(string(), DEFAULT_CONFIG.outputExtension),
    ignoreConfigs: transform(
        optional(array(string()), DEFAULT_CONFIG.ignoreConfigs),
        unique
    ),
    ignorePatterns: transform(
        optional(array(string()), DEFAULT_CONFIG.ignorePatterns),
        unique
    ),
    hidePatterns: transform(
        optional(array(string()), DEFAULT_CONFIG.hidePatterns),
        x => unique([...x, ...DEFAULT_CONFIG.hidePatterns])
    ),
})