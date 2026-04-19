import { currentEnv } from '../../config/index';
import type { ApiResponse, RequestOptions } from '../../types/common';
import { getAuthHeader } from './auth';
import { normalizeRequestError } from './error';
import { logger } from './logger';

const DEFAULT_TIMEOUT = 10000;
let requestSequence = 0;

const createTraceId = (): string => {
  requestSequence += 1;
  return `trace-${Date.now()}-${requestSequence}`;
};

export const request = <TResponse, TData = unknown>(
  options: RequestOptions<TData>,
): Promise<ApiResponse<TResponse>> =>
  new Promise((resolve, reject) => {
    const traceId = createTraceId();

    wx.request({
      url: `${currentEnv.apiBaseUrl}${options.url}`,
      method: options.method ?? 'GET',
      data: options.data as WechatMiniprogram.IAnyObject | undefined,
      timeout: options.timeout ?? DEFAULT_TIMEOUT,
      header: {
        'content-type': 'application/json',
        'x-client-platform': 'miniprogram',
        'x-trace-id': traceId,
        ...(options.withAuth ? getAuthHeader() : {}),
        ...(options.headers ?? {}),
      },
      success: (response) => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          const payload = response.data as ApiResponse<TResponse>;

          resolve({
            ...payload,
            traceId: payload.traceId ?? traceId,
          });
          return;
        }

        const appError = normalizeRequestError({
          statusCode: response.statusCode,
          traceId,
          url: options.url,
          data: response.data,
        });

        if (options.showErrorToast !== false) {
          wx.showToast({
            title: appError.message,
            icon: 'none',
          });
        }

        logger.error('Request failed', appError);
        reject(appError);
      },
      fail: (error) => {
        const appError = normalizeRequestError({
          message: error.errMsg,
          traceId,
          url: options.url,
        });

        if (options.showErrorToast !== false) {
          wx.showToast({
            title: appError.message,
            icon: 'none',
          });
        }

        logger.error('Network request failed', appError);
        reject(appError);
      },
    });
  });
