import { envDev } from './env.dev';
import { envProd } from './env.prod';
import { envTest } from './env.test';
import type { AppEnv, EnvConfig } from '../types/common';

const resolveAppEnv = (): AppEnv => {
  try {
    const envVersion = wx.getAccountInfoSync().miniProgram.envVersion;

    if (envVersion === 'release') {
      return 'prod';
    }

    if (envVersion === 'trial') {
      return 'test';
    }
  } catch {
    return 'dev';
  }

  return 'dev';
};

const envMap: Record<AppEnv, EnvConfig> = {
  dev: envDev,
  test: envTest,
  prod: envProd,
};

export const currentEnv = envMap[resolveAppEnv()];
