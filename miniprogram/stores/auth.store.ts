import { action, observable } from 'mobx-miniprogram';
import { ROLES, type RoleCode } from '../constants/roles';
import {
  clearSession,
  getStoredSession,
  saveSession,
  type AuthSession,
} from '../services/core/auth';

const state = observable({
  isAuthenticated: false,
  role: ROLES.PURCHASER as RoleCode,
  displayName: '未登录',
  accessToken: '',
  lastCheckedAt: '',
});

const applySession = (session: AuthSession | null): void => {
  state.isAuthenticated = Boolean(session?.accessToken);
  state.role = session?.role ?? ROLES.PURCHASER;
  state.displayName = session?.displayName ?? '未登录';
  state.accessToken = session?.accessToken ?? '';
};

export const authStore = {
  state,
  bootstrap: action(() => {
    applySession(getStoredSession());
    state.lastCheckedAt = new Date().toISOString();
  }),
  setMockSession: action((role: RoleCode) => {
    const session: AuthSession = {
      accessToken: `mock-${role.toLowerCase()}`,
      role,
      displayName: role === ROLES.REVIEWER ? '审查人员' : '采购人员',
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    };

    saveSession(session);
    applySession(session);
    state.lastCheckedAt = new Date().toISOString();
  }),
  logout: action(() => {
    clearSession();
    applySession(null);
    state.lastCheckedAt = new Date().toISOString();
  }),
};
