import type { RoleCode } from '../constants/roles';

export interface RouteMeta {
  path: string;
  title: string;
  requiresAuth: boolean;
  roles?: RoleCode[];
}
