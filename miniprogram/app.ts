import { currentEnv } from './config/index';
import { ROUTES } from './constants/routes';
import { appStore } from './stores/app.store';
import { authStore } from './stores/auth.store';
import { messageStore } from './stores/message.store';
import { workbenchStore } from './stores/workbench.store';

App<IAppOption>({
  globalData: {
    env: currentEnv,
    isAuthenticated: false,
  },
  onLaunch() {
    const systemInfo = wx.getSystemInfoSync();

    authStore.bootstrap();

    if (authStore.state.isAuthenticated) {
      workbenchStore.seedByRole(authStore.state.role);
      messageStore.setUnreadCount(workbenchStore.state.summary.unreadMessageCount);
    } else {
      workbenchStore.reset();
      messageStore.reset();
    }

    appStore.setActiveRoute(ROUTES.LAUNCH.path);
    appStore.markBootstrapped();

    this.globalData = {
      env: currentEnv,
      systemInfo,
      isAuthenticated: authStore.state.isAuthenticated,
    };
  },
});
