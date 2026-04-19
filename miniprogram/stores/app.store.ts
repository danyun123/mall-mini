import { action, observable } from 'mobx-miniprogram';
import { currentEnv } from '../config/index';
import { ROUTES } from '../constants/routes';
import type { AppEnv } from '../types/common';

const state = observable({
  bootstrapped: false,
  currentEnv: currentEnv.appEnv as AppEnv,
  activeRoute: ROUTES.LAUNCH.path as string,
});

export const appStore = {
  state,
  markBootstrapped: action(() => {
    state.bootstrapped = true;
  }),
  setActiveRoute: action((path: string) => {
    state.activeRoute = path;
  }),
};
