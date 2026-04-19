import { authStore } from '../../stores/auth.store';
import { messageStore } from '../../stores/message.store';
import { workbenchStore } from '../../stores/workbench.store';

export const getWorkbenchPageData = () => ({
  currentRole: authStore.state.role,
  summary: workbenchStore.state.summary,
  lastUpdatedAt: workbenchStore.state.lastUpdatedAt || '尚未初始化',
  unreadCount: messageStore.state.unreadCount,
});

export const canVisitWorkbench = (): boolean => authStore.state.isAuthenticated;

export const logoutFromWorkbench = (): void => {
  authStore.logout();
  messageStore.reset();
  workbenchStore.reset();
};

export const getWorkbenchRouteContext = () => authStore.state;
