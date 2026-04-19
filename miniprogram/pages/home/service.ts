import { currentEnv } from '../../config/index';
import { authStore } from '../../stores/auth.store';
import { messageStore } from '../../stores/message.store';

export const getHomePageData = () => ({
  envLabel: currentEnv.appEnv.toUpperCase(),
  displayName: authStore.state.displayName,
  currentRole: authStore.state.role,
  unreadCount: messageStore.state.unreadCount,
});

export const canVisitHome = (): boolean => authStore.state.isAuthenticated;

export const logoutFromHome = (): void => {
  authStore.logout();
  messageStore.reset();
};

export const getHomeRouteContext = () => authStore.state;
