export interface AppError extends Error {
  code: string;
  traceId?: string;
  statusCode?: number;
  details?: unknown;
}

interface RequestErrorPayload {
  message?: string;
  statusCode?: number;
  traceId: string;
  url: string;
  data?: unknown;
}

export const normalizeRequestError = ({
  message,
  statusCode,
  traceId,
  url,
  data,
}: RequestErrorPayload): AppError => {
  const fallbackMessage =
    statusCode === 401 ? '登录状态已失效，请重新登录。' : '请求失败，请稍后再试。';
  const errorMessage = message ?? fallbackMessage;
  const appError = new Error(errorMessage) as AppError;

  appError.name = 'AppError';
  appError.code = statusCode ? `HTTP_${statusCode}` : 'NETWORK_ERROR';
  appError.traceId = traceId;
  appError.statusCode = statusCode;
  appError.details = {
    url,
    data,
  };

  return appError;
};
