export type AppEnv = 'dev' | 'test' | 'prod';

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
  traceId?: string;
}

export interface RequestOptions<TData = unknown> {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: TData;
  headers?: Record<string, string>;
  withAuth?: boolean;
  showErrorToast?: boolean;
  timeout?: number;
}

export interface EnvConfig {
  apiBaseUrl: string;
  appEnv: AppEnv;
  enableMock: boolean;
}

export interface PageStatus {
  loading: boolean;
  empty: boolean;
  errorMessage: string;
}
