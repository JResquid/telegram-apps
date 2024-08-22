import { initData } from '@telegram-apps/transformers';
import type { InitData } from '@telegram-apps/types';

/**
 * Parses incoming value as init data.
 * @param value - value to check.
 * @throws {} Parsing errors.
 */
export function parse(value: unknown): InitData {
  return initData()(value);
}