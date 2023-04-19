import type { ApiResponse, SuccessResponse } from '@/common/types/api';
// import i18n, { detectCurrentLocale } from '@myrepo/umi-locale';
import { notification } from 'antd';
import type { RequestConfig } from 'umi';
import { request } from 'umi';
import type { ResponseError } from 'umi-request';
const isProduction = process.env.NODE_ENV === 'production';

/**
 * context会需要默认值，有一些方法如果一个一个去定义默认值就太麻烦了，这边提供一个
 *
 * 这边应该不会实际对用户产生实际影响，只是让context有一个默认值，就不做语言包了
 */
export function defaultReject<T>(): Promise<T> {
  return Promise.reject(new Error('uninitialized'));
}

export function isSuccessResponse<T>(
  response: ApiResponse<T>,
): response is SuccessResponse<T> {
  return response.code === 0;
}

function errorHandler(error: ResponseError) {
  if (error.response?.status === 401) {
    notification.error({
      // message: i18n.t('login.auth401', { ns: 'frontend' }),
      duration: 1.5,
      onClose: () => {
        // location.reload();
      },
      message: '授权失效',
    });
  }
  throw error;
}

export default async function <T>(url: string, options?: RequestConfig) {
  const { headers, ...restOptions } = options || {};
  const baseURL = isProduction ? '' : '/data-api';

  return request<ApiResponse<T>>(url, {
    prefix: baseURL,
    timeout: 10000,
    errorHandler,
    // timeoutMessage: i18n.t('request.timeoutMessage', { ns: 'frontend' }),
    headers: {
      // lang: detectCurrentLocale(),
      ...{
        'X-Requested-With': 'XMLHttpRequest',
        'Content-type': 'application/json',
        ...(headers || {}),
      },
    },
    ...restOptions,
  });
}
