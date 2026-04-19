import { action, observable } from 'mobx-miniprogram';
import { ROLES, type RoleCode } from '../constants/roles';

export interface WorkbenchSummary {
  pendingOrders: number;
  pendingAuditCount: number;
  unreadMessageCount: number;
}

const emptySummary: WorkbenchSummary = {
  pendingOrders: 0,
  pendingAuditCount: 0,
  unreadMessageCount: 0,
};

const state = observable({
  summary: emptySummary,
  lastUpdatedAt: '',
});

const getSummaryByRole = (role: RoleCode): WorkbenchSummary => {
  if (role === ROLES.REVIEWER) {
    return {
      pendingOrders: 0,
      pendingAuditCount: 5,
      unreadMessageCount: 4,
    };
  }

  return {
    pendingOrders: 3,
    pendingAuditCount: 1,
    unreadMessageCount: 2,
  };
};

export const workbenchStore = {
  state,
  seedByRole: action((role: RoleCode) => {
    state.summary = getSummaryByRole(role);
    state.lastUpdatedAt = new Date().toISOString();
  }),
  reset: action(() => {
    state.summary = emptySummary;
    state.lastUpdatedAt = '';
  }),
};
