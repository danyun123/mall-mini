import { currentEnv } from './config/index';
import { ROUTES } from './constants/routes';
import { appStore } from './stores/app.store';

App<IAppOption>({
  globalData: {
    env: currentEnv,
    isAuthenticated: false,
  },
  onLaunch() {
    const systemInfo = wx.getSystemInfoSync();

    // 当前阶段只保留工程启动骨架，真实认证和工作台状态在对应功能落地时再接入。
    appStore.setActiveRoute(ROUTES.LAUNCH.path);
    appStore.markBootstrapped();

    this.globalData = {
      env: currentEnv,
      systemInfo,
      isAuthenticated: false,
    };
  },
});
