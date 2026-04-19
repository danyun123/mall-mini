import { storage } from './storage';

const AUTH_SESSION_KEY = 'mall-mini.auth-session';

export interface AuthSession {
  accessToken: string;
  role: import('../../constants/roles').RoleCode;
  displayName: string;
  expiresAt?: string;
}

export const getStoredSession = (): AuthSession | null =>
  storage.get<AuthSession>(AUTH_SESSION_KEY);

export const saveSession = (session: AuthSession): void => {
  storage.set(AUTH_SESSION_KEY, session);
};

export const clearSession = (): void => {
  storage.remove(AUTH_SESSION_KEY);
};

export const getAuthHeader = (): Record<string, string> => {
  const session = getStoredSession();

  if (!session?.accessToken) {
    return {};
  }

  return {
    Authorization: `Bearer ${session.accessToken}`,
  };
};
