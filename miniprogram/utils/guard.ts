import type { RoleCode } from '../constants/roles';
import type { RouteMeta } from '../types/route';

export interface RouteAccessContext {
  isAuthenticated: boolean;
  role?: RoleCode;
}

export const canAccessRoute = (route: RouteMeta, context: RouteAccessContext): boolean => {
  if (route.requiresAuth && !context.isAuthenticated) {
    return false;
  }

  if (!route.roles || route.roles.length === 0) {
    return true;
  }

  return context.role !== undefined && route.roles.includes(context.role);
};
