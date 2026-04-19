export const ROLES = {
  PURCHASER: 'PURCHASER',
  SUPPLIER: 'SUPPLIER',
  REVIEWER: 'REVIEWER',
  ADMIN: 'ADMIN',
} as const;

export type RoleCode = (typeof ROLES)[keyof typeof ROLES];

export const ALL_ROLES: RoleCode[] = [ROLES.PURCHASER, ROLES.SUPPLIER, ROLES.REVIEWER, ROLES.ADMIN];
