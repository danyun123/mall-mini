import type { RoleCode } from '../../constants/roles';
import { ROLES } from '../../constants/roles';
import { ROUTES, type AppRoute } from '../../constants/routes';
import { authStore } from '../../stores/auth.store';
import { messageStore } from '../../stores/message.store';
import { workbenchStore } from '../../stores/workbench.store';

const syncWorkbenchSummary = (): void => {
  workbenchStore.seedByRole(authStore.state.role);
  messageStore.setUnreadCount(workbenchStore.state.summary.unreadMessageCount);
};

export const getLoginPageData = () => ({
  isAuthenticated: authStore.state.isAuthenticated,
  displayName: authStore.state.displayName,
  currentRole: authStore.state.role,
});

export const loginAsRole = (role: RoleCode): AppRoute => {
  authStore.setMockSession(role);
  syncWorkbenchSummary();

  return role === ROLES.REVIEWER ? ROUTES.WORKBENCH : ROUTES.HOME;
};

export const getLoginRouteContext = () => authStore.state;
